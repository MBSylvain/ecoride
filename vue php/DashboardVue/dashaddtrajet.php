<?php
session_start();
$utilisateur_id = $_SESSION['utilisateur_id'];

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['utilisateur_id'])) {
    // Rediriger vers la page de connexion
    header("Location: /api/login.php");
    exit();
}

// Inclure les fichiers nécessaires
include_once '../../config/Database.php';
include_once '../../models/Dashboard.php';
include_once '../../models/Voiture.php';
include_once '../../models/Trajet.php';
//inclure les barres de navigation
include_once '../../includes/layouts/header.php';
include_once '../../includes/layouts/navbar.php';

// Connexion à la base de données
$database = new Database();
$db = $database->connect();
$voiture = new Voiture($db);
$trajet = new Trajet($db);

// Récupérer les données du formulaire
$data = (object)$_POST;
$utilisateur_id = $_SESSION['utilisateur_id'];

// Récupérer les trajets de l'utilisateur
$trajets = $trajet->read_by_conducteur($utilisateur_id);

// Récupérer les données du trajet si l'ID est fourni
$trip_data = null;
if (isset($_GET['trajet_id'])) {
    $trajet->trajet_id = $_GET['trajet_id'];
    if ($trajet->read_single()) {
        $trip_data = $trajet->data;
    } else {
        // Trajet non trouvé, rediriger ou afficher un message d'erreur
        header("Location: /api/error.php");
        exit();
    }
}

// Récupérer les voitures de l'utilisateur
$voitures = json_decode($voiture->read_by_user($utilisateur_id), true); // Convertir en array associatif
?>

<!-- Formulaire d'ajout/modification de trajet -->
<div id="update-trip-form" class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-xl font-semibold mb-4"><?= isset($_GET['trajet_id']) ? 'Modifier mon trajet' : 'Proposer un trajet' ?></h2>
    <!-- Formulaire d'ajout/modification de trajet -->
    <div id="update-trip-form" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-semibold mb-4"><?= isset($_GET['trajet_id']) ? 'Modifier mon trajet' : 'Proposer un trajet' ?></h2>
        <form action="../../controllers/TrajetController.php" method="POST">
            <input type="hidden" name="action" value="<?= isset($_GET['trajet_id']) ? 'update_trip' : 'add_trip' ?>">
            <input type="hidden" name="utilisateur_id" value="<?= $_SESSION['utilisateur_id'] ?>">
            <?php if (isset($_GET['trajet_id'])): ?>
                <input type="hidden" name="trajet_id" value="<?= intval($_GET['trajet_id']) ?>">
            <?php endif; ?>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="ville_depart" class="block text-gray-700 mb-2">Ville de départ</label>
                    <input type="text" id="ville_depart" name="ville_depart" value="<?= isset($trip_data) ? htmlspecialchars($trip_data['ville_depart']) : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label for="ville_arrivee" class="block text-gray-700 mb-2">Ville d'arrivée</label>
                    <input type="text" id="ville_arrivee" name="ville_arrivee" value="<?= isset($trip_data) ? htmlspecialchars($trip_data['ville_arrivee']) : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label for="adresse_depart" class="block text-gray-700 mb-2">Adresse de départ</label>
                    <input type="text" id="adresse_depart" name="adresse_depart" value="<?= isset($trip_data) ? htmlspecialchars($trip_data['adresse_depart'] ?? '') : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <div>
                    <label for="adresse_arrivee" class="block text-gray-700 mb-2">Adresse d'arrivée</label>
                    <input type="text" id="adresse_arrivee" name="adresse_arrivee" value="<?= isset($trip_data) ? htmlspecialchars($trip_data['adresse_arrivee'] ?? '') : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                <div>
                    <label for="date_depart" class="block text-gray-700 mb-2">Date de départ</label>
                    <input type="datetime-local" id="date_depart" name="date_depart"
                        value="<?= isset($trip_data) ? htmlspecialchars(date('Y-m-d\TH:i', strtotime($trip_data['date_depart']))) : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label for="nombre_places" class="block text-gray-700 mb-2">Places disponibles</label>
                    <input type="number" id="nombre_places" name="nombre_places" min="1" max="8" value="<?= isset($trip_data) ? intval($trip_data['nombre_places']) : '3' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label for="prix" class="block text-gray-700 mb-2">Prix par passager (€)</label>
                    <input type="number" id="prix" name="prix" min="0" step="0.01" value="<?= isset($trip_data) ? floatval($trip_data['prix']) : '' ?>"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                </div>
                <div>
                    <label for="voiture_id" class="block text-gray-700 mb-2">Véhicule</label>
                    <select id="voiture_id" name="voiture_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
                        <option value="">Sélectionner un véhicule</option>
                        <?php if (is_array($voitures) && !empty($voitures)): ?>
                            <?php foreach ($voitures as $v): ?>
                                <?php
                                $displayText = htmlspecialchars(
                                    ($v['marque'] ?? '') . ' ' .
                                        ($v['modele'] ?? '') . ' (' .
                                        ($v['immatriculation'] ?? '') . ')'
                                );
                                ?>
                                <option value="<?= $v['voiture_id'] ?? '' ?>"
                                    <?= (isset($trip_data['voiture_id']) && $trip_data['voiture_id'] == $v['voiture_id']) ? 'selected' : '' ?>>
                                    <?= $displayText ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
            </div>

            <div class="mb-4">
                <label for="description" class="block text-gray-700 mb-2">Description (optionnel)</label>
                <textarea id="description" name="description"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" rows="3"><?= isset($trip_data) ? htmlspecialchars($trip_data['description'] ?? '') : '' ?></textarea>
            </div>

            <div class="mb-4">
                <div class="flex items-center">
                    <input type="checkbox" id="bagages_autorises" name="bagages_autorises" value="1"
                        <?= (isset($trip_data) && isset($trip_data['bagages_autorises']) && $trip_data['bagages_autorises'] == 1) ? 'checked' : '' ?>
                        class="w-4 h-4 text-green-600 focus:ring-green-500">
                    <label for="bagages_autorises" class="ml-2 block text-gray-700">Bagages volumineux acceptés</label>
                </div>
                <div class="flex items-center mt-2">
                    <input type="checkbox" id="fumeur_autorise" name="fumeur_autorise" value="1"
                        <?= (isset($trip_data) && isset($trip_data['fumeur_autorise']) && $trip_data['fumeur_autorise'] == 1) ? 'checked' : '' ?>
                        class="w-4 h-4 text-green-600 focus:ring-green-500">
                    <label for="fumeur_autorise" class="ml-2 block text-gray-700">Fumeurs acceptés</label>
                </div>
                <div class="flex items-center mt-2">
                    <input type="checkbox" id="animaux_autorises" name="animaux_autorises" value="1"
                        <?= (isset($trip_data) && isset($trip_data['animaux_autorises']) && $trip_data['animaux_autorises'] == 1) ? 'checked' : '' ?>
                        class="w-4 h-4 text-green-600 focus:ring-green-500">
                    <label for="animaux_autorises" class="ml-2 block text-gray-700">Animaux acceptés</label>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="button" onclick="window.location.href='dashboard.php'" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md mr-2">
                    Annuler
                </button>
                <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
                    <?= isset($_GET['trajet_id']) ? 'Modifier' : 'Proposer' ?> le trajet
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    // Function for cancel button
    function hideForm(formId) {
        window.location.href = 'dashboard.php';
    }
</script>