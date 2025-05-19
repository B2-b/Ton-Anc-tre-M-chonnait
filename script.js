document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const landingSection = document.getElementById('landing-section');
    const questionnaireSection = document.getElementById('questionnaire-section');
    const consoleSection = document.getElementById('console-section');
    const revealSection = document.getElementById('reveal-section');

    const ctaTextElement = document.getElementById('cta-text');
    const nameSelectElement = document.getElementById('name-select');
    const submitNameButton = document.getElementById('submit-name');

    const questionnaireForm = document.getElementById('questionnaire-form');
    const submitQuestionnaireButton = document.getElementById('submit-questionnaire');

    const consoleOutputElement = document.getElementById('console-output');

    const revealMessageElement = document.getElementById('reveal-message');
    const discoverAncestorButton = document.getElementById('discover-ancestor');
    const ancestorImagesContainer = document.getElementById('ancestor-images-container');
    const backgroundKeywordsContainer = document.getElementById('background-keywords-container');

    // Image Viewer Modal Elements
    const imageViewerModal = document.getElementById('image-viewer-modal');
    const fullAncestorImage = document.getElementById('full-ancestor-image');
    const closeImageViewerButton = document.querySelector('.close-image-viewer');
    const prevImageButton = document.querySelector('.prev-image');
    const nextImageButton = document.querySelector('.next-image');
    const returnToLandingButton = document.getElementById('return-to-landing-button');
    const ancestorDescriptionElement = document.getElementById('ancestor-description');
    const skipQuestionnaireButton = document.getElementById('skip-questionnaire-button');
    const skipConsoleButton = document.getElementById('skip-console-button');

    let currentUserImageSet = [];
    let currentImageIndexInViewer = 0;
    let selectedUserId = null;
    let animatedWords = [];
    let mouseX = -1000, mouseY = -1000; // Initialize mouse position off-screen

    // --- Data Structures ---

    // Users (12 new + 6 existing John Does = 18 total)
    const users = [
        { id: 'benjamin', name: 'Benjamin' },
        { id: 'evan', name: 'Evan' },
        { id: 'hugo', name: 'Hugo' },
        { id: 'joris', name: 'Joris' },
        { id: 'loic', name: 'Loic' },
        { id: 'lukas', name: 'Lukas' },
        { id: 'maxime', name: 'Maxime' },
        { id: 'mehdi', name: 'Mehdi' },
        { id: 'tom', name: 'Tom' },
        { id: 'tristan', name: 'Tristan' },
        { id: 'vincent', name: 'Vincent' },
        { id: 'victor', name: 'Victor' },
        { id: 'jd10', name: 'John Doe 10' },
        { id: 'jd11', name: 'John Doe 11' },
        { id: 'jd12', name: 'John Doe 12' },
        { id: 'jd13', name: 'John Doe 13' },
        { id: 'jd14', name: 'John Doe 14' },
        { id: 'jd15', name: 'John Doe 15' }
    ];

    // Rotating Call to Action (CTA) Texts
    const ctaTexts = [
        "Prêt à déterrer tes racines de vrai Gône ?",
        "Le Mâchon coule-t-il dans tes veines ?",
        "Prêt à découvrir d'où vient ton cholestérol ?",
        "Ton ADN est-il certifié 100% Lyonnais ?",
        "Envie de savoir si ton arrière-grand-père portait un tablier de sapeur ?",
        "Ton estomac gargouille ? C'est peut-être ton héritage mâchonnique qui t'appelle !",
        "Découvre si tes ancêtres étaient plus quenelle ou sabodet !",
        "La vérité est au fond du pot (lyonnais)...",
        "Es-tu un descendant secret de la Confrérie des Francs-Mâchons ?",
        "La première plateform de Gone-alogie"
    ];
    let currentCtaIndex = 0;

    // Lyonnaise Keywords for Animated Background
    const lyonWords = [
        "Mâchon", "Pot", "Beaujolais", "Gnafron", "Traboule", "Cervelle de Canut", "Tablier de Sapeur", "Ficel", "Gognandise", "Matefaim", "Guignol", "Canut", "Bugnes", "Cayon", "Cervelas", "Sabodet", "Cochonnaille", "Communard", "Quenelle", "Gratton", "Beaujolpif", "Gône", "Fenotte", "Pélo", "Bouchon", "Bugne", "Cardon", "Praline", "Jesus" , "Rosette", "Gras double", "Pâté en croûte", "Saint-Marcellin", "Côte Rôtie", "Condrieu", "Mâchonner"
    ];

    // Common Questions
    const commonQuestions = [
        { q: "Ton petit-déjeuner idéal, c'est plutôt :", a: ["Croissant-beurre", "Un pot de Morgon et des grattons", "Un smoothie kale-spiruline"], name: "petit_dej" },
        { q: "Pour toi, le mot 'pot' évoque avant tout :", a: ["Un récipient pour les fleurs", "46cl de bonheur liquide", "Un obscur concept de jardinage urbain"], name: "mot_pot" },
        { q: "Un vrai Lyonnais se reconnaît à :", a: ["Son accent chantant", "Sa capacité à digérer un tablier de sapeur à 9h du matin", "Son amour pour les embouteillages du tunnel de Fourvière"], name: "vrai_lyonnais" },
        { q: "Ta définition du 'gras double', c'est :", a: ["Une insulte particulièrement sévère", "Un délice fondant et réconfortant", "Une erreur de frappe pour 'grand trouble'"], name: "gras_double" },
        { q: "Si Guignol te donnait un conseil, ce serait :", a: ["'Arrête tes gognandises !'", "'Méfie-toi du gendarme !'", "'Investis dans les cryptomonnaies !'"], name: "guignol_conseil" }
    ];

    // Randomly Selected Questions Pool
    const randomQuestionsPool = [
        { q: "Face à un tablier de sapeur, ta réaction est :", a: ["'C'est quoi ce torchon ?'", "'Un peu de rab, s'il vous plaît !'", "'Je peux avoir la recette pour mon Insta ?'"], name: "tablier_sapeur" },
        { q: "Si on te propose une 'gognandise', tu penses à :", a: ["Une insulte rare", "Une blague bien grasse", "Une nouvelle application de méditation"], name: "gognandise" },
        { q: "Le mot 'canut' te fait penser à :", a: ["Un petit canard", "Un travailleur de la soie au caractère bien trempé", "Une marque de croquettes pour chien"], name: "canut" },
        { q: "Quand tu entends 'Beaujolais Nouveau', tu :", a: ["Te caches sous ton lit", "Sors les verres et appelles les copains", "Te demandes si c'est une nouvelle série Netflix"], name: "beaujolais_nouveau" },
        { q: "Une 'traboule', pour toi, c'est :", a: ["Un plat épicé", "Un passage secret pour éviter les touristes", "Une figure de breakdance"], name: "traboule" },
        { q: "Ton opinion sur la cervelle de canut ?", a: ["'Plat de résistance ou fromage ? Le débat est ouvert !'", "'Je préfère la cervelle de zombie, c'est plus tendance.'", "'C'est pas un peu... littéral ?'"], name: "cervelle_canut_opinion" },
        { q: "Si tu devais choisir une devise lyonnaise, ce serait :", a: ["'Encore un p'tit pot ?'", "'Travail, Famille, Quenelle.'", "'Lyon, a city that is beautiful.' (avec l'accent)"], name: "devise_lyonnaise" },
        { q: "Le mot 'pelo' pour toi, c'est :", a: ["Un ami, un type sympa", "Une insulte pour qualifier quelqu'un de rustre", "Une marque de vélo électrique"], name: "pelo_meaning" },
        { q: "Un 'bouchon lyonnais' authentique doit absolument avoir :", a: ["Une nappe à carreaux rouges rouges et blancs", "Un patron qui vous engueule affectueusement", "Un menu en QR code et des serveurs en hoverboard"], name: "bouchon_authentique" },
        { q: "Ta réaction si on te sert une andouillette qui n'est pas 'tirée à la ficelle' ?", a: ["Scandale ! J'appelle la Confrérie !", "Je la mange quand même, faut pas gâcher.", "C'est quoi la différence ? C'est pas juste une grosse saucisse ?"], name: "andouillette_ficelle" },
        { q: "Le meilleur moment pour manger des bugnes ?", a: ["Seulement à Mardi Gras, respectons la tradition !", "Toute l'année, dès que l'envie se fait sentir !", "Jamais, c'est trop sucré/gras."], name: "bugnes_moment" }
    ];

    // Amusing Initialization Messages (Console)
    const consoleMessages = [
        "Initialisation du Système Mâchonique v6.8...",
        "Calibrage des détecteurs de gognandise...",
        "Chargement des archives de la Confrérie des Francs-Mâchons...",
        "Vérification du niveau de Beaujolais dans le réservoir...",
        "Recherche de traces de gras de saucisson sur le clavier...",
        "Consultation des oracles de Gnafron... Patience, il finit son pot.",
        "Ajustement des capteurs de 'bonne franquette'..."
    ];

    // Simulated "Code/Log" Lines (for rapid scrolling effect)
    const consoleLogLines = [
        "SCANNING_SECTOR_LYON_069...", "ACCESSING_DATABASE_MÂCHONNADES_ANCIENNES...", "CROSS_REFERENCING_POT_BEAUJOLAIS_INDEX...", "QUERYING_ANCESTRAL_APETITE_RECORDS...", "DECRYPTING_SECRET_SAUSAGE_RECIPES...", "ANALYZING_GRATTON_CONSUMPTION_PATTERNS...", "VERIFYING_COCHOINAILLE_CERTIFICATION_LEVELS...", "PARSING_TRABOULE_NETWORK_NODES...", "DECOMPILING_QUENELLE_ALGORITHM_V3.2...", "AUTHENTICATING_VIA_GRATTON_SIGNATURE...", "INDEXING_ANCESTRAL_DIGESTIVE_CAPABILITIES...", "CROSS_VALIDATING_WITH_GUIGNOL_ARCHIVES...", "CHECKING_BEAUJOLAIS_VINTAGE_COMPATIBILITY...", "RECALIBRATING_SABODET_DETECTION_MATRIX...", "LYON_HERITAGE_MODULE_LOADED_OK...", "COMPILING_MACHON_HISTORY_FILES...", "GENETIC_MARKER_FOR_TABLIER_DE_SAPEUR_FOUND...", "WARNING_POTENTIAL_ALLERGY_TO_WATER_DETECTED..."
    ];

    // Humorous Congratulatory Messages (Reveal)
    const revealCongratMessages = [
        "Félicitations ! Nous avons retrouvé la trace d'un de tes glorieux ancêtres mâchonneur !",
        "Incroyable ! Un Mâchonneur de légende sommeillait dans ton ADN !",
        "Ton arbre généalogique sent bon le saucisson chaud et le Saint-Marcellin !",
        "Eurêka ! Votre lignée est plus cochonne que vous ne le pensiez !",
        "Le verdict est tombé : vous êtes issu(e) d'une longue lignée de champions du tire-bouchon !",
        "Préparez la nappe à carreaux, on a du lourd sur vos aïeux !",
        "Votre ADN a parlé : il a un fort accent lyonnais et une faim de canut !"
    ];

    // Ancestor Descriptions (18 total)
    const allAncestorDescriptions = [
        `Ah, votre ancêtre, <strong>Gédéon "Le Gosier-en-Pente" Dubouchoir</strong> ! Une figure légendaire des traboules, connu pour sa capacité à identifier un Beaujolais à la seule odeur de son bouchon et pour avoir inventé le concept de "l'apéro-sieste" bien avant l'heure. On raconte qu'il pouvait débattre de la cuisson parfaite du saucisson de Lyon pendant des heures, tout en jonglant avec trois pots lyonnais pleins. Un vrai gone, pur jus de treille ! Son record personnel ? Avoir englouti une "salade lyonnaise" si grande qu'elle avait son propre code postal.`,
        `Augustin "La Quenelle Volante" Tripoux: Réputé pour sa technique inégalée de lancer de quenelle à travers la tablée sans en renverser une goutte de sauce Nantua. Augustin tenait un bouchon clandestin dans une cave de la Croix-Rousse où le mot d'ordre était 'Mangez gras, riez fort !'. Sa spécialité ? Le 'Gratton Surprise', dont personne n'a jamais su ce qu'il y avait vraiment dedans, mais tout le monde en redemandait. Il aurait, dit-on, gagné un concours de mangeurs de cervelas contre Gnafron lui-même, un exploit jamais réitéré.`,
        `Barthélémy "Le Beaujolais Funambule" Piston: Dit 'Le Funambule' non pas pour ses talents de circassien, mais pour sa capacité à traverser la Place Bellecour après 12 pots de Juliénas sans jamais dévier de sa trajectoire (ou presque). Inventeur du 'Mâchon Matinal Préventif' (un saucisson brioché à 7h du matin pour 'éviter les coups de barre'), Barthélémy était aussi poète à ses heures perdues, composant des odes à la cochonnaille qui faisaient pleurer les plus endurcis des canuts.`,
        `Félicien "La Fourchette Intrépide" Grattonel: Félicien ne reculait devant aucun plat, aussi redoutable soit-il. On raconte qu'il a déjà terminé un tablier de sapeur en moins de temps qu'il n'en faut pour dire 'gognandise'. Il organisait des 'Mâchons Olympiques' dans son arrière-cour, avec des épreuves comme le 'lancer de rosette' et le 'marathon du pot lyonnais'. Sa devise: 'La vie est trop courte pour manger triste et boire de l'eau'.`,
        `Barnabé "Le Roi du Saucisson Sec" Lardière: Barnabé affirmait pouvoir faire sécher un saucisson par la seule force de son regard perçant et de sa patience légendaire. Ses créations étaient si réputées que les corbeaux de Fourvière eux-mêmes tentaient des raids aériens sur sa charcuterie. Il dormait avec un Jésus (le saucisson, bien sûr) sous son oreiller, 'pour s'inspirer', disait-il.`,
        `Clotaire "Monsieur Bugne-Moi-Ça" Farinette: Spécialiste incontesté de la bugne sous toutes ses formes – plates, gonflées, au sucre glace, au chocolat (sacrilège pour certains, innovation pour lui). Clotaire avait transformé sa cuisine en un laboratoire secret de la friture. On dit que l'odeur de ses bugnes pouvait apaiser un conflit entre Guignol et Gnafron, c'est dire !`,
        `Anselme "Le Philosophe du Beaujolais" Bibard: Anselme pouvait disserter pendant des heures sur les nuances subtiles entre un Morgon et un Brouilly, souvent après en avoir dégusté plusieurs échantillons 'pour la science'. Il avait écrit un traité de 500 pages intitulé 'L'Être et le Goulot', malheureusement perdu lors d'une dégustation un peu trop animée à la vogue des marrons.`,
        `Zéphyr "Le Roi des Quenelles Soufflées" Pochon: Ses quenelles étaient si légères qu'on craignait qu'elles ne s'envolent avant d'atteindre l'assiette. Zéphyr prétendait avoir un pacte avec les anges pour leur insuffler leur texture divine. Elle a un jour servi une quenelle de brochet si monumentale qu'il a fallu la sortir par la fenêtre avec une grue.`,
        `Léandre "Le Contrebandier de Saint-Marcellin" Coulandon: Léandre organisait des expéditions nocturnes pour ramener les meilleurs Saint-Marcellin affinés 'comme y faut' des fermes isolées du Dauphiné. Il utilisait les traboules comme réseau de distribution et avait un système de mots de passe basé sur des expressions lyonnaises improbables. Son cri de ralliement : 'Un Saint-Marcellin bien coulant vaut mieux que de l'or en lingot !'`,
        `Honorin "Le Diseur de Bonne Aventure en Taches de Vin" Pinot: Honorin lisait l'avenir dans les taches de vin rouge sur les nappes à carreaux. Ses prédictions, souvent liées à la météo du Beaujolais ou à la qualité du prochain mâchon, étaient étonnamment précises. Il avait prédit la grande pénurie de grattons de 1893, mais personne ne l'avait crue.`,
        `Casimir "L'Alchimiste du Gras Double" Mijoton: Casimir cherchait la recette ultime du gras double, celle qui transformerait le plomb en or... ou du moins, un estomac vide en un havre de paix. Il expérimentait avec des épices venues d'Orient et des techniques de cuisson oubliées, parfois avec des résultats... explosifs. Sa cuisine était déclarée zone à risque par la maréchaussée.`,
        `Philou "Le Tisseur de Saucissons en Soie" Canusec: Issue d'une longue lignée de canuts, Philou avait combiné les deux passions lyonnaises : la soie et la cochonnaille. Il tissait des répliques de saucissons en soie si réalistes qu'elles trompaient même les plus fins gourmets (jusqu'à la première bouchée). Ses œuvres d'art étaient exposées lors des grandes fêtes du quartier.`,
        `Théodule "Le Poète du Pot-au-Feu" Bouillon: Théodule ne cuisinait pas, il composait des symphonies de saveurs dans sa marmite. Son pot-au-feu était légendaire, mijoté pendant trois jours et trois nuits au son de ses propres vers déclamés avec passion. Chaque légume, chaque morceau de viande avait sa strophe dédiée. Manger chez Théodule, c'était une expérience littéraire et gustative.`,
        `Irénée "Le Cartographe des Traboules à Mâchons" Déboussolé: Irénée avait entrepris de cartographier toutes les traboules de Lyon menant à un bouchon digne de ce nom. Son œuvre, constamment mise à jour, était plus précieuse qu'un plan du trésor des Templiers pour les affamés de la ville. Il se perdait souvent lui-même, mais toujours à proximité d'un bon pot de Côte.`,
        `Cunégond "L'Herboriste des Tisanes Post-Mâchon" Digestine: Après les excès légendaires des mâchons, Cunégond proposait des tisanes 'miraculeuses' à base de plantes secrètes cueillies sur les pentes de Fourvière à la pleine lune. Leurs effets étaient... variables, mais la convivialité de sa boutique était un remède en soi. Il affirmait que sa tisane 'Casse-Graisse' pouvait faire digérer un tablier de sapeur à un moineau.`,
        `Prosper "Le Dompteur de Quenelles Sauvages" Nantua: Prosper était le seul à Lyon capable de pocher une quenelle de brochet sans qu'elle n'éclate ou ne se dégonfle. Il leur parlait doucement, les massait avec du beurre fin et les menaçait d'un coup de louche si elles n'obéissaient pas. Ses quenelles étaient dressées comme des soldats au garde-à-vous.`,
        `Sid "Le Collectionneur de Bouchons de Pots" Millésime: Sid possédait la plus grande collection de bouchons de pots lyonnais de la ville, chacun daté, annoté et classé par cru et par humeur du jour de la dégustation. Il pouvait raconter l'histoire de chaque bouchon, transformant sa modeste demeure en un musée vivant de la soif lyonnaise.`,
        `Evariste "L'Inventeur du Mâchon Perpétuel" Rabelaisien: Evariste rêvait d'un mâchon qui ne finirait jamais. Il avait conçu un système ingénieux de tapis roulants apportant continuellement des plats et des pots, et des hamacs pour les convives entre deux services. Son projet a été interrompu par une émeute de voisins affamés et jaloux.`
    ];

    // Shuffle descriptions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
    const shuffledDescriptions = shuffleArray([...allAncestorDescriptions]); 

    const ancestorDescriptions = {};
    const specificAncestorImages = {
        'benjamin': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Benjamin/output%20(7).jpg"],
        'evan': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Evan/output%20(1).jpg"],
        'hugo': [
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Hugo/output%20(6).jpg",
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Hugo/output_3081.jpg"
        ],
        'joris': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Joris/output%20(2).jpg"],
        'loic': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Loic/output%20Loic.jpg"],
        'lukas': [
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Lukas/output%20(1).jpg",
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Lukas/output.jpg"
        ],
        'maxime': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Maxime/output%20(4).jpg"],
        'mehdi': [
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Mehdi/output%20Medhi%201.jpg",
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Mehdi/output%20Medhi%202.jpg"
        ],
        'tom': [
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Tom/output_2680.jpg",
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Tom/output_7004.jpg"
        ],
        'tristan': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Tristan/output_1131.jpg"],
        'vincent': ["https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Vincent/output%20Vince.jpg"],
        'victor': [
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Victor/output_8712.jpg",
            "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/Swapped/Victor/output_9432.jpg"
        ]
    };
    const ancestorImages = {};
    const placeholderImageUrl = "https://raw.githubusercontent.com/B2-b/Ton-Anc-tre-M-chonnait/refs/heads/main/VB/ChatGPT%20Image%2015%20mai%202025%2C%2013_59_18.png";

    users.forEach((user, index) => {
        ancestorDescriptions[user.id] = shuffledDescriptions[index % shuffledDescriptions.length];
        if (specificAncestorImages[user.id]) {
            ancestorImages[user.id] = specificAncestorImages[user.id];
        } else {
            ancestorImages[user.id] = [placeholderImageUrl, placeholderImageUrl, placeholderImageUrl];
        }
    });


    // --- Core Functions ---

    function showSection(sectionElement) {
        // Hide all main sections
        landingSection.classList.add('hidden');
        questionnaireSection.classList.add('hidden');
        consoleSection.classList.add('hidden');
        revealSection.classList.add('hidden');
        
        // Ensure image viewer modal is also hidden when changing main sections
        if (imageViewerModal && !imageViewerModal.classList.contains('hidden')) {
            imageViewerModal.classList.add('hidden');
        }

        if (sectionElement) {
            sectionElement.classList.remove('hidden');
            // If we are showing the reveal section, ensure its buttons and description are in the correct initial state
            if (sectionElement.id === 'reveal-section') {
                if (discoverAncestorButton) {
                    discoverAncestorButton.classList.remove('hidden');
                }
                if (returnToLandingButton) { 
                    returnToLandingButton.classList.add('hidden');
                }
                if (ancestorDescriptionElement) {
                    ancestorDescriptionElement.innerHTML = ''; // Clear content
                    ancestorDescriptionElement.classList.add('hidden'); // Ensure hidden
                }
            }
        }
    }

    function populateNameDropdown() {
        nameSelectElement.innerHTML = ''; // Clear existing options before populating
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            nameSelectElement.appendChild(option);
        });
    }

    function rotateCtaText() {
        currentCtaIndex = (currentCtaIndex + 1) % ctaTexts.length;
        ctaTextElement.style.opacity = 0; // Fade out
        setTimeout(() => {
            ctaTextElement.textContent = ctaTexts[currentCtaIndex];
            ctaTextElement.style.opacity = 1; // Fade in
        }, 500); // Match this with CSS transition duration
    }

    // --- Background Keyword Animation ---
    function createAnimatedWord(wordText) {
        const wordElement = document.createElement('div');
        wordElement.classList.add('animated-keyword');
        wordElement.textContent = wordText;

        const containerRect = backgroundKeywordsContainer.getBoundingClientRect();

        wordElement.style.position = 'absolute';
        wordElement.style.fontSize = `${Math.random() * 28 + 12}px`; // New range: 12px to 40px
        wordElement.style.left = `${Math.random() * (containerRect.width - 100)}px`; // Avoid edges initially
        wordElement.style.top = `${Math.random() * (containerRect.height - 50)}px`;  // Avoid edges initially
        // Pastel/Vintage colors: lower saturation, higher lightness
        const hue = Math.random() * 360;
        const saturation = Math.random() * 20 + 30; // 30% to 50%
        const lightness = Math.random() * 15 + 70;  // 70% to 85%
        wordElement.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        wordElement.style.transition = 'transform 0.2s ease-out'; // For mouse interaction

        backgroundKeywordsContainer.appendChild(wordElement);

        return {
            element: wordElement,
            x: parseFloat(wordElement.style.left),
            y: parseFloat(wordElement.style.top),
            vx: (Math.random() - 0.5) * 2, // Velocity x (-1 to 1)
            vy: (Math.random() - 0.5) * 2, // Velocity y (-1 to 1)
            width: wordElement.offsetWidth,
            height: wordElement.offsetHeight
        };
    }

    function updateWordsPosition() {
        const containerRect = backgroundKeywordsContainer.getBoundingClientRect();

        animatedWords.forEach(word => {
            word.x += word.vx;
            word.y += word.vy;

            // Bounce off edges
            if (word.x + word.width > containerRect.width || word.x < 0) {
                word.vx *= -1;
                word.x = Math.max(0, Math.min(word.x, containerRect.width - word.width)); // Contain
            }
            if (word.y + word.height > containerRect.height || word.y < 0) {
                word.vy *= -1;
                word.y = Math.max(0, Math.min(word.y, containerRect.height - word.height)); // Contain
            }

            // Mouse interaction
            const dx = word.x + word.width / 2 - mouseX;
            const dy = word.y + word.height / 2 - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const interactionRadius = 100; // Pixels

            if (distance < interactionRadius) {
                const force = (interactionRadius - distance) / interactionRadius;
                const angle = Math.atan2(dy, dx);
                word.element.style.transform = `translate(${Math.cos(angle) * force * 20}px, ${Math.sin(angle) * force * 20}px) scale(1.1)`;
            } else {
                word.element.style.transform = 'translate(0,0) scale(1)';
            }

            word.element.style.left = `${word.x}px`;
            word.element.style.top = `${word.y}px`;
        });

        requestAnimationFrame(updateWordsPosition);
    }
    
    function setupBackgroundKeywords() {
        lyonWords.forEach(word => {
            animatedWords.push(createAnimatedWord(word));
        });
        // Update width/height after elements are in DOM and styled
        animatedWords.forEach(word => {
            word.width = word.element.offsetWidth;
            word.height = word.element.offsetHeight;
        });
        updateWordsPosition(); // Start animation loop
    }

    document.addEventListener('mousemove', (e) => {
        const containerRect = backgroundKeywordsContainer.getBoundingClientRect();
        mouseX = e.clientX - containerRect.left;
        mouseY = e.clientY - containerRect.top;
    });


    // --- Event Listeners ---
    submitNameButton.addEventListener('click', () => {
        selectedUserId = nameSelectElement.value;
        if (selectedUserId) {
            showSection(questionnaireSection);
            buildQuestionnaire(); // Call function to build and display questionnaire
        } else {
            alert("Veuillez sélectionner un nom !");
        }
    });

    submitQuestionnaireButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        showSection(consoleSection);
        startConsoleAnimation(); // Call function to start console animation
    });

    discoverAncestorButton.addEventListener('click', () => {
        ancestorImagesContainer.innerHTML = ''; // Clear previous images
        const userImages = ancestorImages[selectedUserId];
        if (userImages && userImages.length > 0) {
            userImages.forEach((imgUrl, idx) => { // Correctly use idx from this forEach loop
                const img = document.createElement('img');
                img.src = imgUrl;
                img.alt = "Image d'archive de l'ancêtre";
                img.dataset.index = idx; // Store correct index
                img.addEventListener('click', () => openImageViewer(userImages, idx)); // Use correct index
                ancestorImagesContainer.appendChild(img);
            });
            discoverAncestorButton.classList.add('hidden'); // Hide button after images are loaded
            if (returnToLandingButton) returnToLandingButton.classList.remove('hidden'); // Show return button
            
            // Display placeholder ancestor description
            if (ancestorDescriptionElement) {
                // Use the specific description for the selected user
                ancestorDescriptionElement.innerHTML = ancestorDescriptions[selectedUserId] || "Description non disponible pour cet ancêtre.";
                ancestorDescriptionElement.classList.remove('hidden');
            }

        } else {
            ancestorImagesContainer.textContent = "Aucune image d'archive trouvée pour cet ancêtre (pour le moment !).";
            // Keep discover button visible if no images
            if (returnToLandingButton) returnToLandingButton.classList.add('hidden'); // Ensure return button is hidden
            if (ancestorDescriptionElement) ancestorDescriptionElement.classList.add('hidden'); // Hide description if no images
        }
    });

    if (returnToLandingButton) {
        returnToLandingButton.addEventListener('click', () => {
            // Clear images and description, then show landing. Buttons are reset by showSection.
            ancestorImagesContainer.innerHTML = '';
            if (ancestorDescriptionElement) {
                ancestorDescriptionElement.innerHTML = '';
                ancestorDescriptionElement.classList.add('hidden');
            }
            showSection(landingSection);
        });
    }
    
    // --- Questionnaire Logic ---
    function buildQuestionnaire() {
        questionnaireForm.innerHTML = ''; // Clear previous questions

        // Select and add 4 random questions from the random pool
        const shuffledRandom = [...randomQuestionsPool].sort(() => 0.5 - Math.random());
        const selectedRandomQuestions = shuffledRandom.slice(0, 4); // Select 4 random questions

        selectedRandomQuestions.forEach((qData, index) => {
            const questionCard = document.createElement('div');
            questionCard.classList.add('question-card');

            const questionLabel = document.createElement('label');
            questionLabel.classList.add('question-title');
            questionLabel.textContent = qData.q;
            questionCard.appendChild(questionLabel);
            
            const answersDiv = document.createElement('div');
            answersDiv.classList.add('answers-container');
            qData.a.forEach((answer, i) => {
                const answerId = `q${index}_a${i}`; // Adjust ID naming as there are no common questions now
                const answerDiv = document.createElement('div');
                answerDiv.classList.add('answer-option');
                answerDiv.innerHTML = `
                    <input type="radio" id="${answerId}" name="${qData.name}" value="${answer.replace(/\s+/g, '_').toLowerCase()}">
                    <label for="${answerId}">${answer}</label>
                `;
                answersDiv.appendChild(answerDiv);
            });
            questionCard.appendChild(answersDiv);
            questionnaireForm.appendChild(questionCard);
        });
    }

    // --- Console Animation Logic ---
    async function startConsoleAnimation() {
        consoleOutputElement.innerHTML = ''; // Clear previous output
        let messageIndex = 0;
        const messagesToDisplay = consoleMessages.slice(0, 4); // Display only the first 4 messages

        for (const msg of messagesToDisplay) {
            await typeMessage(msg, 50); // Typing effect for message
            await delay(1000); // Wait 1 second after message

            // Simulate log scrolling
            for (let i = 0; i < 5; i++) { // Scroll 5 batches of logs
                for (let j = 0; j < 10; j++) { // 10 log lines per batch
                    const randomLog = consoleLogLines[Math.floor(Math.random() * consoleLogLines.length)];
                    consoleOutputElement.innerHTML += `${randomLog}\n`;
                }
                consoleOutputElement.scrollTop = consoleOutputElement.scrollHeight; // Auto-scroll
                await delay(50); // Short delay between log batches
            }
            await delay(500); // Wait a bit after logs
            messageIndex++;
            if (messageIndex < consoleMessages.length) { // Check against original consoleMessages length for newline
                 consoleOutputElement.innerHTML += `\n`; // Add a newline before next main message
            }
        }
        
        // After all messages and logs
        consoleOutputElement.innerHTML += "\nRecherche terminée. Préparez-vous à la révélation...\n";
        consoleOutputElement.scrollTop = consoleOutputElement.scrollHeight;
        await delay(2000);

        // Transition to reveal section
        finalizeAndShowReveal();
    }

    function finalizeAndShowReveal() {
        const randomCongratsMsg = revealCongratMessages[Math.floor(Math.random() * revealCongratMessages.length)];
        if(revealMessageElement) revealMessageElement.textContent = randomCongratsMsg;
        showSection(revealSection);
    }

    async function typeMessage(message, speed) {
        for (let i = 0; i < message.length; i++) {
            consoleOutputElement.innerHTML += message.charAt(i);
            consoleOutputElement.scrollTop = consoleOutputElement.scrollHeight;
            await delay(speed);
        }
        consoleOutputElement.innerHTML += '\n';
        consoleOutputElement.scrollTop = consoleOutputElement.scrollHeight;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Image Viewer Logic ---
    function openImageViewer(imageSet, index) {
        currentUserImageSet = imageSet;
        currentImageIndexInViewer = index;
        fullAncestorImage.src = currentUserImageSet[currentImageIndexInViewer];
        imageViewerModal.classList.remove('hidden');
    }

    function closeImageViewer() {
        imageViewerModal.classList.add('hidden');
    }

    function showPrevImage() {
        currentImageIndexInViewer = (currentImageIndexInViewer - 1 + currentUserImageSet.length) % currentUserImageSet.length;
        updateFullImageWithTransition();
    }

    function showNextImage() {
        currentImageIndexInViewer = (currentImageIndexInViewer + 1) % currentUserImageSet.length;
        updateFullImageWithTransition();
    }

    function updateFullImageWithTransition() {
        fullAncestorImage.classList.add('image-fade-out');
        setTimeout(() => {
            fullAncestorImage.src = currentUserImageSet[currentImageIndexInViewer];
            fullAncestorImage.classList.remove('image-fade-out');
            // No explicit fade-in class needed if default is visible, or add one if complex animation desired
        }, 200); // This duration should match CSS transition/animation
    }

    // Event listeners for image viewer
    if (closeImageViewerButton) closeImageViewerButton.addEventListener('click', closeImageViewer);
    if (prevImageButton) prevImageButton.addEventListener('click', showPrevImage);
    if (nextImageButton) nextImageButton.addEventListener('click', showNextImage);
    
    // Close modal if user clicks outside the image (on the overlay)
    if (imageViewerModal) {
        imageViewerModal.addEventListener('click', (event) => {
            if (event.target === imageViewerModal) { // Check if the click is on the modal background
                closeImageViewer();
            }
        });
    }
     // Keyboard navigation for image viewer
     document.addEventListener('keydown', (event) => {
        if (!imageViewerModal.classList.contains('hidden')) {
            if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'Escape') {
                closeImageViewer();
            }
        }
    });


    // --- Initialization ---
    // Skip button event listeners
    if (skipQuestionnaireButton) {
        skipQuestionnaireButton.addEventListener('click', () => {
            showSection(consoleSection);
            startConsoleAnimation();
        });
    }

    if (skipConsoleButton) {
        skipConsoleButton.addEventListener('click', () => {
            // Directly go to reveal, bypassing console animation's timed sequence
            finalizeAndShowReveal();
        });
    }

    function init() {
        populateNameDropdown();
        setInterval(rotateCtaText, 4000); // Rotate CTA every 4 seconds
        setupBackgroundKeywords(); // Initialize background keyword animation
        showSection(landingSection); // Show landing section by default
        
        // Initially hide the reveal section properly (it's styled as fixed overlay)
        // We ensure it's hidden by JS too, in case CSS loads slower or has issues.
        if (revealSection) revealSection.classList.add('hidden');
    }

    init();
});
