// ─── i18n ─────────────────────────────────────────────────────────────────────
// Single source of truth for all UI strings.
// Add new strings to `fr` first — TypeScript will error if `en` is missing any.
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = 'fr' | 'en'

const fr = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  loading:          'Chargement...',
  tagline:          "Visualisez et automatisez vos parcours clients avec l'IA",
  signInGoogle:     'Se connecter avec Google',

  // ── Avatar menu ──────────────────────────────────────────────────────────
  signOut:          'Déconnexion',
  language:         'Langue',
  switchLang:       'English',
  switchFlag:       '🇬🇧',

  // ── Topbar ───────────────────────────────────────────────────────────────
  newCampaign:      'Nouvelle campagne',
  rename:           'Renommer',
  versions:         'Versions',
  brief:            'Brief',

  // ── Map It modal ─────────────────────────────────────────────────────────
  mapItSubtitle:    "Cliquez un élément pour l'ajouter au canvas",

  // ── Confirm dialogs ───────────────────────────────────────────────────────
  confirmDelete:    'Confirmer la suppression',
  cancel:           'Annuler',
  delete:           'Supprimer',
  yes:              'Oui',
  no:               'Non',

  // ── Canvas hints ──────────────────────────────────────────────────────────
  clickTarget:      'Source sélectionnée — Cliquer la cible',
  clickStart:       'Cliquer le nœud de départ',
  connSelected:     'Connexion sélectionnée — Suppr pour effacer',
  connectionTool:   'Flèche / Connexion',

  // ── Layer buttons ─────────────────────────────────────────────────────────
  bringToFront:     'Premier',
  bringForward:     'Avancer',
  sendBackward:     'Reculer',
  sendToBack:       'Arrière',

  // ── Align / distribute ────────────────────────────────────────────────────
  centerVert:       'Centrer vert.',
  centerHoriz:      'Centrer horiz.',
  spaceHoriz:       'Espacer horiz.',
  spaceVert:        'Espacer vert.',

  // ── Inspector ─────────────────────────────────────────────────────────────
  multiSelect:      '✦ Multi-sélection',
  nodesLabel:       'nœuds',
  textBox:          '📝 Zone de texte',
  dblClickEdit:     'Double-cliquer pour éditer',
  pageLabel:        '📄 Page',
  connectionLabel:  '🔗 Connexion',

  // ── Versions panel ────────────────────────────────────────────────────────
  save:             'Sauver',
  confirmDelQ:      'Suppr?',

  // ── Brief / generate ──────────────────────────────────────────────────────
  notSpecified:     'Non spécifié',
  analyzing:        '🤖 Analyse du brief en cours...',
  errorPrefix:      '❌ Erreur : ',

  // ── Sidebar section labels ────────────────────────────────────────────────
  secSources:       '🌐 Sources',
  secPages:         '📄 Pages',
  secActions:       '⚡ Actions',
  secText:          '📝 Texte',
  subPaid:          'Payantes',
  subSocial:        'Médias sociaux',
  subSearch:        'Moteur de recherche',
  subDelay:         'Délais',
  subConv:          'Conversions',
  subOther:         'Autres actions',

  // ── Page style labels ─────────────────────────────────────────────────────
  pageAbonnement:   "Page d'abonnement",
  pageBlog:         'Page de blog',
  pageCalendrier:   'Page de calendrier',
  pageCommande:     'Page de commande',
  pageMembers:      'Page membres',
  pageRemerciement: 'Page de remerciement',
  pageSondage:      'Page de checklist',
  pageTelechargement:'Page de téléchargement',
  pageVenteVideo:   'Page de vente vidéo',
  pageVente:        'Page de vente',
  pageWebinaire:    'Page de webinaire live',
  pageUpsell:       "Page d'upsell",

  // ── SVG button CTAs (embedded in page thumbnails) ─────────────────────────
  ctaSignUp:        'INSCRIPTION',
  ctaBook:          'RENDEZ-VOUS',
  ctaDownload:      'TÉLÉCHARGER',
  ctaBuy:           'ACHETER',
  ctaThanks:        'MERCI',

  // ── Calendar day abbreviations (inside calendar thumbnail SVG) ────────────
  // Order: Sun Mon Tue Wed Thu Fri Sat
  calDays:          ['D', 'L', 'M', 'M', 'J', 'V', 'S'],

  // ── Node labels (sidebar + canvas) ───────────────────────────────────────
  // Sources — paid
  nodeFbAds:        'Publicité Facebook',
  nodeIgAds:        'Publicité Instagram',
  nodeGoogleAds:    'Publicité Google',
  nodeTiktokAds:    'Publicité TikTok',
  nodeLinkedinAds:  'Publicité LinkedIn',
  nodePinterestAds: 'Publicité Pinterest',
  nodeYoutubeAds:   'Publicité YouTube',
  nodeTvAds:        'Publicité TV',
  // Sources — social
  nodeFbOrganic:    'Facebook organique',
  nodeIgOrganic:    'Instagram organique',
  nodeLiOrganic:    'LinkedIn organique',
  nodeTiktokOrganic:'TikTok organique',
  nodeRedditOrganic:'Reddit organique',
  nodePinterestOrganic:'Pinterest organique',
  nodeReferral:     'Référencement',
  nodeDirect:       'Direct',
  // Sources — search
  nodeSeo:          'Référencement naturel',
  nodeGoogleSearch: 'Google',
  nodeYoutubeSearch:'YouTube',
  nodeBingSearch:   'Bing',
  // Actions
  nodeFormComplete: 'Formulaire complété',
  nodeMeetingBooked:'Meeting cédulé',
  nodePurchase:     'Achat',
  nodeUpsellBought: 'Upsell acheté',
  nodeEmailOpen:    'Email ouvert',
  nodeEmailClick:   'Clic email',
  nodeAddList:      'Ajouter à une liste',
  nodeDownloadPdf:  'Télécharger PDF',
} as const

// `en` must have identical shape — TypeScript will error on any missing key
const en: typeof fr = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  loading:          'Loading...',
  tagline:          'Visualize and automate your customer journeys with AI',
  signInGoogle:     'Sign in with Google',

  // ── Avatar menu ──────────────────────────────────────────────────────────
  signOut:          'Sign out',
  language:         'Language',
  switchLang:       'Français',
  switchFlag:       '🇫🇷',

  // ── Topbar ───────────────────────────────────────────────────────────────
  newCampaign:      'New campaign',
  rename:           'Rename',
  versions:         'Versions',
  brief:            'Brief',

  // ── Map It modal ─────────────────────────────────────────────────────────
  mapItSubtitle:    'Click an element to add it to the canvas',

  // ── Confirm dialogs ───────────────────────────────────────────────────────
  confirmDelete:    'Confirm deletion',
  cancel:           'Cancel',
  delete:           'Delete',
  yes:              'Yes',
  no:               'No',

  // ── Canvas hints ──────────────────────────────────────────────────────────
  clickTarget:      'Source selected — Click the target',
  clickStart:       'Click the starting node',
  connSelected:     'Connection selected — Delete to remove',
  connectionTool:   'Arrow / Connection',

  // ── Layer buttons ─────────────────────────────────────────────────────────
  bringToFront:     'Front',
  bringForward:     'Forward',
  sendBackward:     'Backward',
  sendToBack:       'Back',

  // ── Align / distribute ────────────────────────────────────────────────────
  centerVert:       'Center vert.',
  centerHoriz:      'Center horiz.',
  spaceHoriz:       'Space horiz.',
  spaceVert:        'Space vert.',

  // ── Inspector ─────────────────────────────────────────────────────────────
  multiSelect:      '✦ Multi-selection',
  nodesLabel:       'nodes',
  textBox:          '📝 Text box',
  dblClickEdit:     'Double-click to edit',
  pageLabel:        '📄 Page',
  connectionLabel:  '🔗 Connection',

  // ── Versions panel ────────────────────────────────────────────────────────
  save:             'Save',
  confirmDelQ:      'Delete?',

  // ── Brief / generate ──────────────────────────────────────────────────────
  notSpecified:     'Not specified',
  analyzing:        '🤖 Analyzing brief...',
  errorPrefix:      '❌ Error: ',

  // ── Sidebar section labels ────────────────────────────────────────────────
  secSources:       '🌐 Sources',
  secPages:         '📄 Pages',
  secActions:       '⚡ Actions',
  secText:          '📝 Text',
  subPaid:          'Paid',
  subSocial:        'Social media',
  subSearch:        'Search engine',
  subDelay:         'Delays',
  subConv:          'Conversions',
  subOther:         'Other actions',

  // ── Page style labels ─────────────────────────────────────────────────────
  pageAbonnement:   'Subscription page',
  pageBlog:         'Blog page',
  pageCalendrier:   'Calendar page',
  pageCommande:     'Order page',
  pageMembers:      'Members page',
  pageRemerciement: 'Thank you page',
  pageSondage:      'Checklist page',
  pageTelechargement:'Download page',
  pageVenteVideo:   'Video sales page',
  pageVente:        'Sales page',
  pageWebinaire:    'Live webinar page',
  pageUpsell:       'Upsell page',

  // ── SVG button CTAs (embedded in page thumbnails) ─────────────────────────
  ctaSignUp:        'SIGN UP',
  ctaBook:          'BOOK NOW',
  ctaDownload:      'DOWNLOAD',
  ctaBuy:           'BUY NOW',
  ctaThanks:        'THANK YOU',

  // ── Calendar day abbreviations (inside calendar thumbnail SVG) ────────────
  calDays:          ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  // ── Node labels ───────────────────────────────────────────────────────────
  nodeFbAds:        'Facebook Ads',
  nodeIgAds:        'Instagram Ads',
  nodeGoogleAds:    'Google Ads',
  nodeTiktokAds:    'TikTok Ads',
  nodeLinkedinAds:  'LinkedIn Ads',
  nodePinterestAds: 'Pinterest Ads',
  nodeYoutubeAds:   'YouTube Ads',
  nodeTvAds:        'TV Ads',
  nodeFbOrganic:    'Facebook organic',
  nodeIgOrganic:    'Instagram organic',
  nodeLiOrganic:    'LinkedIn organic',
  nodeTiktokOrganic:'TikTok organic',
  nodeRedditOrganic:'Reddit organic',
  nodePinterestOrganic:'Pinterest organic',
  nodeReferral:     'Referral',
  nodeDirect:       'Direct',
  nodeSeo:          'SEO',
  nodeGoogleSearch: 'Google',
  nodeYoutubeSearch:'YouTube',
  nodeBingSearch:   'Bing',
  nodeFormComplete: 'Form completed',
  nodeMeetingBooked:'Meeting booked',
  nodePurchase:     'Purchase',
  nodeUpsellBought: 'Upsell purchased',
  nodeEmailOpen:    'Email opened',
  nodeEmailClick:   'Email click',
  nodeAddList:      'Add to list',
  nodeDownloadPdf:  'Download PDF',
}

export const translations = { fr, en } as const
export type Translations = typeof fr
