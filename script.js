// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzkwMTAsImV4cCI6MjA1OTk1NTAxMH0.1x7oX2Bf-3_k6Y15e7p5z-1e-p3w-7w_c9x-1_d3f1w';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions principales de l'application
// ------------------------------------

// Fonction pour récupérer et afficher les alertes du jour
async function fetchDailyAlerts() {
    const today = new Date().toISOString().split('T')[0];
    const alertsContainer = document.getElementById('alerts-container');

    const { data: mouvements, error } = await supabase
        .from('mouvements')
        .select(`
            type_mouvement,
            date_prevue,
            lieu,
            benne:benne_id ( numero_benne )
        `)
        .eq('date_prevue', today);

    if (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
        alertsContainer.innerHTML = '<p>Erreur lors du chargement des alertes.</p>';
        return;
    }

    alertsContainer.innerHTML = '';

    if (mouvements.length === 0) {
        alertsContainer.innerHTML = '<p>🎉 Aucune alerte de benne prévue pour aujourd\'hui.</p>';
        return;
    }

    mouvements.forEach(mouvement => {
        const alerte = document.createElement('div');
        const numeroBenne = mouvement.benne.numero_benne;
        
        let message = '';
        if (mouvement.type_mouvement === 'Pose') {
            message = `🔔 **Alerte :** La benne **${numeroBenne}** doit être posée aujourd'hui chez le client **${mouvement.lieu}**.`;
        } else if (mouvement.type_mouvement === 'Retrait') {
            message = `🔔 **Alerte :** La benne **${numeroBenne}** doit être retirée aujourd'hui de chez le client **${mouvement.lieu}**.`;
        }
        
        alerte.innerHTML = `<p>${message}</p>`;
        alerte.className = 'alert-item';
        alertsContainer.appendChild(alerte);
    });
}

// Fonction pour récupérer les bennes et remplir le select
async function fetchBennes() {
    const benneSelect = document.getElementById('benne-id');
    const { data: bennes, error } = await supabase
        .from('bennes')
        .select('id, numero_benne')
        .order('numero_benne', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des bennes:', error);
        return;
    }

    bennes.forEach(benne => {
        const option = document.createElement('option');
        option.value = benne.id;
        option.textContent = benne.numero_benne;
        benneSelect.appendChild(option);
    });
}

// Gérer la soumission du formulaire d'enregistrement de mouvement
async function handleMovementForm(event) {
    event.preventDefault();

    const typeMouvement = document.getElementById('type-mouvement').value;
    const datePrevue = document.getElementById('date-prevue').value;
    const lieu = document.getElementById('lieu').value;
    const benneId = document.getElementById('benne-id').value;

    const { data, error } = await supabase
        .from('mouvements')
        .insert({
            type_mouvement: typeMouvement,
            date_prevue: datePrevue,
            lieu: lieu,
            benne_id: benneId
        });

    if (error) {
        alert("Erreur lors de l'enregistrement du mouvement: " + error.message);
    } else {
        alert("Mouvement enregistré avec succès !");
        document.getElementById('movement-form').reset();
    }
}

// Initialisation au chargement de la page
// ---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page d'accueil
    if (window.location.pathname.endsWith('index.html')) {
        // Aucune action spécifique requise, la page d'accueil est statique
    } 
    // Vérifier si nous sommes sur la page du tableau de bord
    else if (window.location.pathname.endsWith('dashboard.html')) {
        fetchDailyAlerts();
    }
    // Vérifier si nous sommes sur la page d'enregistrement des mouvements
    else if (window.location.pathname.endsWith('movements.html')) {
        fetchBennes();
        const movementForm = document.getElementById('movement-form');
        movementForm.addEventListener('submit', handleMovementForm);
    }
});