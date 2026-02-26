Crée des tâches GitHub Issues pour le projet handytalk à partir de ce que l'utilisateur décrit.

## Instructions

1. Demande à l'utilisateur de décrire les tâches qu'il veut créer (s'il ne les a pas déjà listées dans son message)
2. Pour chaque tâche, crée une GitHub Issue avec `gh issue create` :
   - Titre clair et concis
   - Body avec description, critères d'acceptation si pertinent
   - Labels appropriés parmi : `feature`, `bug`, `chore`, `improvement`
   - Crée les labels s'ils n'existent pas encore avec `gh label create`
3. À la fin, affiche un récap de toutes les issues créées avec leurs numéros et URLs

## Règles

- Utilise toujours `gh` CLI, jamais l'API directement
- Si le repo n'a pas de remote ou que `gh` n'est pas authentifié, préviens l'utilisateur
- Chaque issue doit être actionnable et spécifique
- N'assigne pas les issues sauf si l'utilisateur le demande

## Input utilisateur

$ARGUMENTS
