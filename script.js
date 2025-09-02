// Configuration de Supabase
const SUPABASE_URL = 'https://zisovayurzyrkpmzqcul.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppc292YXl1cnp5cmtwbXpxY3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MzExNTUsImV4cCI6MjA3MDQwNzE1NX0.IS40LYSsLzaL-It1ypRZsvgrifb5vhxMsin5y5nnstk';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Gérer la soumission du formulaire d'authentification (connexion ou inscription)
async function handleAuthForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isLogin = event.submitter.id === 'login-btn'; // On vérifie si le bouton cliqué est 'login'

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
            // On peut rediriger vers une page d'attente ou la même page
        }
    }
}

// Vérifier l'état de l'utilisateur au chargement des pages
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        // L'utilisateur est connecté, on le redirige vers le tableau de bord
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // L'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Initialisation des listeners au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthForm);
    }
    checkAuth();
});