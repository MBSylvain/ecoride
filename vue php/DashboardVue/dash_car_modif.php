<?php
include_once '../../config/Database.php';
include_once '../../models/Utilisateur.php';
include_once '../../includes/header.php';
include_once '../../includes/navbar.php';
include_once '../../models/Voiture.php';
session_start();
$database = new Database();
$db = $database->connect();
$utilisateur = new Utilisateur($db);
$voiture = new Voiture($db);
//Récupération de l'utilisateur connecté
$utilisateur_email = $_SESSION['email'];
// Récupéraition des données selon la méthode
$method = $_SERVER['REQUEST_METHOD'];
// Récupération de l'id de l'utilisateur connecté
$utilisateur_id = $_SESSION['utilisateur_id'];


// Si l'utilisateur n'existe pas, rediriger
if (!$utilisateur_email) {
    header('Location: ../vues/connexion.php');
    exit;
}
// Récupération de la voiture à modifier
$voiture_id = null;
if (isset($_GET['voiture_id'])) {
    $voiture_id = $_GET['voiture_id'];
} elseif (isset($_POST['voiture_id'])) {
    $voiture_id = $_POST['voiture_id'];
}

if (isset($utilisateur_id) && $voiture_id) {
    $voiture->voiture_id = $voiture_id;
    if ($voiture->read_single()) {
        // Data retrieved successfully
        echo json_encode($voiture->data);
    } else {
        http_response_code(404);
        echo json_encode(array('message' => 'Voiture non trouvée'));
    }
}

?>

<!-- Formulaire d'ajout/modification de voiture -->
<div id="update-car-form" class="bg-white p-6 rounded-lg shadow-md mb-6">
       
    <h2 class="text-xl font-semibold mb-4">Ajouter une voiture</h2>
    <form action="../../controllers/VoitureController.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="utilisateur_id" value="<?= $_SESSION['utilisateur_id'] ?>">
        <input type="hidden" name="voiture_id" value="<?= isset($voiture->id) ? $voiture->id : '' ?>">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label for="marque" class="block text-gray-700 mb-2">Marque</label>
                <input type="text" id="marque" name="marque" 
                    placeholder=<?php $voiture->marque?>
                    value="<?= isset($voiture->marque) ? $voiture->marque : '' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div>
                <label for="modele" class="block text-gray-700 mb-2">Modèle</label>
                <input type="text" id="modele" name="modele" 
                    placeholder="Entrez le modèle"
                    value="<?= isset($voiture->modele) ? $voiture->modele : '' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div>
                <label for="immatriculation" class="block text-gray-700 mb-2">Immatriculation</label>
                <input type="text" id="immatriculation" name="immatriculation" 
                    placeholder="Ex: AB-123-CD"
                    value="<?= isset($voiture->immatriculation) ? $voiture->immatriculation : '' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div>
                <label for="date_premiere_immatriculation" class="block text-gray-700 mb-2">Date de première immatriculation</label>
                <input type="date" id="date_premiere_immatriculation" name="date_premiere_immatriculation" 
                    value="<?= isset($voiture->date_premiere_immatriculation) ? $voiture->date_premiere_immatriculation : '' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
            <div>
                <label for="couleur" class="block text-gray-700 mb-2">Couleur</label>
                <input type="text" id="couleur" name="couleur" 
                    placeholder="Ex: Noir, Rouge, Blanc..."
                    value="<?= isset($voiture->couleur) ? $voiture->couleur : '' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
            </div>
            <div>
                <label for="energie" class="block text-gray-700 mb-2">Énergie</label>
                <select id="energie" name="energie" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="essence" <?= (isset($voiture->energie) && $voiture->energie == 'essence') ? 'selected' : '' ?>>Essence</option>
                    <option value="diesel" <?= (isset($voiture->energie) && $voiture->energie == 'diesel') ? 'selected' : '' ?>>Diesel</option>
                    <option value="electrique" <?= (isset($voiture->energie) && $voiture->energie == 'electrique') ? 'selected' : '' ?>>Électrique</option>
                    <option value="hybride" <?= (isset($voiture->energie) && $voiture->energie == 'hybride') ? 'selected' : '' ?>>Hybride</option>
                </select>
            </div>
            <div>
                <label for="nombre_places" class="block text-gray-700 mb-2">Nombre de places</label>
                <input type="number" id="nombre_places" name="nombre_places" min="1" max="9" 
                    value="<?= isset($voiture->nombre_places) ? $voiture->nombre_places : '4' ?>"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required>
            </div>
        </div>

        <div class="mb-4">
            <label for="photo_url" class="block text-gray-700 mb-2">URL de la photo</label>
            <input type="text" id="photo_url" name="photo_url" 
                placeholder="http://exemple.com/image.jpg"
                value="<?= isset($voiture->photo_url) ? $voiture->photo_url : '' ?>"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
        </div>
        
        <div class="mb-4">
            <label for="description" class="block text-gray-700 mb-2">Description (optionnelle)</label>
            <textarea id="description" name="description" 
                placeholder="Décrivez votre véhicule"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" rows="3"><?= isset($voiture->description) ? $voiture->description : '' ?></textarea>
        </div>
        
        <div class="flex justify-end">
            <button type="button" onclick="history.back()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md mr-2">
                Annuler
            </button>
            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
                <?= isset($voiture->id) ? 'Mettre à jour' : 'Ajouter' ?>
            </button>
        </div>
        <input type="hidden" name="action" value="<?= isset($voiture->id) ? 'update' : 'create' ?>">
    </form>
</div>