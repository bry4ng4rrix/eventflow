'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useLogin } from '@/hooks/useLogin';

/**
 * Context pour la gestion des utilisateurs
 * @type {React.Context}
 */
export const UsersContext = createContext();

/**
 * Provider pour le context des utilisateurs
 * Gère le state global des utilisateurs
 * @param {Object} props - Props du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} Provider avec les utilisateurs
 */
export const UsersProvider = ({ children }) => {
    const { user, isLoading: authLoading } = useLogin();
    
    // Liste des utilisateurs
    const [users, setUsers] = useState([]);
    // État de chargement
    const [isLoading, setIsLoading] = useState(false);
    // Erreur éventuelle
    const [error, setError] = useState(null);

    // Index pour recherche O(1) par ID
    const [usersIndex, setUsersIndex] = useState({});

    // Reconstruction de l'index quand les utilisateurs changent
    useEffect(() => {
        const index = {};
        users.forEach(user => {
            index[String(user.id)] = user; // Support string et number
        });
        setUsersIndex(index);
    }, [users]);

    // Chargement des utilisateurs seulement si l'utilisateur est authentifié
    useEffect(() => {
        if (!user || authLoading) {
            // Ne pas charger les utilisateurs si non authentifié ou en cours d'auth
            setUsers([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        (async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('/api/users', {
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Non autorisé - probablement déconnecté entre temps
                        setUsers([]);
                        setError(null);
                        return;
                    }
                    throw new Error('Erreur lors du chargement des utilisateurs');
                }

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err);
                console.error('Erreur fetch users:', err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [user, authLoading]);

    /**
     * Récupère un utilisateur par son ID (O(1) avec index)
     * @param {string|number} id - ID de l'utilisateur
     * @returns {Object|undefined} L'utilisateur trouvé ou undefined
     */
    const getUser = useCallback((id) => {
        return usersIndex[String(id)] || undefined;
    }, [usersIndex]);

    // Valeur exposée par le context
    return (
        <UsersContext.Provider value={{
            users,
            isLoading,
            error,
            getUser,
        }}>
            {children}
        </UsersContext.Provider>
    );
};
