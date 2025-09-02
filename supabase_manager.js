// Votre configuration Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gérer la soumission du formulaire d'ajout de benne
async function handleAddBenne(event) {
    event.preventDefault(); // Empêche la page de se recharger

    const numero_benne = document.getElementById('numero_benne').value;
    const statut = document.getElementById('statut').value;
    const localisation_actuelle = document.getElementById('localisation_actuelle').value;

    const { data, error } = await supabase
        .from('bennes')
        .insert([
            { numero_benne, statut, localisation_actuelle }
        ]);

    if (error) {
        console.error('Erreur lors de l\'ajout de la benne :', error);
        alert('Erreur lors de l\'ajout de la benne : ' + error.message);
    } else {
        alert('Benne ajoutée avec succès !');
        document.getElementById('add-benne-form').reset(); // Réinitialise le formulaire
        console.log('Benne ajoutée :', data);
    }
}

// Lier la fonction au formulaire
document.addEventListener('DOMContentLoaded', () => {
    const addBenneForm = document.getElementById('add-benne-form');
    if (addBenneForm) {
        addBenneForm.addEventListener('submit', handleAddBenne);
    }
});