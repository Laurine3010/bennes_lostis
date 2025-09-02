// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzkwMTAsImV4cCI6MjA1OTk1NTAxMH0.1x7oX2Bf-3_k6Y15e7p5z-1e-p3w-7w_c9x-1_d3f1w';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions principales de l'application
// ------------------------------------

async function fetchDailyAlerts() {
    const today = new Date().toISOString().split('T')[0];
    const alertsContainer = document.getElementById('alerts-container');

    // Récupération des mouvements prévus pour aujourd'hui
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

// Initialisation au chargement de la page
// ---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page du tableau de bord pour lancer le chargement des alertes
    if (window.location.pathname.endsWith('dashboard.html')) {
        fetchDailyAlerts();
    }
});