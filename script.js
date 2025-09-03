// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzykul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzkwMTAsImV4cCI6MjA1OTk1NTAxMH0.1x7oX2Bf-3_k6Y15e7p5z-1e-p3w-7w_c9x-1_d3f1w';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions principales de l'application
// ------------------------------------

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

// Fonction pour récupérer les clients et remplir le datalist
async function fetchClients() {
    const clientList = document.getElementById('clients');
    const { data: clients, error } = await supabase
        .from('clients')
        .select('nom_client')
        .order('nom_client', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        return;
    }

    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.nom_client;
        clientList.appendChild(option);
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

async function handleAddBenneForm(event) {
    event.preventDefault();

    const numero_benne = document.getElementById('numero_benne').value;
    const statut = document.getElementById('statut').value;
    const localisation_actuelle = document.getElementById('localisation_actuelle').value;

    const { data, error } = await supabase
        .from('bennes')
        .insert({
            numero_benne: numero_benne,
            statut: statut,
            localisation_actuelle: localisation_actuelle
        });

    if (error) {
        alert("Erreur lors de l'ajout de la benne: " + error.message);
    } else {
        alert("Benne ajoutée avec succès !");
        document.getElementById('add-benne-form').reset();
        fetchAndDisplayBennes(); // Recharger la liste des bennes
    }
}

async function fetchAndDisplayBennes() {
    const bennesTableBody = document.querySelector('#bennes-table tbody');
    const { data: bennes, error } = await supabase
        .from('bennes')
        .select('*')
        .order('numero_benne', { ascending: true });
    
    if (error) {
        console.error('Erreur lors de la récupération des bennes:', error);
        return;
    }

    bennesTableBody.innerHTML = '';

    bennes.forEach(benne => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${benne.numero_benne}</td>
            <td>${benne.statut}</td>
            <td>${benne.localisation_actuelle}</td>
            <td>
                <button onclick="editBenne('${benne.id}')">Modifier</button>
                <button onclick="deleteBenne('${benne.id}')">Supprimer</button>
            </td>
        `;
        bennesTableBody.appendChild(row);
    });
}

async function fetchAndDisplayClientsBennes() {
    const clientsBennesTableBody = document.querySelector('#clients-bennes-table tbody');
    
    // Jointure pour récupérer le client et la benne
    const { data: clients, error } = await supabase
        .from('bennes')
        .select(`
            numero_benne,
            statut,
            localisation_actuelle,
            mouvements (
                type_mouvement,
                lieu
            )
        `)
        .eq('statut', 'Chez client');
    
    if (error) {
        console.error('Erreur lors de la récupération des clients et bennes:', error);
        return;
    }
    
    clientsBennesTableBody.innerHTML = '';

    clients.forEach(benne => {
        const row = document.createElement('tr');
        const mouvement = benne.mouvements[0];
        const client = mouvement ? mouvement.lieu : 'N/A';
        const benneNumero = benne.numero_benne;

        row.innerHTML = `
            <td>${client}</td>
            <td>${benneNumero}</td>
        `;
        clientsBennesTableBody.appendChild(row);
    });
}

// Les fonctions editBenne et deleteBenne seront ajoutées à l'étape suivante
async function editBenne(benneId) {
    alert(`Fonctionnalité de modification de la benne ${benneId} à implémenter.`);
}

async function deleteBenne(benneId) {
    alert(`Fonctionnalité de suppression de la benne ${benneId} à implémenter.`);
}


// Initialisation au chargement de la page
// ---------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        // Aucune action spécifique
    } 
    else if (window.location.pathname.endsWith('dashboard.html')) {
        fetchDailyAlerts();
    }
    else if (window.location.pathname.endsWith('movements.html')) {
        fetchBennes();
        fetchClients();
        const movementForm = document.getElementById('movement-form');
        movementForm.addEventListener('submit', handleMovementForm);
    }
    else if (window.location.pathname.endsWith('manage_bennes.html')) {
        fetchAndDisplayBennes();
        const addBenneForm = document.getElementById('add-benne-form');
        addBenneForm.addEventListener('submit', handleAddBenneForm);
    }
    else if (window.location.pathname.endsWith('clients_bennes.html')) {
        fetchAndDisplayClientsBennes();
    }
});