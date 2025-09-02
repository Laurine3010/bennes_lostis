// Remplacez ces valeurs par les vôtres, trouvées dans les paramètres de votre projet Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cette fonction sera utilisée pour rediriger l'utilisateur s'il est déjà connecté
// Pour le moment, nous allons simplement rediriger quoi qu'il arrive pour les tests.
async function checkAuth() {
    // Supprimez le commentaire de la ligne ci-dessous pour activer la connexion
    //const { data: { user } } = await supabase.auth.getUser();
    
    // Si l'utilisateur n'est PAS connecté, on le redirige vers la page de connexion
     //if (!user) {
      //  window.location.href = 'index.html';
     //}
}

// Cette fonction gère la soumission du formulaire de connexion
// Pour le moment, nous allons juste rediriger vers le tableau de bord
async function handleLogin(event) {
    event.preventDefault(); // Empêche la page de se recharger
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Supprimez le commentaire de cette partie pour activer la vraie connexion
    /*
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Connexion réussie !");
        window.location.href = 'dashboard.html';
    }
    */
    //jusqu'ici le commentaire

    // Ligne de test : redirection vers le tableau de bord sans connexion
    console.log(`Tentative de connexion avec l'email : ${email}`);
    window.location.href = 'dashboard.html';
}

// Lier la fonction au formulaire
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});