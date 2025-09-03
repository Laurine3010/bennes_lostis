// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzkwMTAsImV4cCI6MjA1OTk1NTAxMH0.1x7oX2Bf-3_k6Y15e7p5z-1e-p3w-7w_c9x-1_d3f1w';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions utilitaires
function showStatusMessage(message, isSuccess) {
    const statusMessageDiv = document.getElementById('status-message');
    statusMessageDiv.textContent = message;
    statusMessageDiv.className = isSuccess ? 'message success-message' : 'message error-message';
    statusMessageDiv.style.display = 'block';
    setTimeout(() => {
        statusMessageDiv.style.display = 'none';
    }, 5000); // Le message disparaît après 5 secondes
}

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

async function fetchClients() {
    const clientList = document.getElementById('clients-list');
    const { data: clients, error } = await supabase
        .from('clients')
        .select('nom_client')
        .order('nom_client', { ascending: true });

    if (error) {
        console.error('Erreur lors de la récupération des clients:', error);
        return;
    }

    clientList.innerHTML = ''; // Vide la liste avant de la remplir
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.nom_client;
        clientList.appendChild(option);
    });
}

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

    const sizeCode = document.getElementById('size-code').value;
    const typeCode = document.getElementById('type-code').value;
    const benneNumber = document.getElementById('benne-number').value.padStart(3, '0');
    
    const numero_benne = `${sizeCode}${typeCode}-${benneNumber}`;
    const taille = document.getElementById('size-code').options[document.getElementById('size-code').selectedIndex].text.split(' ')[0];
    const type_benne = document.getElementById('type-code').options[document.getElementById('type-code').selectedIndex].text.split(' ')[0];
    
    const statut = document.getElementById('statut').value;
    const localisation_actuelle = document.getElementById('localisation-input').value;

    const { data, error } = await supabase
        .from('bennes')
        .insert({
            numero_benne: numero_benne,
            statut: statut,
            localisation_actuelle: localisation_actuelle,
            taille: taille,
            type_benne: type_benne
        });

    if (error) {
        showStatusMessage("Erreur lors de l'ajout de la benne: " + error.message, false);
    } else {
        showStatusMessage("Benne ajoutée avec succès !", true);
        document.getElementById('add-benne-form').reset();
        fetchAndDisplayBennes();
    }
}

async function fetchAndDisplayBennes() {
    const bennesTableBody = document.querySelector('#bennes-table tbody');
    bennesTableBody.innerHTML = '<tr><td colspan="6">Chargement des bennes...</td></tr>';

    const { data: bennes, error } = await supabase
        .from('bennes')
        .select('*')
        .order('numero_benne', { ascending: true });
    
    if (error) {
        console.error('Erreur lors de la récupération des bennes:', error);
        bennesTableBody.innerHTML = '<tr><td colspan="6">Erreur lors du chargement des bennes.</td></tr>';
        return;
    }

    bennesTableBody.innerHTML = '';
    
    for (const benne of bennes) {
        const { data: dernierMouvement, error: mouvementError } = await supabase
            .from('mouvements')
            .select('*')
            .eq('benne_id', benne.id)
            .order('date_prevue', { ascending: false })
            .limit(1)
            .single();

        let mouvementInfo = "Aucun mouvement";
        if (dernierMouvement) {
            mouvementInfo = `${dernierMouvement.type_mouvement} le ${dernierMouvement.date_prevue} chez ${dernierMouvement.lieu}`;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${benne.numero_benne}</td>
            <td>${benne.taille}</td>
            <td>${benne.type_benne}</td>
            <td>${benne.statut}</td>
            <td>${mouvementInfo}</td>
            <td>
                <button onclick="editBenne('${benne.id}')">Modifier</button>
                <button onclick="deleteBenne('${benne.id}')">Supprimer</button>
            </td>
        `;
        bennesTableBody.appendChild(row);
    }
}

function handleManageBennesPage() {
    fetchAndDisplayBennes();
    const addBenneForm = document.getElementById('add-benne-form');
    addBenneForm.addEventListener('submit', handleAddBenneForm);

    const statutSelect = document.getElementById('statut');
    const localisationInput = document.getElementById('localisation-input');

    fetchClients();

    statutSelect.addEventListener('change', (event) => {
        if (event.target.value === 'En stock') {
            localisationInput.value = 'Stock';
            localisationInput.readOnly = true;
            localisationInput.removeAttribute('list');
        } else {
            localisationInput.value = '';
            localisationInput.readOnly = false;
            localisationInput.setAttribute('list', 'clients-list');
        }
    });
}

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
        handleManageBennesPage();
    }
    else if (window.location.pathname.endsWith('clients_bennes.html')) {
        fetchAndDisplayClientsBennes();
    }
});