# Charte Graphique EcoRide

Ce guide définit les règles d’uniformisation des composants front-end du projet EcoRide.  
Respecter cette charte garantit une expérience utilisateur cohérente, moderne et accessible.

---

## 1. Palette de couleurs

| Nom            | Classe Tailwind      | Code Hex     | Usage principal           |
|----------------|---------------------|--------------|--------------------------|
| Bleu foncé     | `primary-100`       | #003051      | Header, boutons principaux, titres |
| Vert foncé     | `customGreen-100`   | #2a5d53      | Boutons secondaires, icônes, tags |
| Vert clair     | `customGreen2-100`  | #58c3af      | Accents, hover, icônes, tags |
| Rose           | `customPink-100`    | #e85d75      | Boutons d’action, alertes, liens importants |
| Gris clair     | `customGrey-100`    | #f5f5f5      | Fonds, séparateurs, arrière-plans |
| Blanc          | `white`             | #ffffff      | Fonds de cartes, modales, formulaires |
| Noir           | `black`             | #000000      | Texte principal, icônes |
| Jaune          | `yellow-400`        | #facc15      | Notifications, badges, étoiles |
| Rouge          | `red-500`           | #ef4444      | Erreurs, alertes |

**Conseils :**
- Utilise les variantes (`-80`, `-60`, etc.) pour les états hover, focus ou désactivés.
- Les couleurs d’action (rose, vert clair) doivent être utilisées avec parcimonie pour attirer l’attention.

---

## 2. Typographie

- **Police principale** : `Inter, sans-serif`
- **Tailles** :
  - Texte standard : `text-base` (16px)
  - Sous-titre : `text-lg` (18px)
  - Titre section : `text-xl` (20px)
  - Titre principal : `text-2xl` ou `text-3xl` (24px+)
- **Poids** :
  - Texte courant : `font-normal`
  - Titres/sous-titres : `font-semibold` ou `font-bold`
- **Interlignage** :
  - Utilise `leading-relaxed` pour les paragraphes, `leading-tight` pour les titres.

**Exemple :**
```jsx
<h1 className="text-3xl font-bold text-primary-100 mb-4">Titre principal</h1>
<p className="text-base text-gray-700 leading-relaxed">Texte courant…</p>
```

---

## 3. Boutons

- **Bouton principal** :
  - Fond : `bg-primary-100`
  - Texte : `text-white`
  - Coins : `rounded-md` ou `rounded-lg`
  - Hover : `hover:bg-customPink-100`
  - Ombre : `shadow-md`
  - Taille : `py-2 px-4`
  - Police : `font-bold`
- **Bouton secondaire** :
  - Fond : `bg-customGreen-100`
  - Hover : `hover:bg-customGreen2-100`
  - Texte : `text-white`
- **Bouton désactivé** :
  - Fond : `bg-gray-300`
  - Texte : `text-gray-500`
  - Curseur : `cursor-not-allowed`

**Exemple :**
```jsx
<button className="bg-primary-100 text-white py-2 px-4 rounded-md hover:bg-customPink-100 font-bold shadow-md">
  Valider
</button>
```

---

## 4. Cartes, blocs et modales

- Fond : `bg-white` ou `bg-gray-100`
- Ombre : `shadow-md` ou `shadow-lg`
- Coins : `rounded-lg`
- Marges internes : `p-6` ou `p-4`
- Séparateur : `border-b border-gray-200` pour les listes

**Exemple :**
```jsx
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
  {/* Contenu */}
</div>
```

---

## 5. Formulaires

- Champs : `border border-gray-300 rounded-lg p-3`
- Labels : `text-sm font-semibold text-primary-100`
- Bouton : bouton principal ou secondaire selon l’action
- Focus : `focus:ring-2 focus:ring-customGreen2-100 focus:outline-none`

**Exemple :**
```jsx
<input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100" />
```

---

## 6. Icônes

- Utilise [react-icons](https://react-icons.github.io/react-icons/) pour la cohérence.
- Taille : `text-lg` ou `text-xl`
- Couleur : selon la charte (ex : `text-customGreen2-100`, `text-primary-100`)
- Alignement : `inline-block` ou `flex items-center`

**Exemple :**
```jsx
<FaLeaf className="text-customGreen2-100 text-xl mr-2" />
```

---

## 7. Navigation & Navbar

- Fond : `bg-primary-100`
- Liens : `text-white font-semibold px-4 py-2 rounded hover:bg-customGreen2-100`
- Logo : taille adaptée, aligné à gauche
- Menu mobile : hamburger, fond blanc, liens en colonne

---

## 8. Alertes & notifications

- **Succès** : `bg-customGreen2-100 text-white`
- **Erreur** : `bg-red-500 text-white`
- **Info** : `bg-primary-100 text-white`
- **Avertissement** : `bg-yellow-400 text-black`
- Coins arrondis, icône à gauche, texte à droite

---

## 9. Accessibilité

- Contraste suffisant entre texte et fond
- Boutons et liens accessibles au clavier (`tabIndex`, `focus`)
- Utiliser `aria-label` pour les icônes et boutons sans texte

---

## 10. Exemples d’uniformisation

### Bouton principal
```jsx
<button className="bg-primary-100 text-white py-2 px-4 rounded-md hover:bg-customPink-100 font-bold shadow-md">
  Valider
</button>
```

### Carte
```jsx
<div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
  {/* Contenu */}
</div>
```

### Formulaire
```jsx
<form className="bg-white p-6 rounded-lg shadow-md">
  <label className="text-sm font-semibold text-primary-100">Email</label>
  <input className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100" />
  <button className="mt-4 bg-customGreen-100 text-white py-2 px-4 rounded-md hover:bg-customGreen2-100 font-bold">
    Envoyer
  </button>
</form>
```

---

## 11. Modales

Pour uniformiser les modales dans EcoRide, utilisez les paramètres suivants :

- **Fond** : `bg-white` ou `bg-gray-100`
- **Ombre** : `shadow-lg`
- **Coins arrondis** : `rounded-lg`
- **Largeur** : `max-w-lg` ou `w-full` selon le contexte
- **Position** : centrée avec `fixed inset-0 flex items-center justify-center`
- **Overlay** : fond semi-transparent `bg-black bg-opacity-40`
- **Padding** : `p-6` ou `p-8`
- **Titre** : `text-lg font-bold text-primary-100 mb-4`
- **Bouton de fermeture** : icône ou bouton en haut à droite, `absolute top-2 right-2 text-gray-500 hover:text-gray-700`
- **Transitions** : ajoutez `transition-all duration-300` pour l’apparition/disparition

**Exemple :**
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-lg transition-all duration-300">
    <button
      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      onClick={onClose}
      aria-label="Fermer"
    >
      ✕
    </button>
    <h3 className="mb-4 text-lg font-bold text-primary-100">Titre de la modale</h3>
    {/* Contenu de la modale */}
    <button className="mt-6 bg-customGreen-100 text-white px-4 py-2 rounded hover:bg-customGreen2-100 font-bold">
      Action
    </button>
  </div>
</div>
```

**Accessibilité :**
- Ajoutez `aria-modal="true"` et `role="dialog"` sur le conteneur principal.
- Gérez le focus à l’ouverture et à la fermeture.

---

## 12. Loadings (Indicateurs de chargement)

Pour uniformiser les indicateurs de chargement dans EcoRide, utilisez les paramètres suivants :

- **Type** : loader circulaire, barre de progression ou skeleton selon le contexte
- **Couleur principale** : `border-primary-100` ou `bg-customGreen2-100`
- **Taille** : `w-8 h-8` pour loader circulaire, `h-2 w-full` pour barre
- **Animation** : `animate-spin` pour loader circulaire, `animate-pulse` pour skeleton
- **Position** : centré avec `flex items-center justify-center`
- **Texte** : `text-gray-600 ml-2` pour message d’attente
- **Fond** : `bg-white` ou `bg-gray-100` pour les overlays de chargement global

**Exemple loader circulaire :**
```jsx
<div className="flex items-center justify-center p-8">
  <div className="inline-block w-8 h-8 border-4 border-primary-100 border-t-transparent rounded-full animate-spin"></div>
  <span className="ml-2 text-gray-600">Chargement...</span>
</div>
```

**Exemple skeleton :**
```jsx
<div className="animate-pulse bg-gray-200 h-6 w-2/3 rounded mb-2"></div>
<div className="animate-pulse bg-gray-200 h-6 w-1/2 rounded"></div>
```

**Exemple overlay de chargement :**
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
    <div className="w-8 h-8 border-4 border-customGreen2-100 border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-4 text-primary-100 font-semibold">Veuillez patienter...</span>
  </div>
</div>
```

**Accessibilité :**
- Ajoutez `aria-busy="true"` et un texte alternatif pour les lecteurs d’écran.
- Utilisez des loaders visibles et contrastés.

---

## Références

- [`tailwind.config.js`](../tailwind.config.js)
- [`src/components/`](../src/components/)
- [`src/pages/accueil.js`](../src/pages/accueil.js)
- [`src/pages/Aboutus.js`](../src/pages/Aboutus.js)

---

**Respectez cette charte pour garantir une expérience utilisateur cohérente, accessible et professionnelle sur EcoRide.**