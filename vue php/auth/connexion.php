<?php
include_once '../../includes/layouts/header.php';
include_once '../../includes/layouts/navbar.php';
?>

<div class="flex flex-col md:flex-row min-h-screen">
    <div class="md:w-1/2 p-8 flex items-center justify-center">
        <div class="max-w-md w-full">
            <h1 class="text-3xl font-bold mb-6">Connexion</h1>

            <?php if (isset($apiError)): ?>
                <div class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    <?php echo htmlspecialchars($apiError); ?>
                </div>
            <?php endif; ?>

            <form method="POST" action="../../Controllers/UtilisateurController.php" class="space-y-4">
                <div>
                    <label class="block mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                        class="w-full p-3 border rounded-lg <?php echo isset($errors['email']) ? 'border-red-500' : 'border-gray-300'; ?>" />
                    <?php if (isset($errors['email'])): ?>
                        <p class="text-red-500 text-sm mt-1"><?php echo htmlspecialchars($errors['email']); ?></p>
                    <?php endif; ?>
                </div>

                <div>
                    <label class="block mb-2">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        class="w-full p-3 border rounded-lg <?php echo isset($errors['password']) ? 'border-red-500' : 'border-gray-300'; ?>" />
                    <?php if (isset($errors['password'])): ?>
                        <p class="text-red-500 text-sm mt-1"><?php echo htmlspecialchars($errors['password']); ?></p>
                    <?php endif; ?>
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                    Se connecter
                </button>
            </form>

            <div class="mt-6 text-center">
                <a href="../vues/enregistrement.php" class="text-blue-600 hover:underline">
                    Créer un compte
                </a>
            </div>
        </div>
    </div>

    <div class="md:w-1/2">
        <img
            src="../../assets/image/car-login.jpg"
            alt="Connexion"
            class="w-full h-full object-cover" />
    </div>
</div>
<?php
include_once '../includes/layouts/footer.php';
?>