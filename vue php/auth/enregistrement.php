<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/ecoride-apie/includes/layouts/header.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/ecoride-apie/includes/layouts/navbar.php";
?>

<body class="bg-gray-50">
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
            <h2 class="text-3xl font-extrabold text-center text-gray-900">
                Créer un compte
            </h2>

            <?php if (isset($error)): ?>
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form class="mt-8 space-y-6" method="POST" action="../../Controllers/UtilisateurController.php" enctype="multipart/form-data">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
                        <input id="nom" name="nom" type="text" required
                            class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                    </div>
                    <div>
                        <label for="prenom" class="block text-sm font-medium text-gray-700">Prénom</label>
                        <input id="prenom" name="prenom" type="text" required
                            class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" required
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="mot_de_passe" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input id="mot_de_passe" name="mot_de_passe" type="password" required
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                    <input id="confirm_password" name="confirm_password" type="password" required
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="pseudo" class="block text-sm font-medium text-gray-700">Pseudo (optionnel)</label>
                    <input id="pseudo" name="pseudo" type="text"
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="telephone" class="block text-sm font-medium text-gray-700">Téléphone (optionnel)</label>
                    <input id="telephone" name="telephone" type="tel"
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="adresse" class="block text-sm font-medium text-gray-700">Adresse (optionnelle)</label>
                    <textarea id="adresse" name="adresse"
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg" rows="2"></textarea>
                </div>

                <div>
                    <label for="date_naissance" class="block text-sm font-medium text-gray-700">Date de naissance (optionnelle)</label>
                    <input id="date_naissance" name="date_naissance" type="date"
                        class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                </div>

                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Je souhaite m'inscrire en tant que</label>
                    <select id="role" name="role" class="mt-1 p-3 w-full border border-gray-300 rounded-lg">
                        <option value="Passager">Passager</option>
                        <option value="Conducteur">Conducteur</option>
                    </select>
                </div>

                <input type="hidden" name="action" value="register">

                <button type="submit" class="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    S'inscrire
                </button>
            </form>

            <div class="text-center text-sm">
                <a href="connexion.php" class="font-medium text-blue-600 hover:text-blue-500">
                    Déjà un compte ? Se connecter
                </a>
            </div>
        </div>
    </div>
</body>
<?php
include_once '../../includes/footer.php';
?>

</html>