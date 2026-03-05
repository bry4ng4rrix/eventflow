'use client';

/**
 * @fileoverview Page d'inscription utilisateur
 * Formulaire d'inscription avec validation et création de compte.
 *
 * @module app/register/page
 * @requires react - useState pour le state local
 * @requires next/navigation - Redirection après inscription
 * @requires zod - Validation des données du formulaire
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'inscription
 */
const registerSchema = z.object({
    firstname: z
        .string()
        .min(1, "Le prénom est requis")
        .max(50, "Le prénom est trop long"),
    lastname: z
        .string()
        .min(1, "Le nom est requis")
        .max(50, "Le nom est trop long"),
    email: z
        .string()
        .email("Email invalide")
        .max(255, "L'email est trop long"),
    password: z
        .string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .max(128, "Le mot de passe est trop long"),
    confirmPassword: z
        .string()
        .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

/**
 * Page d'inscription - Formulaire de création de compte
 *
 * Fonctionnalités :
 * - Saisie des informations utilisateur
 * - Validation des champs en temps réel
 * - Soumission vers l'API d'inscription
 * - Redirection vers login après inscription réussie
 *
 * @function RegisterPage
 * @returns {JSX.Element} Formulaire d'inscription
 */
export default function RegisterPage() {
    const router = useRouter();

    // ==================== STATE LOCAL ====================
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    /**
     * Gestionnaire de changement des champs du formulaire
     * Met à jour le state et valide le champ modifié
     *
     * @function handleChange
     * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validation en temps réel du champ modifié
        try {
            registerSchema.parse({ ...formData, [name]: value });
            setErrors(prev => ({ ...prev, [name]: undefined }));
        } catch (validationError) {
            const fieldErrors = {};
            validationError.errors.forEach(err => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
        }
    };

    /**
     * Gestionnaire de soumission du formulaire
     * Valide toutes les données et crée le compte utilisateur
     *
     * @async
     * @function handleSubmit
     * @param {React.FormEvent} event - Événement de soumission
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setSubmitError('');

        try {
            // Validation complète du formulaire
            const validatedData = registerSchema.parse(formData);

            // Appel API d'inscription
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstname: validatedData.firstname,
                    lastname: validatedData.lastname,
                    email: validatedData.email,
                    password: validatedData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (response.status === 409) {
                    throw new Error('Cet email est déjà utilisé');
                }
                
                throw new Error(errorData.message || "L'inscription a échoué");
            }

            // Redirection vers la page de connexion après inscription réussie
            router.push('/login?message=inscription_reussie');
        } catch (error) {
            if (error.name === 'ZodError') {
                // Erreurs de validation
                const fieldErrors = {};
                error.errors.forEach(err => {
                    fieldErrors[err.path[0]] = err.message;
                });
                setErrors(fieldErrors);
            } else {
                // Erreur de soumission
                setSubmitError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">Créer un compte</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Formulaire d'inscription */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ==================== MESSAGE D'ERREUR GÉNÉRAL ==================== */}
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {submitError}
                            </div>
                        )}

                        {/* ==================== CHAMP PRÉNOM ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="firstname">Prénom</Label>
                            <Input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="Prénom"
                                className={errors.firstname ? 'border-red-500' : ''}
                            />
                            {errors.firstname && (
                                <p className="text-red-500 text-sm">{errors.firstname}</p>
                            )}
                        </div>

                        {/* ==================== CHAMP NOM ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="lastname">Nom</Label>
                            <Input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Nom"
                                className={errors.lastname ? 'border-red-500' : ''}
                            />
                            {errors.lastname && (
                                <p className="text-red-500 text-sm">{errors.lastname}</p>
                            )}
                        </div>

                        {/* ==================== CHAMP EMAIL ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        {/* ==================== CHAMP MOT DE PASSE ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mot de passe (min. 6 caractères)"
                                className={errors.password ? 'border-red-500' : ''}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}
                        </div>

                        {/* ==================== CHAMP CONFIRMATION MOT DE PASSE ==================== */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirmer le mot de passe"
                                className={errors.confirmPassword ? 'border-red-500' : ''}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* ==================== BOUTON SUBMIT ==================== */}
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Inscription...' : 'Créer un compte'}
                        </Button>

                        {/* ==================== LIEN VERS CONNEXION ==================== */}
                        <div className="text-center text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
