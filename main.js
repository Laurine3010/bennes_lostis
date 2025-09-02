const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour récupérer et afficher les alertes du jour
async function fetchDailyAlerts() {
    const today = new Date().toISOString().split('T')[0]; // Format 'YYYY-MM-DD'
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = ''; // Efface le message de chargement

    // 1. Récupérer les mouvements prévus pour aujourd'hui
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

    // 2. Vérifier si des mouvements sont trouvés
    if (mouvements.length === 0) {
        alertsContainer.innerHTML = '<p>🎉 Aucune alerte de benne prévue pour aujourd\'hui.</p>';
        return;
    }

    // 3. Afficher les alertes
    mouvements.forEach(mouvement => {
        const alerte = document.createElement('div');
        const numeroBenne = mouvement.benne.numero_benne;
        
        // Création du texte de l'alerte
        let message = '';
        if (mouvement.type_mouvement === 'Pose') {
            message = `🔔 **Alerte :** La benne **${numeroBenne}** doit être posée aujourd'hui chez le client **${mouvement.lieu}**.`;
        } else if (mouvement.type_mouvement === 'Retrait') {
            message = `🔔 **Alerte :** La benne **${numeroBenne}** doit être retirée aujourd'hui de chez le client **${mouvement.lieu}**.`;
        }
        
        alerte.innerHTML = `<p>${message}</p>`;
        alerte.className = 'alert-item'; // Ajoutez une classe pour le style
        alertsContainer.appendChild(alerte);
    });
}

// Lancer la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', fetchDailyAlerts);