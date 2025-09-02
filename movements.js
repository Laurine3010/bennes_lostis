// Votre configuration Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour charger la liste des bennes dans le menu déroulant
async function loadBennes() {
    const { data, error } = await supabase
        .from('bennes')
        .select('id, numero_benne');

    if (error) {
        console.error('Erreur lors du chargement des bennes:', error);
        return;
    }

    const benneSelect = document.getElementById('benne_id');
    data.forEach(benne => {
        const option = document.createElement('option');
        option.value = benne.id;
        option.textContent = benne.numero_benne;
        benneSelect.appendChild(option);
    });
}

// Fonction pour gérer la soumission du formulaire de mouvement
async function handleMovementSubmit(event) {
    event.preventDefault();

    const benne_id = document.getElementById('benne_id').value;
    const type_mouvement = document.getElementById('type_mouvement').value;
    const lieu = document.getElementById('lieu').value;
    const date_prevue = document.getElementById('date_prevue').value;
    const date_realisee = document.getElementById('date_realisee').value;

    const { data, error } = await supabase
        .from('mouvements')
        .insert([{ benne_id, type_mouvement, lieu, date_prevue, date_realisee }]);

    if (error) {
        console.error('Erreur lors de l\'enregistrement du mouvement:', error);
        alert('Erreur lors de l\'enregistrement : ' + error.message);
    } else {
        alert('Mouvement enregistré avec succès !');
        document.getElementById('movement-form').reset();
    }
}

// Événement au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadBennes();
    const movementForm = document.getElementById('movement-form');
    if (movementForm) {
        movementForm.addEventListener('submit', handleMovementSubmit);
    }
});