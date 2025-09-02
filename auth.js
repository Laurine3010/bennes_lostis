// Remplacez ces valeurs par les vôtres
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions pour basculer entre les formulaires de connexion et d'inscription
function showSignupForm() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('signup-section').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('signup-section').style.display = 'none';
}

// Gérer la soumission du formulaire de CONNEXION
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert(error.message);
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Gérer la soumission du formulaire d'INSCRIPTION
async function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert(error.message);
    } else if (data.user) {
        // La création de l'utilisateur a réussi, mais il faut vérifier l'email
        alert("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
        window.location.href = 'index.html'; // Redirection vers la page de connexion
    }
}

// Lier les fonctions aux événements
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    document.getElementById('show-signup').addEventListener('click', showSignupForm);
    document.getElementById('show-login').addEventListener('click', showLoginForm);
});