# Défis CPE et Intelligence Artificielle

Application web interactive pour découvrir et relever des défis liés à l'utilisation de l'IA dans le contexte CPE.

## Structure du projet

- `index.html` - Structure HTML de l'application
- `styles.css` - Styles CSS personnalisés
- `script.js` - Logique JavaScript de l'application
- `challenges.json` - **Données des défis (facile à modifier)**

## Comment modifier le contenu des cartes de défis

### Fichier à éditer : `challenges.json`

Tous les contenus des défis sont stockés dans le fichier `challenges.json`. Ce fichier est structuré de façon simple et peut être modifié avec n'importe quel éditeur de texte.

### Structure d'un défi

Chaque défi a la structure suivante :

```json
{
    "nom_du_defi": {
        "title": "Titre du défi",
        "icon": "🎯",
        "description": "Description courte du défi",
        "tools": [
            "Outil recommandé 1",
            "Outil recommandé 2"
        ],
        "steps": [
            {
                "title": "1. Titre de l'étape",
                "content": "Description de l'étape"
            }
        ],
        "help": {
            "difficulty": "⭐⭐ Facile",
            "duration": "15-20 minutes",
            "tips": [
                "Conseil 1",
                "Conseil 2"
            ],
            "example": "Exemple concret",
            "pitfalls": [
                "Piège à éviter 1",
                "Piège à éviter 2"
            ]
        }
    }
}
```

### Exemples de modifications

#### Modifier le titre d'un défi

Cherchez le défi dans `challenges.json` et modifiez la propriété `title` :

```json
"courriel": {
    "title": "Nouveau titre du défi",
    ...
}
```

#### Ajouter un conseil

Dans la section `help.tips`, ajoutez un nouveau conseil :

```json
"tips": [
    "Conseil existant 1",
    "Conseil existant 2",
    "Nouveau conseil"
]
```

#### Modifier la difficulté

Changez la propriété `help.difficulty` :

```json
"difficulty": "⭐⭐⭐ Moyen"
```

#### Ajouter un nouveau défi

Ajoutez un nouveau bloc au fichier JSON en respectant la structure ci-dessus.

### Icônes disponibles

Vous pouvez utiliser n'importe quel emoji Unicode comme icône :
- 📧 Courriel
- 📝 Document
- 🎨 Art/Créativité
- 🛡️ Sécurité
- 🎯 Objectif
- ❓ Question
- 📊 Données
- 📏 Mesure
- 💬 Communication

### Notes importantes

1. **Format JSON** : Respectez la syntaxe JSON (guillemets doubles, virgules, etc.)
2. **Caractères spéciaux** : Échappez les guillemets avec `\"`
3. **Validation** : Utilisez un validateur JSON en ligne pour vérifier la syntaxe
4. **Sauvegarde** : Gardez toujours une copie de sauvegarde avant modification

## Licence

CC BY-NC 4.0 - Créé par Donatien Wagner pour la DRANE Orléans-Tours
