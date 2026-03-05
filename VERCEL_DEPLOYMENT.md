# EventFlow - Vercel Deployment Guide

## Environment Variables Required

Pour corriger l'erreur `MIDDLEWARE_INVOCATION_FAILED`, vous devez configurer ces variables d'environnement dans votre dashboard Vercel :

### 1. JWT_SECRET (Obligatoire)
- **Description**: Clé secrète pour signer les tokens JWT
- **Valeur**: Générez une clé sécurisée avec :
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Exemple**: `b4d1f4c4151a5b1d129ab48431d5c96fb359de33654462bb2884f1f0fb0c1bef8a10fd5c7a6a9fb499ed207918a617b3a69db5cdfb6545beb9941f228ae9127c`

### 2. NODE_ENV (Optionnel)
- **Valeur**: `production`

## Configuration Steps

1. Allez dans votre dashboard Vercel
2. Sélectionnez votre projet EventFlow
3. Cliquez sur "Settings" → "Environment Variables"
4. Ajoutez `JWT_SECRET` avec votre clé générée
5. Redéployez votre application

## Validation

Après configuration, le middleware pourra charger correctement et l'erreur disparaîtra.
