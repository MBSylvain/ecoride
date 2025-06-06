<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contactez-nous - EcoRide</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
    <div class="p-8 font-sans">
        <h1 class="text-3xl font-bold mb-4">Contactez-nous</h1>
        <p class="mb-6">
            Nous serions ravis de vous entendre! Si vous avez des questions, des
            suggestions ou des préoccupations, n'hésitez pas à nous contacter.
        </p>

        <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-2">Informations de contact</h2>
            <p>Email: support@ecoride.com</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
            <p>Adresse: 123 Rue de l'Écologie, 75001 Paris, France</p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold mb-4">Formulaire de contact</h2>
            <?php
            // Traitement du formulaire si soumis
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $name = htmlspecialchars($_POST['name'] ?? '');
                $email = htmlspecialchars($_POST['email'] ?? '');
                $message = htmlspecialchars($_POST['message'] ?? '');
                
                // Validation simple
                $errors = [];
                if (empty($name)) $errors[] = "Le nom est requis";
                if (empty($email)) $errors[] = "L'email est requis";
                if (!filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($email)) $errors[] = "Format d'email invalide";
                if (empty($message)) $errors[] = "Le message est requis";
                
                if (empty($errors)) {
                    // Code pour envoyer l'email (à implémenter selon vos besoins)
                    // mail($to, $subject, $message_body, $headers);
                    echo '<div class="p-4 mb-4 bg-green-100 text-green-700 rounded">Votre message a été envoyé avec succès!</div>';
                } else {
                    echo '<div class="p-4 mb-4 bg-red-100 text-red-700 rounded">';
                    foreach ($errors as $error) {
                        echo "<p>$error</p>";
                    }
                    echo '</div>';
                }
            }
            ?>
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <div class="mb-4">
                    <label class="block mb-2">Nom:</label>
                    <input
                        type="text"
                        name="name"
                        required
                        class="w-full p-2 border border-gray-300 rounded"
                        value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>"
                    />
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        required
                        class="w-full p-2 border border-gray-300 rounded"
                        value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                    />
                </div>
                <div class="mb-4">
                    <label class="block mb-2">Message:</label>
                    <textarea
                        name="message"
                        required
                        class="w-full p-2 border border-gray-300 rounded"
                    ><?php echo isset($_POST['message']) ? htmlspecialchars($_POST['message']) : ''; ?></textarea>
                </div>
                <button
                    type="submit"
                    class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Envoyer
                </button>
            </form>
        </div>
    </div>
</body>
</html>