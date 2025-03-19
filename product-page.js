// Fonctions pour les pages de produit
document.addEventListener('DOMContentLoaded', function() 
{
    // Gestion des onglets
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Fonction pour changer d'image principale
    window.changeImage = function(src) {
        document.getElementById('main-product-image').src = src;
        
        // Mettre à jour les classes des miniatures
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            if (thumb.src === src) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    };
    
    // Fonction pour ouvrir un onglet
    window.openTab = function(tabId) {
        // Cacher tous les contenus d'onglets
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Afficher l'onglet sélectionné
        document.getElementById(tabId).classList.add('active');
        
        // Mise à jour des boutons d'onglet (optionnel)
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };