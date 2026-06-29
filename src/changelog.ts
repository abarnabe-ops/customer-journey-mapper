// ─── Product Changelog ────────────────────────────────────────────────────────
// Updated on every push. Each entry maps to a git commit or group of commits.
// type: feat | fix | perf | style | refactor | remove
// ─────────────────────────────────────────────────────────────────────────────

export type ChangeType = 'feat' | 'fix' | 'perf' | 'style' | 'refactor' | 'remove'

export interface Change {
  type: ChangeType
  scope: string
  fr: string
  en: string
}

export interface ChangelogEntry {
  version: string
  date: string        // ISO 8601
  commitish?: string  // git tag or short SHA
  changes: Change[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.4.0',
    date: '2026-06-28',
    changes: [
      { type:'feat',  scope:'history', fr:'Nouveau widget d\'historique style Bee en bas à gauche : flèches Annuler / Rétablir + icône horloge qui déplie une frise des 15 dernières modifications', en:'New Bee-style history widget bottom-left: Undo / Redo arrows + a clock icon that expands a timeline of the 15 most recent changes' },
      { type:'feat',  scope:'history', fr:'Chaque entrée de la frise est cliquable pour sauter directement à cet état (la plus récente en haut, avec icône, libellé d\'action et heure)', en:'Every timeline entry is clickable to jump straight to that state (newest on top, with an icon, action label and time)' },
      { type:'feat',  scope:'history', fr:'Comportement type Bee : faire une nouvelle modification après un saut en arrière abandonne la branche « refaire »', en:'Bee-style behavior: making a new edit after jumping back discards the redo branch' },
      { type:'feat',  scope:'history', fr:'Chaque action enregistrée est désormais étiquetée (Ajout, Suppression, Déplacement, Connexion, Alignement, Distribution, Calques, Disposition auto, Style de page, Couleur/Style de lien, Redimensionnement, Texte modifié, Duplication, Collage, Mapping généré, Version restaurée)', en:'Each recorded action is now labelled (Add, Delete, Move, Connect, Align, Distribute, Layer, Auto-layout, Page style, Link color/style, Resize, Text edited, Duplicate, Paste, Map generated, Version restored)' },
      { type:'feat',  scope:'i18n',    fr:'Nouvelles clés de traduction FR/EN pour le widget d\'historique et tous les libellés d\'action', en:'New FR/EN translation keys for the history widget and all action labels' },
      { type:'refactor', scope:'history', fr:'Les instantanés d\'historique stockent maintenant {nodes, conns, label, icon, ts} ; `saveH` accepte un libellé/icône et l\'historique est plafonné à 15 entrées (au lieu de 50)', en:'History snapshots now store {nodes, conns, label, icon, ts}; `saveH` takes a label/icon and history is capped at 15 entries (was 50)' },
    ],
  },
  {
    version: '1.3.2',
    date: '2026-06-28',
    changes: [
      { type:'fix',   scope:'i18n',    fr:'Correction de la compilation : tout le bloc « Misc UI » (14 clés : pdfExporting, flashError, noConnections, etc.) manquait dans l\'objet français `fr`, ce qui faisait échouer `tsc` et bloquait le déploiement de production', en:'Fixed the build: the entire "Misc UI" block (14 keys: pdfExporting, flashError, noConnections, etc.) was missing from the French `fr` object, which made `tsc` fail and blocked production deploys' },
      { type:'fix',   scope:'i18n',    fr:'Type de `en` élargi (`{ [K in keyof typeof fr]: string | string[] }`) au lieu de `typeof fr` — les valeurs anglaises ne sont plus contraintes au type littéral du texte français, tout en gardant la vérification que toutes les clés existent', en:'Widened `en` type (`{ [K in keyof typeof fr]: string | string[] }`) instead of `typeof fr` — English values are no longer constrained to the French string\'s literal type, while still checking every key exists' },
      { type:'fix',   scope:'i18n',    fr:'Type `Translations` élargi pour accepter l\'une ou l\'autre langue à l\'exécution', en:'Widened `Translations` type so it accepts either locale at runtime' },
      { type:'fix',   scope:'build',   fr:'`JSX.Element` remplacé par `React.ReactElement` dans PAGE_STYLES (espace de noms JSX introuvable avec React 19)', en:'Replaced `JSX.Element` with `React.ReactElement` in PAGE_STYLES (JSX namespace not found under React 19)' },
      { type:'fix',   scope:'build',   fr:'`index.html` racine reconverti en point d\'entrée source Vite (pointait vers un artefact de build figé) et suppression du dossier `assets/` obsolète versionné par erreur', en:'Restored root `index.html` as a Vite source entry (it pointed at a stale build artifact) and removed the obsolete `assets/` folder committed by mistake' },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-06-28',
    changes: [
      { type:'fix',   scope:'canvas',  fr:'Correction d\'un crash (page blanche) lors de l\'ajout ou du rendu d\'une page sur le canvas — le composant BrowserNode utilisait la variable de traduction `t` hors de sa portée', en:'Fixed crash (blank page) when adding or rendering a page node on the canvas — BrowserNode used the translation variable `t` out of scope' },
      { type:'fix',   scope:'canvas',  fr:'`t` est maintenant passé en prop à NShape → BrowserNode au lieu d\'être référencé globalement', en:'`t` is now passed as a prop to NShape → BrowserNode instead of being referenced globally' },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-06-28',
    changes: [
      { type:'feat',  scope:'sidebar', fr:'Les 12 styles de pages s\'affichent maintenant dans le menu de gauche (grille de miniatures), comme dans MapIt', en:'All 12 page styles now show in the left sidebar (thumbnail grid), like in MapIt' },
      { type:'feat',  scope:'pages',   fr:'Chaque style de page est glissable et cliquable depuis la barre latérale (tap = ajout au centre, glisser = dépose sur le canvas)', en:'Each page style is draggable and clickable from the sidebar (tap = add to center, drag = drop on canvas)' },
      { type:'fix',   scope:'pages',   fr:'Glisser-déposer desktop (onCvDrop) et tactile (dropOnCv) gèrent maintenant les types page_* avec le bon style et libellé', en:'Desktop (onCvDrop) and touch (dropOnCv) drag-drop now handle page_* types with correct style and label' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-06-28',
    changes: [
      { type:'fix',   scope:'hooks',   fr:"Correction d'un crash au tap « Ajouter une page » (violation des règles de hooks React : useRef appelé après un return conditionnel)", en:'Fixed crash on "Add a page" tap — React hooks violation: useRef called after conditional early return' },
      { type:'feat',  scope:'export',  fr:'Export PDF réel via html2canvas + jsPDF — capture le canvas, recadre automatiquement, télécharge un fichier PDF nommé par campagne', en:'Real PDF export via html2canvas + jsPDF — captures canvas, auto-fits all nodes, downloads a campaign-named PDF file' },
      { type:'feat',  scope:'export',  fr:'html2canvas et jsPDF chargés en lazy loading — pas d\'impact sur le démarrage', en:'html2canvas and jsPDF lazy-loaded — no impact on initial load' },
      { type:'style', scope:'ui',      fr:'Notification flash repensée pour le thème clair (fond coloré, texte sombre)', en:'Flash notification redesigned for light theme (coloured background, dark text)' },
      { type:'feat',  scope:'i18n',    fr:'Nouvelles clés de traduction : pdfExporting, pdfSuccess, pdfError', en:'New translation keys: pdfExporting, pdfSuccess, pdfError' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-06-28',
    changes: [
      { type:'feat',  scope:'icons',   fr:'Nouvelles icônes SVG pour les nœuds d\'action : carte bancaire (Achat), presse-papiers + coche (Formulaire), calendrier + coche (Meeting), trophée/étoile (Accord), liste + badge (Ajout liste), sablier (Délai)', en:'New SVG icons for action nodes: credit card (Purchase), clipboard+check (Form), calendar+check (Meeting), trophy/star (Deal), list+badge (Add list), hourglass (Delay)' },
      { type:'fix',   scope:'icons',   fr:'Les icônes dans les formes losange s\'affichent maintenant à l\'endroit grâce à une contre-rotation CSS', en:'Diamond-shape icons now render upright via CSS counter-rotation' },
      { type:'fix',   scope:'icons',   fr:'Nœud « Ajouter à une liste » : couleur de fond blanche corrigée (était #1E293B, converti en blanc par la migration de thème)', en:'Fix "Add to list" node background was white after theme migration (#1E293B → #FFFFFF), restored to #475569' },
      { type:'feat',  scope:'ui',      fr:'Icône PDF : vrai document avec badge rouge dans la barre d\'outils', en:'PDF icon: proper document shape with red badge in toolbar' },
      { type:'style', scope:'drag',    fr:'Fantôme de glisser-déposer adapté au thème clair (fond blanc, bordure bleue → verte sur le canvas)', en:'Drag ghost updated for light theme (white background, blue border → green over canvas)' },
      { type:'fix',   scope:'i18n',    fr:'Textes des labels MapIt invisibles (#334155 utilisé comme couleur de texte après la migration)', en:'MapIt labels were invisible — #334155 (border color) was mistakenly applied as text color after theme migration' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-06-28',
    changes: [
      { type:'style', scope:'theme',   fr:'Migration complète thème sombre → thème clair Edge : fond blanc #FFFFFF, gris #F3F4F6, bleu électrique #2563EB', en:'Complete dark → light Edge theme: white #FFFFFF background, gray #F3F4F6, electric blue #2563EB' },
      { type:'style', scope:'topbar',  fr:'Barre d\'outils redessinée en 3 zones : [Logo + Campagne | Outils | Avatar] avec bordures séparatrices', en:'Topbar redesigned with 3 zones: [Logo + Campaign | Tools | Avatar] with separator borders' },
      { type:'style', scope:'canvas',  fr:'Canvas blanc avec grille grise légère, nœuds en couleur sur fond blanc', en:'White canvas with light gray grid, colored nodes on white background' },
      { type:'style', scope:'sidebar', fr:'Barre latérale en gris clair #F9FAFB, textes sombres', en:'Sidebar in light gray #F9FAFB, dark text' },
      { type:'perf',  scope:'bundle',  fr:'Remplacement de Radix UI DropdownMenu par des boutons natifs (−80 KB de bundle)', en:'Replaced Radix UI DropdownMenu with native buttons (−80 KB bundle reduction)' },
      { type:'feat',  scope:'mockups', fr:'4 maquettes de thème présentées (Horizon/Meridian/Edge/Bloom)', en:'4 theme mockups presented (Horizon/Meridian/Edge/Bloom)' },
    ],
  },
  {
    version: '0.6.0',
    date: '2026-06-27',
    changes: [
      { type:'feat',  scope:'mobile',  fr:'Glisser-déposer tactile depuis la barre latérale vers le canvas (fantôme visuel + détection de zone)', en:'Touch drag-and-drop from sidebar to canvas (visual ghost + drop zone detection)' },
      { type:'feat',  scope:'mobile',  fr:'Tap sur un élément de la barre latérale → ajout au centre du canvas', en:'Tap a sidebar item → adds node to canvas center' },
      { type:'feat',  scope:'mobile',  fr:'Glisser depuis la modal MapIt → ferme la modal, continue le glisser sur le canvas', en:'Drag from MapIt modal → closes modal, continues drag over canvas' },
      { type:'feat',  scope:'mobile',  fr:'Tap dans MapIt → ajout au centre (pas de doublon, onClick existant conservé)', en:'Tap in MapIt → adds to center (no double-add, existing onClick preserved)' },
      { type:'fix',   scope:'mobile',  fr:'Menu déroulant de campagne ne fonctionnait pas sur Chrome Android (overflow:hidden tronquait le dropdown)', en:'Campaign dropdown not working on Android Chrome (overflow:hidden was clipping it)' },
      { type:'fix',   scope:'history', fr:'L\'historique d\'annulation pour les nœuds déplacés au toucher était vide (pConns:[])', en:'Undo history for touch-dragged nodes was empty (pConns: [])' },
    ],
  },
  {
    version: '0.5.0',
    date: '2026-06-27',
    changes: [
      { type:'feat',  scope:'sidebar', fr:'Barre latérale pliable : bande icônes 44px repliée (bureau) / overlay fixe (mobile)', en:'Collapsible sidebar: 44px icon strip when collapsed (desktop) / fixed overlay (mobile)' },
      { type:'feat',  scope:'sidebar', fr:'Bouton hamburger ☰ dans la barre d\'outils sur mobile', en:'Hamburger ☰ button in topbar on mobile' },
      { type:'feat',  scope:'sidebar', fr:'Fermeture automatique de la barre latérale après ajout d\'un nœud sur mobile', en:'Sidebar auto-closes after adding a node on mobile' },
      { type:'feat',  scope:'canvas',  fr:'Widget zoom flottant en bas à droite (comme Miro/Figma), position:fixed, safe-area-inset', en:'Floating zoom widget bottom-right (like Miro/Figma), position:fixed, safe-area-inset' },
      { type:'feat',  scope:'canvas',  fr:'Bouton « Adapter à l\'écran » ⊡ — calcule les bornes de tous les nœuds et zoome pour les afficher', en:'Fit-to-screen button ⊡ — calculates node bounds and zooms to show all content' },
      { type:'feat',  scope:'canvas',  fr:'Annuler/Refaire style BEE : widget flottant bas-gauche, apparaît seulement quand il y a un historique', en:'BEE-style undo/redo: floating bottom-left widget, only visible when history exists' },
      { type:'perf',  scope:'canvas',  fr:'Zoom molette vers le curseur (non vers le centre)', en:'Wheel zoom toward cursor position (not center)' },
    ],
  },
  {
    version: '0.4.0',
    date: '2026-06-27',
    changes: [
      { type:'feat',  scope:'mobile',  fr:'Pan tactile 1 doigt sur le canvas', en:'1-finger touch pan on canvas' },
      { type:'feat',  scope:'mobile',  fr:'Pinch-to-zoom 2 doigts (zoome vers le centre du pincement)', en:'2-finger pinch-to-zoom (zooms toward pinch center)' },
      { type:'feat',  scope:'mobile',  fr:'Tap sur un nœud → sélection ; glisser un nœud → déplacement', en:'Tap a node → select; drag a node → move' },
      { type:'fix',   scope:'mobile',  fr:'Déconnexion impossible sur Chrome Android (Radix UI onSelect ne se déclenchait pas au toucher)', en:'Logout not working on Android Chrome (Radix UI onSelect did not fire on touch)' },
      { type:'fix',   scope:'mobile',  fr:'Zoom molette désactivé sur mobile, remplacé par les gestes natifs', en:'Mouse wheel zoom disabled on mobile, replaced by native touch gestures' },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-06-27',
    changes: [
      { type:'feat',  scope:'i18n',    fr:'Traduction complète FR/EN — Brief, nœuds, sections barre latérale, labels de pages, miniatures SVG (INSCRIPTION→SIGN UP, ACHETER→BUY NOW…), jours du calendrier', en:'Full FR/EN translation — Brief, nodes, sidebar sections, page labels, SVG thumbnails (INSCRIPTION→SIGN UP, ACHETER→BUY NOW…), calendar days' },
      { type:'feat',  scope:'i18n',    fr:'Contexte de langage React (LanguageProvider) — pas de prop drilling', en:'React Language context (LanguageProvider) — no prop drilling' },
      { type:'feat',  scope:'i18n',    fr:'Les miniatures PAGE_STYLES sont des fonctions (t: Translations) => JSX — le texte SVG se traduit dynamiquement', en:'PAGE_STYLES thumbnails are now functions (t: Translations) => JSX — SVG text translates dynamically' },
      { type:'feat',  scope:'i18n',    fr:'Fichier src/i18n.ts centralisé — TypeScript impose la parité FR/EN via const en: typeof fr', en:'Centralised src/i18n.ts — TypeScript enforces FR/EN parity via const en: typeof fr' },
      { type:'feat',  scope:'i18n',    fr:'Persistance de la langue dans localStorage (clé cjm_lang)', en:'Language persisted in localStorage (key cjm_lang)' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-06-26',
    changes: [
      { type:'feat',  scope:'auth',    fr:'Authentification Google OAuth via Supabase, écran de connexion plein écran', en:'Google OAuth via Supabase, full-screen login screen' },
      { type:'feat',  scope:'canvas',  fr:'Canvas infini avec pan, zoom, glisser-déposer de nœuds', en:'Infinite canvas with pan, zoom, node drag-and-drop' },
      { type:'feat',  scope:'canvas',  fr:'Connexions entre nœuds avec flèches, étiquettes et couleurs personnalisables', en:'Node connections with arrows, custom labels and colors' },
      { type:'feat',  scope:'sidebar', fr:'Barre latérale avec 4 sections (Sources, Pages, Actions, Texte), sous-catégories', en:'Sidebar with 4 sections (Sources, Pages, Actions, Text), subcategories' },
      { type:'feat',  scope:'mapit',   fr:'Modal MAP IT — visualisation de tous les types de nœuds avec miniatures', en:'MAP IT modal — browse all node types with thumbnails' },
      { type:'feat',  scope:'ai',      fr:'Génération de mapping par IA depuis un brief marketing (Claude API)', en:'AI mapping generation from a marketing brief (Claude API)' },
      { type:'feat',  scope:'versions',fr:'Panel Versions — sauvegarder, restaurer et supprimer des versions de canvas', en:'Versions panel — save, restore and delete canvas versions' },
      { type:'feat',  scope:'brief',   fr:'Panel Brief — formulaire structuré avec champs campagne, objectif, audience, sources', en:'Brief panel — structured form with campaign, objective, audience, sources fields' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-06-26',
    changes: [
      { type:'feat',  scope:'core',    fr:'Migration de la monolithique HTML vers Vite + React 19 + TypeScript', en:'Migration from monolithic HTML to Vite + React 19 + TypeScript' },
      { type:'feat',  scope:'core',    fr:'Architecture source-first avec déploiement GitHub Pages automatique', en:'Source-first architecture with automatic GitHub Pages deployment' },
      { type:'feat',  scope:'core',    fr:'Supabase stockage KV pour la persistance des données utilisateur', en:'Supabase KV storage for user data persistence' },
      { type:'refactor', scope:'core', fr:'Séparation des hooks (useAuth), composants (AvatarPill), types, lib', en:'Separation of hooks (useAuth), components (AvatarPill), types, lib' },
    ],
  },
]
