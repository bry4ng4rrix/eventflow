'use client';

/**
 * @fileoverview Page de connexion utilisateur
 * Formulaire simple email/password avec redirection après login.
 *
 * @module app/login/page
 * @requires react - useState pour le state local
 * @requires next/navigation - Redirection après connexion
 * @requires hooks/useLogin - Hook d'authentification
 *
 * @security Cette page transmet les credentials au LoginContext
 * qui effectue l'appel API. Voir api/login pour les considérations
 * de sécurité (pas de hash, pas de JWT en dev).
 */

import { useLogin } from "@/hooks/useLogin";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Component that handles the search params logic
 */
function SearchParamsHandler({ setSuccessMessage }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const message = searchParams.get('message');
        if (message === 'inscription_reussie') {
            setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        }
    }, [searchParams]);

    return null;
}

/**
 * Page de connexion - Formulaire d'authentification
 *
 * Fonctionnalités :
 * - Saisie email et mot de passe
 * - Soumission vers l'API de login
 * - Redirection vers l'accueil après connexion réussie
 *
 * @function LoginPage
 * @returns {JSX.Element} Formulaire de connexion
 *
 * @example
 * // Route: /login
 * // Affiche le formulaire de connexion
 *
 * @todo Amélioration possible : Afficher les erreurs de connexion
 * @todo Amélioration possible : Ajouter validation des champs
 * @todo Amélioration possible : Gérer le cas "déjà connecté"
 */
export default function LoginPage() {
    // Hook d'authentification - fournit la fonction login()
    const { login } = useLogin();

    // Router Next.js pour la redirection post-login
    const router = useRouter();

    // ==================== STATE LOCAL ====================
    // Email saisi par l'utilisateur
    const [email, setEmail] = useState('');

    // Mot de passe saisi
    const [password, setPassword] = useState('');

    // Messages d'erreur
    const [errors, setErrors] = useState('');

    // Message de succès (inscription réussie)
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * Gestionnaire de soumission du formulaire
     * Authentifie l'utilisateur et redirige vers l'accueil
     *
     * @async
     * @function handleSubmit
     * @param {React.FormEvent} event - Événement de soumission
     */
    const handleSubmit = async (event) => {
        // Empêche le rechargement de la page
        event.preventDefault();

        try {
            // Appel API de connexion via le context
            await login(email, password);

            // Redirection vers la page d'accueil seulement si login réussi
            router.push('/');
        } catch (error) {
            // Afficher l'erreur de connexion
            setErrors(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParamsHandler setSuccessMessage={setSuccessMessage} />
            </Suspense>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Formulaire de connexion */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ==================== MESSAGE DE SUCCÈS ==================== */}
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}

                        {/* ==================== MESSAGE D'ERREUR ==================== */}
                        {errors && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {errors}
                            </div>
                        )}
                        {/* ==================== CHAMP EMAIL ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>

                        {/* ==================== CHAMP PASSWORD ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>

                        {/* ==================== BOUTON SUBMIT ==================== */}
                        <Button type="submit" className="w-full">
                            Login
                        </Button>

                        {/* ==================== LIEN VERS INSCRIPTION ==================== */}
                        <div className="text-center text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Créer un compte
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
