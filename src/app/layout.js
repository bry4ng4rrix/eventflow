/**
 * @fileoverview Layout racine de l'application EventHub
 * Définit la structure globale : polices, providers, header/footer.
 *
 * @module app/layout
 * @requires contexts/* - Providers de contexte React
 * @requires components/Header - En-tête de navigation
 * @requires components/Footer - Pied de page
 */

import "./globals.css";
import { EventsProvider } from "../contexts/EventsContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { InscriptionsProvider } from "@/contexts/InscriptionsContext";
import { LoginProvider } from "@/contexts/LoginContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import Providers from "./providers";

/**
 * Métadonnées SEO de l'application
 * Utilisées par Next.js pour générer les balises <head>
 * @constant {Object}
 */
export const metadata = {
  title: "EventHub - Découvrez et participez aux événements",
  description: "Plateforme de gestion d'événements pour le collectif EventHub",
};

/**
 * Layout racine de l'application Next.js
 *
 * Structure de la hiérarchie des providers (ordre important) :
 * 1. LoginProvider - Authentification (base, pas de dépendances)
 * 2. UsersProvider - Liste des utilisateurs
 * 3. CategoriesProvider - Catégories d'événements
 * 4. EventsProvider - Liste des événements
 * 5. InscriptionsProvider - Inscriptions (dépend de users et events)
 *
 * @function RootLayout
 * @param {Object} props - Props du composant
 * @param {React.ReactNode} props.children - Pages enfants à rendre
 * @returns {JSX.Element} Structure HTML complète de l'application
 */
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      {/* Utilisation des polices système avec antialiasing */}
      <body className="antialiased">
        {/* Toaster global pour les notifications */}
        <Toaster position="top-right" richColors closeButton />
        {/*
          Hiérarchie des providers de contexte
          L'ordre est important : les providers extérieurs n'ont pas accès
          aux données des providers intérieurs
        */}
        <Providers>
          {/* Container flex pour sticky footer */}
          <div className="min-h-screen flex flex-col">
            {/* Header fixe en haut */}
            <Header />
            {/*
                Zone de contenu principal
                flex-1 : prend tout l'espace disponible
                pt-16 : padding-top pour compenser le header fixe
            */}
            <main className="flex-1 pt-16">
              {children}
            </main>
            {/* Footer collé en bas grâce au flex */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
