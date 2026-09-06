import { Source } from '../../types';

export interface WarliMotifDefinition {
  id: number;
  slug: string;
  name: string;
  marathiName: string;
  shortName: string;
  category: 'cosmology' | 'dance' | 'ecology' | 'fauna' | 'village' | 'labor';
  categoryLabel: string;
  icon: string;
  content: string;
  cultural_context: string;
  regional_perspective: string;
  defaultCoords: { x: number; y: number };
  source: Source;
}

const INTACH_SOURCE: Source = {
  id: 7,
  title: 'Cultural Mapping of the Warli Community (Palghar District, Maharashtra)',
  organization: 'Indian National Trust for Art and Cultural Heritage (INTACH)',
  author: 'INTACH Dahanu Chapter (Phiroza Tafti & Pallavi Ganju)',
  source_type: 'INTACH',
  url: 'http://intach.org',
  description: 'Field research documenting intangible cultural heritage, sacred iconography, music, and folklore of the Warli community (2015).',
  verification_status: 'VERIFIED',
  accessed_at: '2026-09-05T13:02:39.133136'
};

const GI_SOURCE: Source = {
  id: 8,
  title: 'Geographical Indications Registry Certificate No. 211: Warli Painting',
  organization: 'Geographical Indications Registry, Government of India',
  author: 'GI Registry (Class 16 / Intellectual Property India)',
  source_type: 'GI_REGISTRY',
  url: 'https://ipindia.gov.in',
  description: 'Official GI certification establishing indigenous geographical origin, traditional rice-paste materials, and collective tribal community ownership.',
  verification_status: 'VERIFIED',
  accessed_at: '2026-09-05T13:02:39.133136'
};

export const WARLI_TAXONOMY_30: WarliMotifDefinition[] = [
  // -------------------------------------------------------------
  // GROUP 1: SACRED COSMOLOGY & DEITIES (दैवी व वैश्विक घटक)
  // -------------------------------------------------------------
  {
    id: 1,
    slug: 'palaghata-devchauk',
    name: 'The Sacred Palaghata (Devchauk / Mother Earth Sanctum)',
    marathiName: 'पालघाट देवी (देवचौक)',
    shortName: 'Palaghata Sanctum',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '🌾',
    content: 'Central geometric square sanctum enclosing Palaghata, the primordial Mother Goddess of fertility and cosmic cornucopia, outlined with sacred comb-tooth borders.',
    cultural_context: 'No traditional Warli marriage is consecrated without the painting of Palaghata by Suhasinis (married women). She embodies vegetative renewal and protects the newly married couple.',
    regional_perspective: 'Documented in INTACH field surveys as the spiritual nucleus of ritual Warli murals across Jawhar, Dahanu, and Talasari.',
    defaultCoords: { x: 50.0, y: 48.0 },
    source: INTACH_SOURCE
  },
  {
    id: 2,
    slug: 'panchashiriya-dev',
    name: 'Panchashiriya Dev (Five-Headed Guardian Deity)',
    marathiName: 'पाचशिऱ्या देव',
    shortName: 'Panchashiriya Dev',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '🛡️',
    content: 'Five-headed guardian deity rendered in bold geometric triangles adjacent to the bridal square, often brandishing ceremonial tools.',
    cultural_context: 'Panchashiriya is the headless yet five-headed cosmic guardian who stands sentinel over the household and repels ill omens during life-cycle rituals.',
    regional_perspective: 'Recorded by the Indira Gandhi National Centre for the Arts (IGNCA) as unique to North Konkan Warli and Malhar Koli mural art.',
    defaultCoords: { x: 26.0, y: 52.0 },
    source: INTACH_SOURCE
  },
  {
    id: 3,
    slug: 'sun-god-hirva',
    name: 'The Radiant Sun God (Hirva / Surya Dev)',
    marathiName: 'सूर्य देव (हिरवा)',
    shortName: 'Sun God',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '☀️',
    content: 'Concentric solar disk with dynamic radiating triangular light rays illuminating the cosmic tree and celestial space.',
    cultural_context: 'The sun represents diurnal time, photosynthesis for monsoon crops, and the divine all-seeing eye witnessing community festivals and rites of passage.',
    regional_perspective: 'Documented by INTACH Dahanu Chapter as the celestial life-giver watching over the North Sahyadri mountain ranges.',
    defaultCoords: { x: 78.0, y: 16.0 },
    source: INTACH_SOURCE
  },
  {
    id: 4,
    slug: 'crescent-moon-chandra',
    name: 'The Sacred Crescent Moon (Chandra Dev)',
    marathiName: 'चंद्र देव (नक्षत्र साथीदार)',
    shortName: 'Crescent Moon',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '🌙',
    content: 'Graceful curved crescent moon silhouette surrounded by celestial star clusters in the upper corners of the mural canvas.',
    cultural_context: 'The moon regulates nocturnal rest, tidal flows in coastal estuaries, and guides agrarian sowing and river fishing cycles across tribal lunar calendars.',
    regional_perspective: 'GI Registry Certificate No. 211 acknowledges lunar motifs as fundamental celestial markers in traditional Warli cosmology.',
    defaultCoords: { x: 22.0, y: 15.0 },
    source: GI_SOURCE
  },
  {
    id: 5,
    slug: 'kansari-devi',
    name: 'Kansari Devi (Goddess of Grain & Bountiful Harvest)',
    marathiName: 'कंसारी देवी (धान्य देवता)',
    shortName: 'Kansari Devi',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '🌱',
    content: 'Stylized female deity depicted emerging from sprouted corn stalks and carrying sheaves of mature paddy over her head.',
    cultural_context: 'Venerated at harvest time during the Diwali-time harvest festival; the Warli believe corn and rice are living beings that must be addressed with tender gratitude.',
    regional_perspective: 'Oral ethnographic narratives collected by INTACH in Mokhada record elaborate Kansari invocation songs sung by Suhasini artists.',
    defaultCoords: { x: 74.0, y: 44.0 },
    source: INTACH_SOURCE
  },
  {
    id: 6,
    slug: 'waghya-tiger-god',
    name: 'Bagh Dev / Tiger God (Waghya Shrine)',
    marathiName: 'वाघ्या देव (अरण्य रक्षक)',
    shortName: 'Tiger God (Waghya)',
    category: 'cosmology',
    categoryLabel: 'Cosmology & Deities',
    icon: '🐅',
    content: 'Majestic stylized tiger figure with sharp whiskers and muscular triangular flank markings, flanked by sacred carved wooden posts.',
    cultural_context: 'As forest dwellers living alongside carnivores, the Warli do not kill tigers; they worship Waghya as the sovereign forest guardian who protects village livestock from harm.',
    regional_perspective: 'Waghya shrines (Waghoba) are documented in every tribal hamlet across Palghar, commemorated with annual milk and vermilion offerings.',
    defaultCoords: { x: 80.0, y: 82.0 },
    source: INTACH_SOURCE
  },

  // -------------------------------------------------------------
  // GROUP 2: CEREMONIAL MUSIC & DANCE (सण, उत्सव आणि नृत्य)
  // -------------------------------------------------------------
  {
    id: 7,
    slug: 'flute-player-tarpa-musician',
    name: 'The Central Tarpa Musician (Pawa / Bansuri Player)',
    marathiName: 'तारपा / पावा वादक',
    shortName: 'Flute / Tarpa Player',
    category: 'dance',
    categoryLabel: 'Music & Dance',
    icon: '🪈',
    content: 'Central musician playing the elongated dried-gourd Tarpa or bamboo pawa at the core of the spiral, blowing rhythmic notes that direct the community.',
    cultural_context: 'The musician never turns his back to the dancers. Music is believed to invoke ancestral spirits and coordinate harvest harmony without any caste or gender hierarchy.',
    regional_perspective: 'Documented by INTACH Dahanu Chapter as the beating acoustic heart of Warli festival gatherings across Sahyadri settlements.',
    defaultCoords: { x: 34.0, y: 62.0 },
    source: INTACH_SOURCE
  },
  {
    id: 8,
    slug: 'tarpa-dance-spiral',
    name: 'The Tarpa Dance Spiral (Cosmic Community Circle)',
    marathiName: 'तारपा नृत्य वर्तुळ (जीवन चक्र)',
    shortName: 'Tarpa Dance Spiral',
    category: 'dance',
    categoryLabel: 'Music & Dance',
    icon: '🌀',
    content: 'Unbroken counter-clockwise spiral of interconnected human figures with hands linked at the waist, rotating inward and outward in unison.',
    cultural_context: 'The spiral symbolizes the circular nature of time, life, death, and seasonal rebirth; no participant is leader or follower, embodying complete communal equality.',
    regional_perspective: 'GI Registry No. 211 classifies the Tarpa spiral as the globally recognized hallmark emblem of authentic Warli folk art.',
    defaultCoords: { x: 50.0, y: 65.0 },
    source: GI_SOURCE
  },
  {
    id: 9,
    slug: 'dholak-thali-drummers',
    name: 'Dholak & Thali Drummers (Rhythm Keepers)',
    marathiName: 'ढोलक व थाळी वादक',
    shortName: 'Ceremonial Drummers',
    category: 'dance',
    categoryLabel: 'Music & Dance',
    icon: '🥁',
    content: 'Musicians carrying cylindrical earthen drums (Dhol) and striking bronze plates (Thali) with curved wooden sticks.',
    cultural_context: 'Drum rhythms announce sacred gatherings, wedding processions, and scare away wild predators from village peripheries during night vigils.',
    regional_perspective: 'Documented in INTACH field sound archives of Warli wedding traditions in Jawhar taluka.',
    defaultCoords: { x: 22.0, y: 72.0 },
    source: INTACH_SOURCE
  },
  {
    id: 10,
    slug: 'dancing-maiden-partner',
    name: 'The Dancing Maiden (Celebration Partner)',
    marathiName: 'नृत्यांगना (उत्सव सखी)',
    shortName: 'Dancing Maiden',
    category: 'dance',
    categoryLabel: 'Music & Dance',
    icon: '💃',
    content: 'Graceful female figure with hair tied in a distinctive tribal side-knot (Ambada), swaying rhythmically in unison with the spiral dancers.',
    cultural_context: 'Represents female empowerment and egalitarian participation in tribal cultural expressions; women and men dance side by side with entwined hands.',
    regional_perspective: 'Noted by Padma Shri Jivya Soma Mashe as the embodiment of living joy (Utsav) and community solidarity in Warli tradition.',
    defaultCoords: { x: 56.0, y: 60.0 },
    source: INTACH_SOURCE
  },
  {
    id: 11,
    slug: 'toddytapper-handi-wine',
    name: 'Toddytapper & Wine Pot (Handi / Mahua Urn)',
    marathiName: 'हंडी व मद्य पात्र (उत्सव रस)',
    shortName: 'Mahua Pot & Wine Urn',
    category: 'dance',
    categoryLabel: 'Music & Dance',
    icon: '🏺',
    content: 'Tribal villager carrying or scooping from a large terracotta Handi containing naturally fermented Mahua flower wine or fresh palm Neera.',
    cultural_context: 'Mahua drink is considered a divine gift of forest spirits, consumed communally during weddings, harvest ceremonies, and panchayat arbitrations.',
    regional_perspective: 'Recorded by the Anthropological Survey of India as integral to Warli hospitality and social cohesion.',
    defaultCoords: { x: 86.0, y: 68.0 },
    source: INTACH_SOURCE
  },

  // -------------------------------------------------------------
  // GROUP 3: SACRED ECOLOGY & FOREST FLORA (निसर्ग, वनसंपदा आणि वृक्ष)
  // -------------------------------------------------------------
  {
    id: 12,
    slug: 'tree-of-life-devrai',
    name: 'The Sacred Tree of Life (Devrai Canopy)',
    marathiName: 'कल्पवृक्ष / देवराई वृक्ष',
    shortName: 'Tree of Life',
    category: 'ecology',
    categoryLabel: 'Sacred Ecology',
    icon: '🌳',
    content: 'Sprawling arboreal canopy of the sacred Mahua or Banyan tree, sheltering singing birds and peacocks, connecting earth to the cosmos.',
    cultural_context: 'Warli communities venerate sacred forest groves (Devrai). Living trees are never felled indiscriminately; nature is revered as equal kin.',
    regional_perspective: 'Field research by INTACH Dahanu documents sacred tree veneration across Palghar and Thane tribal settlements.',
    defaultCoords: { x: 34.0, y: 22.0 },
    source: INTACH_SOURCE
  },
  {
    id: 13,
    slug: 'toddy-palm-tree-tad',
    name: 'Toddy Palm Tree (Tad / Shindi Tree)',
    marathiName: 'ताड / शिंदी वृक्ष',
    shortName: 'Toddy Palm',
    category: 'ecology',
    categoryLabel: 'Sacred Ecology',
    icon: '🌴',
    content: 'Tall, slender palm tree with notched climbing steps carved into the trunk and earthen sap pots suspended beneath the fronds.',
    cultural_context: 'The palm yields sweet morning Neera, sturdy timber for hut rafters, and fan leaves for thatch roofing and rain capes (Irlé).',
    regional_perspective: 'GI Registry No. 211 notes the palm as ubiquitous in the coastal and foothill landscape of Palghar district.',
    defaultCoords: { x: 88.0, y: 32.0 },
    source: GI_SOURCE
  },
  {
    id: 14,
    slug: 'sacred-bamboo-grove',
    name: 'Sacred Bamboo Grove (Kalak / Bamboo Cluster)',
    marathiName: 'कळक / बांबूचे बेट',
    shortName: 'Bamboo Grove',
    category: 'ecology',
    categoryLabel: 'Sacred Ecology',
    icon: '🎋',
    content: 'Clustered vertical bamboo culms with delicate radiating feather-like leaves swaying in the monsoon wind.',
    cultural_context: 'Bamboo provides raw material for Tarpa musical tubes, arrow shafts, woven fishing baskets, and walls of tribal homes.',
    regional_perspective: 'INTACH crafts documentation highlights the deep bond between Warli basket-weavers and Sahyadri bamboo groves.',
    defaultCoords: { x: 12.0, y: 38.0 },
    source: INTACH_SOURCE
  },
  {
    id: 15,
    slug: 'wild-forest-creepers',
    name: 'Wild Forest Creepers & Vines (Vana Velli)',
    marathiName: 'रानवेली आणि पर्णसंभार',
    shortName: 'Forest Vines',
    category: 'ecology',
    categoryLabel: 'Sacred Ecology',
    icon: '🌿',
    content: 'Intertwined serpentine creepers with curling tendrils and heart-shaped leaves winding between figures and trees.',
    cultural_context: 'Warli art abhors empty space (horror vacui). Vines symbolize the unbroken web of life where no organism exists in isolation.',
    regional_perspective: 'Noted by IGNCA as the graphic connective tissue binding all figurative elements in Warli visual grammar.',
    defaultCoords: { x: 62.0, y: 30.0 },
    source: INTACH_SOURCE
  },

  // -------------------------------------------------------------
  // GROUP 4: WILD & PASTORAL FAUNA (पशू आणि पक्षी संपदा)
  // -------------------------------------------------------------
  {
    id: 16,
    slug: 'dancing-peacocks-mor',
    name: 'Dancing Peacocks (Mor / Mayur)',
    marathiName: 'नाचणारा मोर (पर्जन्य दूत)',
    shortName: 'Dancing Peacock',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🦚',
    content: 'Graceful peacock with radiating fan-crest and sweeping tail plumage perched atop tree branches or dancing near the spiral.',
    cultural_context: 'Peacocks are revered as heralds of monsoon clouds; their calls alert tribal farmers to prepare seed beds for sowing.',
    regional_perspective: 'Prominently featured in GI Registry No. 211 as a sacred harbinger of rain across North Sahyadri hills.',
    defaultCoords: { x: 42.0, y: 18.0 },
    source: GI_SOURCE
  },
  {
    id: 17,
    slug: 'horned-cattle-bullocks',
    name: 'Horned Cattle & Bullocks (Bail / Vasaru)',
    marathiName: 'शिंगांचे बैल व वासरे',
    shortName: 'Horned Bullocks',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🐂',
    content: 'Pairs of cattle rendered with curved crescent horns, triangular humps, and whip-like tails resting peacefully beneath tree shades.',
    cultural_context: 'Bullocks are revered partners in agrarian labor rather than mere beasts of burden; during Pola festivals, their horns are painted in vermilion.',
    regional_perspective: 'INTACH Dahanu records document the ritual bath and honor given to farm bullocks in tribal hamlets.',
    defaultCoords: { x: 48.0, y: 92.0 },
    source: INTACH_SOURCE
  },
  {
    id: 18,
    slug: 'forest-deer-haran',
    name: 'The Swift Forest Deer (Haran / Chital)',
    marathiName: 'रान हरीण (चपळ चितळ)',
    shortName: 'Forest Deer',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🦌',
    content: 'Slender, leaping deer with branched antlers and elongated legs bounding gracefully through the forest glades.',
    cultural_context: 'Symbolizes speed, alert innocence, and the fragile harmony between tribal gatherers and wild wildlife.',
    regional_perspective: 'Documented by the Bombay Natural History Society in historical fauna surveys of Thane district forests.',
    defaultCoords: { x: 68.0, y: 84.0 },
    source: INTACH_SOURCE
  },
  {
    id: 19,
    slug: 'wild-boar-dukkar',
    name: 'Wild Forest Boar (Dukkar / Ran Dukkar)',
    marathiName: 'रानडुक्कर (अरण्य चर)',
    shortName: 'Wild Boar',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🐗',
    content: 'Stout, bristled quadruped with sharp tusks depicted foraging among fallen roots at the bottom perimeter of the painting.',
    cultural_context: 'Represents tenacity and survival; traditional hunting of wild boar was historically permitted only under strict seasonal community taboos.',
    regional_perspective: 'Recorded in tribal folklore archives of Jawhar Palace and INTACH anthropological field notes.',
    defaultCoords: { x: 30.0, y: 88.0 },
    source: INTACH_SOURCE
  },
  {
    id: 20,
    slug: 'canopy-birds-rooster',
    name: 'Canopy Birds & Roosters (Kombda & Pakshi)',
    marathiName: 'कौतुक पक्षी आणि कोंबडा',
    shortName: 'Canopy Birds',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🐓',
    content: 'Pairs of singing songbirds perched in tree branches and proud roosters with erect crests patrolling village courtyards.',
    cultural_context: 'The rooster is the herald of dawn, awakening the village for daily labor; birds are messengers between human dwellings and the spirits.',
    regional_perspective: 'GI Registry No. 211 documents bird silhouettes as omnipresent motifs in both ceremonial and narrative Warli walls.',
    defaultCoords: { x: 18.0, y: 26.0 },
    source: GI_SOURCE
  },
  {
    id: 21,
    slug: 'scorpion-serpent',
    name: 'Sacred Scorpion & Serpent (Vinchu & Nag)',
    marathiName: 'विंचू आणि नाग देवता',
    shortName: 'Scorpion & Serpent',
    category: 'fauna',
    categoryLabel: 'Fauna & Wildlife',
    icon: '🦂',
    content: 'Stylized segmented scorpion with curled stinger and undulating serpent depicted near the roots of the sacred tree.',
    cultural_context: 'Revered as protectors of soil moisture and guardians of underground seed reservoirs; worshipped on Nag Panchami.',
    regional_perspective: 'Documented by INTACH as symbolic threshold creatures reminding humans to walk reverently in the jungle.',
    defaultCoords: { x: 14.0, y: 64.0 },
    source: INTACH_SOURCE
  },

  // -------------------------------------------------------------
  // GROUP 5: VILLAGE ARCHITECTURE & DOMESTIC LIFE (ग्रामजीवन आणि गृहसंस्कृती)
  // -------------------------------------------------------------
  {
    id: 22,
    slug: 'thatched-karvi-dwellings',
    name: 'Thatched Karvi Dwellings (Tribal Hut Architecture)',
    marathiName: 'कारवीचे घर (कुडाची झोपडी)',
    shortName: 'Thatched Karvi Hut',
    category: 'village',
    categoryLabel: 'Village & Domestic',
    icon: '🛖',
    content: 'Triangular gabled hut constructed from Karvi reed stalks plastered with red mud and cow dung, topped with dried thatch grass.',
    cultural_context: 'The dwelling is not merely shelter but a sacred canvas; interior walls (Lagna Bhiti) are painted to consecrate marriages and protect the family.',
    regional_perspective: 'Detailed in INTACH vernacluar architecture studies of Dahanu and Jawahar talukas.',
    defaultCoords: { x: 82.0, y: 55.0 },
    source: INTACH_SOURCE
  },
  {
    id: 23,
    slug: 'women-winnowing-paddy',
    name: 'Women Winnowing Paddy (Soop / Supadi)',
    marathiName: 'सुपाने धान्य पाखडणारी स्त्री',
    shortName: 'Winnowing Maiden',
    category: 'village',
    categoryLabel: 'Village & Domestic',
    icon: '🌾',
    content: 'Tribal woman raising a triangular woven bamboo winnowing tray (Soop) high above her head to let wind separate grain from chaff.',
    cultural_context: 'Winnowing relies on the cooperation of the Wind God (Vayu); represents discernment and the purification of sustenance.',
    regional_perspective: 'Documented in GI Registry Certificate No. 211 as a classical vignette of post-harvest village life.',
    defaultCoords: { x: 66.0, y: 72.0 },
    source: GI_SOURCE
  },
  {
    id: 24,
    slug: 'women-pounding-grain',
    name: 'Women Pounding Grain (Ukhli-Musar / Mortar & Pestle)',
    marathiName: 'उखळ-मुसळ धान्य कांडण',
    shortName: 'Grain Pounding (Ukhli)',
    category: 'village',
    categoryLabel: 'Village & Domestic',
    icon: '🥣',
    content: 'Two women standing face-to-face, alternating heavy wooden pestles (Musar) into a hollowed stone mortar (Ukhli) to grind rice.',
    cultural_context: 'The rhythmic thud of the pestle is accompanied by traditional folk chants; an archetype of collaborative sisterhood in tribal households.',
    regional_perspective: 'Recorded in oral folklore collections by INTACH Dahanu Chapter.',
    defaultCoords: { x: 74.0, y: 76.0 },
    source: INTACH_SOURCE
  },
  {
    id: 25,
    slug: 'water-carrier-maiden',
    name: 'Water Carrier Maiden (Panyawali / Ghada Carrier)',
    marathiName: 'पाण्याची घागर घेणारी स्त्री',
    shortName: 'Water Carrier Maiden',
    category: 'village',
    categoryLabel: 'Village & Domestic',
    icon: '🏺',
    content: 'Slender maiden gracefully balancing two or three stacked terracotta water pots (Ghada) upon her head while walking back from the river.',
    cultural_context: 'Water carrying connects the village to sacred rivers; requires immaculate balance and posture, symbolizing quiet poise.',
    regional_perspective: 'Frequent motif in Padma Shri Jivya Soma Mashe’s retrospective exhibitions at the National Crafts Museum, New Delhi.',
    defaultCoords: { x: 38.0, y: 78.0 },
    source: INTACH_SOURCE
  },
  {
    id: 26,
    slug: 'village-granary-basket',
    name: 'Village Granary Basket (Kanga / Mud Grain Silo)',
    marathiName: 'कणगी (धान्य कोठार)',
    shortName: 'Kanga Granary',
    category: 'village',
    categoryLabel: 'Village & Domestic',
    icon: '🧺',
    content: 'Cylindrical woven bamboo silo plastered with cow dung and clay, sealed with leaves to protect seed grain for future planting.',
    cultural_context: 'The granary is worshipped as the living womb of Kansari Devi; wasting stored grain is considered an offense against the ancestors.',
    regional_perspective: 'Documented by tribal agricultural researchers in Palghar district.',
    defaultCoords: { x: 88.0, y: 88.0 },
    source: INTACH_SOURCE
  },

  // -------------------------------------------------------------
  // GROUP 6: AGRARIAN LABOR, HUNTING & BORDER (श्रम, शिकार आणि अलंकृती)
  // -------------------------------------------------------------
  {
    id: 27,
    slug: 'ploughing-farmer-bullocks',
    name: 'Ploughing Farmer with Bullocks (Nangar / Agrarian Plough)',
    marathiName: 'नांगर चालवणारा शेतकरी',
    shortName: 'Ploughing Farmer',
    category: 'labor',
    categoryLabel: 'Labor & Borders',
    icon: '🚜',
    content: 'Farmer gripping a wooden plough (Nangar) with one hand and guiding a pair of yoked oxen across monsoon mud fields.',
    cultural_context: 'Ploughing marks the sacred union between Mother Earth and the seeds of life; celebrated with offerings before the rains.',
    regional_perspective: 'Documented in INTACH Palghar tribal seasonal calendar archives.',
    defaultCoords: { x: 58.0, y: 86.0 },
    source: INTACH_SOURCE
  },
  {
    id: 28,
    slug: 'hunters-bow-arrow',
    name: 'Hunters with Bow & Arrow (Dhanushya-Baan / Shikar)',
    marathiName: 'धनुष्यबाणधारी शिकारी',
    shortName: 'Archers & Hunters',
    category: 'labor',
    categoryLabel: 'Labor & Borders',
    icon: '🏹',
    content: 'Dynamic tribal archers drawing curved bamboo bows with notched feathered arrows, tracking animal trails through the forest.',
    cultural_context: 'Reflects ancestral hunting and foraging traditions practiced prior to settled farming; symbolizes courage and focus.',
    regional_perspective: 'Featured in GI Registry No. 211 as one of the oldest narrative scenes depicted in cave art precursors to Warli.',
    defaultCoords: { x: 22.0, y: 84.0 },
    source: GI_SOURCE
  },
  {
    id: 29,
    slug: 'river-fishermen-scoop-net',
    name: 'River Fishermen with Triangular Scoop Nets (Bhor / Gal)',
    marathiName: 'त्रिकोणी जाळ्याने मासेमारी',
    shortName: 'River Fishermen',
    category: 'labor',
    categoryLabel: 'Labor & Borders',
    icon: '🐟',
    content: 'Villagers wading through river currents holding large triangular bamboo scoop nets (Bhor) to catch freshwater fish and crabs.',
    cultural_context: 'Monsoon streams in the Sahyadri provide seasonal fish protein; fishing is a communal activity shared by youth and elders alike.',
    regional_perspective: 'Documented by INTACH along the Surya and Vaitarna river basins in Palghar district.',
    defaultCoords: { x: 44.0, y: 84.0 },
    source: INTACH_SOURCE
  },
  {
    id: 30,
    slug: 'sacred-chevron-border',
    name: 'Sacred Chevron Consecration Border (Patti / Toran)',
    marathiName: 'पट्ट्या / तोरण (संरक्षक सीमा)',
    shortName: 'Chevron Border (Patti)',
    category: 'labor',
    categoryLabel: 'Labor & Borders',
    icon: '🔺',
    content: 'Continuous repeating triangular sawtooth chevron borders completely framing the sacred canvas and demarcating ceremonial space.',
    cultural_context: 'Known as Patti or Toran, this geometric border seals and consecrates the painting, protecting the inner ceremonial narrative from malevolent external influences.',
    regional_perspective: 'Traditional Suhasini artists always outline the protective triangular border first before beginning interior figurative work.',
    defaultCoords: { x: 50.0, y: 5.5 },
    source: INTACH_SOURCE
  }
];

export const getTaxonomyMotifBySlug = (slug: string): WarliMotifDefinition | undefined => {
  return WARLI_TAXONOMY_30.find((m) => m.slug === slug);
};

export const getTaxonomyMotifById = (id: number): WarliMotifDefinition | undefined => {
  return WARLI_TAXONOMY_30.find((m) => m.id === id);
};
