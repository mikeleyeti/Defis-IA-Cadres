let currentLevel = '';
let currentSkill = '';
let currentChallenge = '';
let trainingPlan = [];
let challenges = {};

// Charger le plan de formation depuis localStorage
function loadTrainingPlan() {
    const saved = localStorage.getItem('trainingPlan');
    if (saved) {
        trainingPlan = JSON.parse(saved);
        updatePlanCount();
    }
}

// Sauvegarder le plan de formation
function saveTrainingPlan() {
    localStorage.setItem('trainingPlan', JSON.stringify(trainingPlan));
    updatePlanCount();
}

// Mettre à jour le compteur
function updatePlanCount() {
    const countElement = document.getElementById('plan-count');
    if (countElement) {
        countElement.textContent = trainingPlan.length;
    }
}

// Ajouter un défi au plan de formation
function addToTrainingPlan() {
    const challenge = challenges[currentChallenge];

    // Vérifier si le défi n'est pas déjà dans le plan
    const exists = trainingPlan.some(item => item.id === currentChallenge);

    if (exists) {
        showNotification('Ce défi est déjà dans votre plan de formation', 'warning');
        return;
    }

    // Ajouter le défi
    trainingPlan.push({
        id: currentChallenge,
        level: currentLevel,
        skill: currentSkill,
        title: challenge.title,
        icon: challenge.icon,
        addedAt: new Date().toISOString()
    });

    saveTrainingPlan();
    showNotification('Défi ajouté à votre plan de formation !', 'success');
}

// Visualiser le plan de formation
function viewTrainingPlan() {
    if (trainingPlan.length === 0) {
        showNotification('Votre plan de formation est vide. Ajoutez des défis pour commencer !', 'info');
        return;
    }

    const planHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90%] overflow-y-auto">
                <div class="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
                    <h2 class="text-2xl font-bold mb-2">📋 Mon Plan de Formation</h2>
                    <p class="text-purple-100">Vous avez ${trainingPlan.length} défi${trainingPlan.length > 1 ? 's' : ''} dans votre plan</p>
                </div>

                <div class="p-6 space-y-4">
                    ${trainingPlan.map((item, index) => {
        const challenge = challenges[item.id];
        const skillNames = {
            'assistante': 'L\'IA comme assistante',
            'pedagogie': 'Construction de scénarii pédagogiques',
            'pilotage': 'L\'IA comme outil de pilotage'
        };
        const levelNames = {
            'decouverte': 'Découverte',
            'intermediaire': 'Intermédiaire',
            'expert': 'Expert'
        };

        return `
                            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                                <div class="flex items-start justify-between">
                                    <div class="flex items-start space-x-4 flex-1">
                                        <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                                            <span class="text-2xl">${item.icon}</span>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="font-semibold text-gray-800 mb-2">${index + 1}. ${item.title}</h3>
                                            <div class="flex flex-wrap gap-2 mb-2">
                                                <span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    ${levelNames[item.level] || item.level}
                                                </span>
                                                <span class="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                                    ${skillNames[item.skill] || item.skill}
                                                </span>
                                            </div>
                                            <p class="text-gray-600 text-sm">${challenge.description}</p>
                                        </div>
                                    </div>
                                    <button onclick="removeFromPlan('${item.id}')" class="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm">
                                        Retirer
                                    </button>
                                </div>
                            </div>
                        `;
    }).join('')}
                </div>

                <div class="sticky bottom-0 bg-gray-50 p-6 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
                    <button onclick="clearTrainingPlan()" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        🗑️ Vider le plan
                    </button>
                    <div class="space-x-3">
                        <button onclick="printTrainingPlan()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            🖨️ Imprimer
                        </button>
                        <button onclick="closePlanModal()" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', planHtml);
}

// Retirer un défi du plan
function removeFromPlan(challengeId) {
    trainingPlan = trainingPlan.filter(item => item.id !== challengeId);
    saveTrainingPlan();
    closePlanModal();
    showNotification('Défi retiré du plan de formation', 'success');
}

// Vider le plan de formation
function clearTrainingPlan() {
    const confirmHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">⚠️</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Vider le plan de formation ?</h3>
                <p class="text-gray-600 mb-6">Cette action supprimera tous les défis de votre plan. Êtes-vous sûr ?</p>
                <div class="space-x-4">
                    <button onclick="closeConfirmClear()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Annuler
                    </button>
                    <button onclick="confirmClearPlan()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Oui, vider le plan
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmHtml);
}

function confirmClearPlan() {
    trainingPlan = [];
    saveTrainingPlan();
    closeConfirmClear();
    closePlanModal();
    showNotification('Plan de formation vidé', 'success');
}

function closeConfirmClear() {
    const modals = document.querySelectorAll('.fixed.inset-0');
    if (modals.length > 0) {
        modals[modals.length - 1].remove();
    }
}

function closePlanModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
}

// Imprimer le plan de formation
function printTrainingPlan() {
    const skillNames = {
        'assistante': 'L\'IA comme assistante',
        'pedagogie': 'Construction de scénarii pédagogiques',
        'pilotage': 'L\'IA comme outil de pilotage'
    };
    const levelNames = {
        'decouverte': 'Découverte',
        'intermediaire': 'Intermédiaire',
        'expert': 'Expert'
    };

    // Créer le contenu HTML pour l'impression
    const printContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Mon Plan de Formation - Défis CPE et I.A</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #6366f1;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #4f46e5;
                    margin-bottom: 10px;
                }
                .header p {
                    color: #666;
                    font-size: 14px;
                }
                .challenge {
                    margin-bottom: 25px;
                    padding: 15px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    page-break-inside: avoid;
                }
                .challenge-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .challenge-icon {
                    font-size: 24px;
                    margin-right: 10px;
                }
                .challenge-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f2937;
                }
                .challenge-meta {
                    margin: 10px 0;
                }
                .badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin-right: 8px;
                    margin-bottom: 5px;
                }
                .badge-level {
                    background-color: #ddd6fe;
                    color: #6b21a8;
                }
                .badge-skill {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                .challenge-description {
                    color: #4b5563;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e5e7eb;
                    text-align: center;
                    font-size: 12px;
                    color: #6b7280;
                }
                @media print {
                    body {
                        padding: 10px;
                    }
                    .challenge {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📋 Mon Plan de Formation</h1>
                <p>Défis CPE et Intelligence Artificielle</p>
                <p>Généré le ${new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
            </div>

            ${trainingPlan.map((item, index) => {
        const challenge = challenges[item.id];
        return `
                    <div class="challenge">
                        <div class="challenge-header">
                            <span class="challenge-icon">${item.icon}</span>
                            <span class="challenge-title">${index + 1}. ${item.title}</span>
                        </div>
                        <div class="challenge-meta">
                            <span class="badge badge-level">${levelNames[item.level] || item.level}</span>
                            <span class="badge badge-skill">${skillNames[item.skill] || item.skill}</span>
                        </div>
                        <div class="challenge-description">
                            ${challenge.description}
                        </div>
                    </div>
                `;
    }).join('')}

            <div class="footer">
                <p><strong>Créé par la DRANE Orléans-Tours</strong></p>
                <p>CC BY-NC 4.0 - Attribution requise • Pas d'usage commercial</p>
            </div>
        </body>
        </html>
    `;

    // Ouvrir une nouvelle fenêtre et imprimer
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Attendre que le contenu soit chargé avant d'imprimer
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        info: 'bg-blue-500',
        error: 'bg-red-500'
    };

    const notificationHtml = `
        <div class="fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 notification-slide-in">
            ${message}
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHtml);

    setTimeout(() => {
        const notification = document.querySelector('.notification-slide-in');
        if (notification) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Charger les données des défis depuis le fichier JSON
async function loadChallenges() {
    try {
        const response = await fetch('challenges.json');
        challenges = await response.json();
        console.log('Défis chargés avec succès');
    } catch (error) {
        console.error('Erreur lors du chargement des défis:', error);
        showNotification('Erreur lors du chargement des défis', 'error');
    }
}

function selectLevel(level) {
    currentLevel = level;
    updateStepIndicator(2);
    showSection('skill-selection');
}

// Générer les cartes de défis dynamiquement depuis le JSON
function renderChallenges(containerId, category) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filtrer les défis par catégorie
    const categoryDefis = Object.entries(challenges).filter(([id, challenge]) =>
        challenge.category === category
    );

    // Générer le HTML pour chaque défi
    let challengesHtml = '';
    categoryDefis.forEach(([id, challenge], index) => {
        const tagsHtml = challenge.tags.map(tag =>
            `<span class="px-3 py-1 ${tag.color} text-sm rounded-full">${tag.label}</span>`
        ).join(' ');

        challengesHtml += `
            <div class="challenge-card bg-white rounded-xl p-6 shadow-lg border border-gray-200" onclick="selectChallenge('${id}')">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 ${challenge.iconBg} rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-xl">${challenge.icon}</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">Défi ${index + 1}: ${challenge.title}</h3>
                        <p class="text-gray-600 mb-3">${challenge.description}</p>
                        <div class="flex flex-wrap gap-2">${tagsHtml}</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = challengesHtml;
}

function selectSkill(skill) {
    currentSkill = skill;
    updateStepIndicator(3);

    // Masquer tous les groupes de défis
    document.querySelectorAll('[id^="challenges-"]').forEach(el => el.classList.add('hidden'));

    // Afficher le bon groupe selon la compétence (niveau découverte uniquement pour cette version)
    let challengeGroup = '';
    if (skill === 'assistante') {
        challengeGroup = 'challenges-assistante';
    } else if (skill === 'pedagogie') {
        challengeGroup = 'challenges-pedagogie';
    } else if (skill === 'pilotage') {
        challengeGroup = 'challenges-pilotage';
    }

    if (challengeGroup) {
        // Générer les cartes de défis pour cette catégorie
        renderChallenges(challengeGroup, skill);
        document.getElementById(challengeGroup).classList.remove('hidden');
    }

    showSection('challenge-selection');
}

function selectChallenge(challenge) {
    currentChallenge = challenge;
    updateStepIndicator(4);
    showChallengeDetails(challenge);
}

function showChallengeDetails(challengeId) {
    const challenge = challenges[challengeId];
    if (!challenge) return;

    const detailsHtml = `
        <div class="text-center mb-8">
            <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">${challenge.icon}</span>
            </div>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">${challenge.title}</h2>
            <p class="text-gray-600 max-w-2xl mx-auto">${challenge.description}</p>
        </div>

        <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-blue-600">🛠️</span>
                </span>
                Outils recommandés
            </h3>
            <ul class="space-y-2">
                ${challenge.tools.map(tool => `
                    <li class="flex items-center text-gray-700">
                        <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        ${tool}
                    </li>
                `).join('')}
            </ul>
        </div>

        <div class="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-green-600">📋</span>
                </span>
                Étapes de réalisation
            </h3>
            <div class="space-y-6">
                ${challenge.steps.map((step, index) => `
                    <div class="flex items-start space-x-4">
                        <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                            ${index + 1}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 mb-2">${step.title}</h4>
                            <p class="text-gray-600">${step.content}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="text-center space-x-4">
            <button onclick="goBack('challenge-selection')" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                ← Retour aux défis
            </button>
            <button onclick="toggleHelp()" class="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                💡 Besoin d'aide ?
            </button>
            <button onclick="addToTrainingPlan()" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                ➕ Ajouter à mon plan de formation
            </button>
        </div>

        <!-- Section d'aide cachée -->
        <div id="help-section" class="hidden mt-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8 border-l-4 border-orange-400">
            <h3 class="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                <span class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-orange-600">💡</span>
                </span>
                Aide détaillée pour ce défi
            </h3>
            <div id="help-content">
                <!-- Contenu d'aide dynamique -->
            </div>
        </div>
    `;

    document.getElementById('challenge-details').innerHTML = detailsHtml;
    showSection('challenge-details');
}

function startChallenge() {
    // Créer un message de confirmation personnalisé
    const confirmHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">🎯</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Prêt à relever le défi ?</h3>
                <p class="text-gray-600 mb-6">Vous allez commencer le défi "${challenges[currentChallenge].title}". Bonne chance !</p>
                <div class="space-x-4">
                    <button onclick="closeConfirm()" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Annuler
                    </button>
                    <button onclick="launchChallenge()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        C'est parti ! 🚀
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', confirmHtml);
}

function closeConfirm() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
}

function launchChallenge() {
    closeConfirm();

    // Afficher un message de succès
    const successHtml = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
                <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">🎉</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Défi lancé avec succès !</h3>
                <p class="text-gray-600 mb-6">Vous pouvez maintenant utiliser les outils recommandés pour réaliser votre défi. Suivez les étapes proposées pour un résultat optimal.</p>
                <button onclick="closeSuccess()" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Parfait ! 👍
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', successHtml);
}

function closeSuccess() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) modal.remove();
}

function toggleHelp() {
    const helpSection = document.getElementById('help-section');
    const helpContent = document.getElementById('help-content');
    const challenge = challenges[currentChallenge];

    if (helpSection.classList.contains('hidden')) {
        // Afficher l'aide
        if (challenge && challenge.help) {
            const helpHtml = `
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <div class="mb-4">
                            <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full mr-2">
                                ${challenge.help.difficulty}
                            </span>
                            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                ⏱️ ${challenge.help.duration}
                            </span>
                        </div>

                        <h4 class="font-semibold text-gray-800 mb-3">💡 Conseils pratiques</h4>
                        <ul class="space-y-2 mb-6">
                            ${challenge.help.tips.map(tip => `
                                <li class="flex items-start text-gray-700">
                                    <span class="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span>${tip}</span>
                                </li>
                            `).join('')}
                        </ul>

                        <h4 class="font-semibold text-gray-800 mb-3">⚠️ Pièges à éviter</h4>
                        <ul class="space-y-2">
                            ${challenge.help.pitfalls.map(pitfall => `
                                <li class="flex items-start text-gray-700">
                                    <span class="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span>${pitfall}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-semibold text-gray-800 mb-3">📝 Exemple concret</h4>
                        <div class="bg-white p-4 rounded-lg border border-orange-200 mb-4">
                            <p class="text-gray-700 italic">${challenge.help.example}</p>
                        </div>

                        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h5 class="font-semibold text-yellow-800 mb-2">🎯 Objectif de réussite</h5>
                            <p class="text-yellow-700 text-sm">
                                Vous avez réussi ce défi si vous obtenez un résultat professionnel
                                que vous pourriez utiliser directement dans votre travail quotidien.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <button onclick="toggleHelp()" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Masquer l'aide
                    </button>
                </div>
            `;
            helpContent.innerHTML = helpHtml;
        }
        helpSection.classList.remove('hidden');
        helpSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Masquer l'aide
        helpSection.classList.add('hidden');
    }
}

function goBack(section) {
    if (section === 'level-selection') {
        updateStepIndicator(1);
        showSection('level-selection');
    } else if (section === 'skill-selection') {
        updateStepIndicator(2);
        showSection('skill-selection');
    } else if (section === 'challenge-selection') {
        updateStepIndicator(3);
        showSection('challenge-selection');
    }
}

function goToStep(step) {
    if (step === 1) {
        updateStepIndicator(1);
        showSection('level-selection');
    } else if (step === 2 && currentLevel) {
        updateStepIndicator(2);
        showSection('skill-selection');
    } else if (step === 3 && currentLevel && currentSkill) {
        updateStepIndicator(3);
        showSection('challenge-selection');
    } else if (step === 4 && currentLevel && currentSkill && currentChallenge) {
        updateStepIndicator(4);
        showSection('challenge-details');
    }
}

function updateStepIndicator(activeStep) {
    // Réinitialiser tous les indicateurs
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`step${i}`);
        step.className = 'step-indicator w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-400 cursor-pointer';
    }

    // Activer les étapes jusqu'à l'étape active
    for (let i = 1; i <= activeStep; i++) {
        const step = document.getElementById(`step${i}`);
        if (i === activeStep) {
            step.className = 'step-indicator step-active w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white cursor-pointer';
        } else {
            step.className = 'step-indicator w-10 h-10 rounded-full bg-white border-2 border-indigo-300 flex items-center justify-center text-sm font-semibold text-indigo-600 cursor-pointer';
        }
    }
}

function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = ['level-selection', 'skill-selection', 'challenge-selection', 'challenge-details'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.classList.add('hidden');
        }
    });

    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

// Initialisation au chargement de la page
async function init() {
    await loadChallenges();
    updateStepIndicator(1);
    loadTrainingPlan();
}

// Démarrer l'application
init();
