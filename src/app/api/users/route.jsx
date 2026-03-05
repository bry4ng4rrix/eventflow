/**
 * @fileoverview API Route for user collection operations.
 *
 * Provides :
 * - GET /api/users  — returns all users (auth required, passwords excluded)
 * - POST /api/users — creates a new user account (public, password is hashed)
 *
 * @module api/users
 * @requires next/server
 * @requires uuid
 * @requires zod
 * @requires bcryptjs
 * @requires fs/promises
 * @requires path
 * @requires lib/auth
 */

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { getSessionFromCookie } from '@/lib/auth';

/**
 * Path to the users data file.
 * @constant {string}
 */
export const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

/**
 * The bcrypt cost factor. Higher = slower to hash, harder to brute-force.
 * 12 is a good balance between security and response time on typical hardware
 * (roughly 200-400ms to hash one password, which is acceptable for login).
 * @constant {number}
 */
const BCRYPT_COST = 12;

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Zod schema for new user creation.
 * The password field enforces a minimum length.
 * Email format is validated by Zod's built-in `.email()` check.
 *
 * @constant {z.ZodObject}
 */
const createUserSchema = z.object({
    firstname: z
        .string({ required_error: 'First name is required' })
        .min(1, 'First name is required')
        .max(50, 'First name must not exceed 50 characters')
        .trim(),

    lastname: z
        .string({ required_error: 'Last name is required' })
        .min(1, 'Last name is required')
        .max(50, 'Last name must not exceed 50 characters')
        .trim(),

    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email address')
        .max(255, 'Email is too long')
        .toLowerCase(),   // Normalize to lowercase before storing

    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password is too long'),
});

/**
 * Utility function to strip the password field from a user object before
 * sending it in a response.
 *
 * @function sanitizeUser
 * @param {Object} user - The raw user object from the data store
 * @returns {Object} The user object without the password field
 */
function sanitizeUser({ password: _excluded, ...safeUser }) {
    return safeUser;
}


// ─────────────────────────────────────────────────────────────────────────────
// ROUTE HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Returns all users. Passwords are excluded from every response.
 * Requires authentication.
 *
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} Array of user objects without passwords (200), or 401
 */
export async function GET() {
    // Verify the session before returning any user data
    const session = await getSessionFromCookie();
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dataJsonString = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(dataJsonString);

        // Sanitize every user record before returning — passwords are never sent to clients
        return NextResponse.json(users.map(sanitizeUser));
    } catch {
        return NextResponse.json({ message: 'Could not load users' }, { status: 500 });
    }
}

/**
 * POST /api/users
 * Creates a new user account. The password is hashed with bcrypt before storage.
 * This endpoint is intentionally public to allow new user registration.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>}
 *   - 201 with the new user (no password) on success
 *   - 400 if validation fails
 *   - 409 if the email is already registered
 *   - 500 if the data file cannot be read or written
 *
 * @example
 * // Request body
 * {
 *   "firstname": "Marie",
 *   "lastname": "Martin",
 *   "email": "marie@example.com",
 *   "password": "securepassword123"
 * }
 *
 * @example
 * // Response body (201)
 * { "id": "uuid", "firstname": "Marie", "lastname": "Martin", "email": "marie@example.com" }
 */
export async function POST(request) {
    // ─────────────────────────────────────────────────────────────────────────
    // STEP 1 : Parse and validate the request body
    // ─────────────────────────────────────────────────────────────────────────
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
        const errors = validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
        }));
        return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    const { firstname, lastname, email, password } = validation.data;

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 2 : Check for duplicate email
    // ─────────────────────────────────────────────────────────────────────────
    let users;
    try {
        const dataJsonString = await fs.readFile(usersFilePath, 'utf-8');
        users = JSON.parse(dataJsonString);
    } catch {
        return NextResponse.json({ message: 'Could not load users' }, { status: 500 });
    }

    const emailAlreadyExists = users.some(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailAlreadyExists) {
        return NextResponse.json(
            { message: 'An account with this email already exists' },
            { status: 409 }
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 3 : Hash the password and create the new user
    //
    // bcrypt.hash generates a salt internally and returns the full hash string
    // (which includes the salt, so we only need to store this one string).
    // ─────────────────────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    const newUser = {
        id: uuidv4(),
        firstname,
        lastname,
        email,
        password: hashedPassword,   // The plain-text password is never stored
    };

    // ─────────────────────────────────────────────────────────────────────────
    // STEP 4 : Persist and respond
    // ─────────────────────────────────────────────────────────────────────────
    try {
        users.push(newUser);
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 4));

        // Return 201 Created, sanitized (no password in response)
        return NextResponse.json(sanitizeUser(newUser), { status: 201 });
    } catch {
        return NextResponse.json({ message: 'Could not save the user' }, { status: 500 });
    }
}
