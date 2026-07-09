# Configuration MCP (Model Context Protocol)

Les serveurs MCP étendent l'assistant de développement. Cette page documente
ceux **recommandés** pour ce projet, leur rôle et une configuration type.

> Les serveurs MCP se déclarent au niveau du client (Claude Code, IDE, etc.),
> pas dans le code applicatif. Selon l'environnement, l'installation se fait via
> `claude mcp add ...` ou l'UI des connecteurs. En session non interactive,
> l'autorisation OAuth doit être faite au préalable.

## Serveurs recommandés

### 1. `filesystem` — lecture/écriture des fichiers

Rôle : parcourir et éditer le dépôt (docs, `src/`, données d'événements).
Usage projet : maintenir la doc, ajouter des définitions d'événements, refactorer.

### 2. `git` — commits propres par étape

Rôle : `status`, `diff`, `add`, `commit`, `log`.
Usage projet : un commit par phase (voir ROADMAP), messages descriptifs, revue
des diffs avant validation. Ce dépôt n'est pas encore initialisé (`git init`).

### 3. `memory` / `project-context` — mémoire des décisions

Rôle : conserver les **règles calendaires** et **décisions d'architecture** entre
sessions (époque JDN = 1 724 221, DTEND exclusif, décalage ±1 jour, etc.).
Usage projet : éviter de re-dériver les constantes et de réintroduire des bugs
déjà résolus.

### 4. `browser` / `search` (si disponible) — vérification des sources

Rôle : vérifier dates liturgiques, bâhre hasab, règles pascales auprès de
sources fiables.
Usage projet : validation par `calendar-research-agent` avant d'ajouter/modifier
une fête. **Toujours confirmer** les dates cultuelles auprès de sources
ecclésiales.

### 5. `test-runner` — exécution des tests

Rôle : lancer Vitest après chaque étape et remonter les échecs.
Usage projet : `npm test` après toute modification de conversion ou de données.
À défaut de serveur dédié, utiliser la commande directement.

## Exemple de configuration (`.mcp.json` / client)

```jsonc
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

> Les noms de paquets ci-dessus sont indicatifs ; adaptez à ceux réellement
> disponibles dans votre écosystème. `browser`/`search` et `test-runner`
> dépendent de l'environnement.

## Bonnes pratiques

- **Séquencer** : recherche (browser) → documentation (filesystem) → code
  (filesystem) → tests (test-runner) → commit (git).
- **Persister** les décisions calendaires dans `memory` dès qu'elles sont prises.
- **Ne jamais** committer une modification de règle calendaire sans mise à jour
  correspondante de `docs/CALENDAR_RULES.md` (voir AGENTS.md `docs-agent`).
