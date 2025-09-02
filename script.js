// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gérer la soumission du formulaire d'authentification (connexion ou inscription)
async function handleAuthForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isLogin = event.submitter.id === 'login-btn';

    let authResponse;
    if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
    } else {
        authResponse = await supabase.auth.signUp({ email, password });
    }

    const { data, error } = authResponse;

    if (error) {
        alert(error.message);
    } else {
        if (isLogin) {
            window.location.href = 'dashboard.html';
        } else {
            alert("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.");
        }
    }
}

// Fonction pour vérifier l'état de l'utilisateur (désactivée pour le moment)
/*
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
}
*/

// Initialisation des listeners au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthForm);
    }
    // checkAuth(); // Ligne commentée pour désactiver la redirection
});