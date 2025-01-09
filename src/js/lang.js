const translations = {
    en: {
        dashboard: 'Dashboard',
        products: 'Products',
        clients: 'Clients',
        users: 'Users',
        orders: 'Orders',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        confirm: 'Are you sure?',
        success: 'Operation successful',
        error: 'An error occurred',
        login: 'Login',
        username: 'Username',
        password: 'Password',
        welcome: 'Welcome',
        logout: 'Logout',
        totalUsers: 'Total Users',
        totalProducts: 'Total Products',
        totalClients: 'Total Clients',
        totalOrders: 'Total Orders',
        ordersOverTime: 'Orders Over Time',
        topProducts: 'Top Products',
        welcomeTitle: 'Welcome to your Finance App',
        welcomeSubtitle: 'Manage your finances with ease'
    },
    fr: {
        dashboard: 'Tableau de bord',
        products: 'Produits',
        clients: 'Clients',
        users: 'Utilisateurs',
        orders: 'Commandes',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        confirm: 'Êtes-vous sûr ?',
        success: 'Opération réussie',
        error: 'Une erreur est survenue',
        login: 'Connexion',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        welcome: 'Bienvenue',
        logout: 'Déconnexion',
        totalUsers: 'Total des utilisateurs',
        totalProducts: 'Total des produits',
        totalClients: 'Total des clients',
        totalOrders: 'Total des commandes',
        ordersOverTime: 'Commandes au fil du temps',
        topProducts: 'Meilleurs produits',
        welcomeTitle: 'Bienvenue sur votre application financière',
        welcomeSubtitle: 'Gérez vos finances en toute simplicité'

    }
};

export const lang = {
    currentLanguage: 'en',

    setLanguage(language) {
        if (translations[language]) {
            this.currentLanguage = language;
            this.updateUI();
        }
    },

    t(key) {
        return translations[this.currentLanguage][key] || key;
    },

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
    }
};

