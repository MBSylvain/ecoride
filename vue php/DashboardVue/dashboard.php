<?php
// filepath: c:\xampp\htdocs\api\vues\dashboard.php
// Démarrer la session
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['utilisateur_id'])) {
    // Rediriger vers la page de connexion
    header("Location: ../auth/connexion.php");
    exit();
}

// Inclure les fichiers nécessaires
include_once '../../config/Database.php';
include_once '../../models/Dashboard.php';
include_once '../../models/Voiture.php';
include_once '../../models/Trajet.php';
include_once '../../models/Reservation.php';
include_once '../../models/Avis.php';
include_once '../../models/Role.php';
include_once '../../models/Utilisateur.php';

// Connexion à la base de données
$database = new Database();
$db = $database->connect();

// Récupérer les données du tableau de bord pour l'utilisateur connecté
$dashboard = new Dashboard($db, $_SESSION['utilisateur_id']);
$data = $dashboard->getData();

// Récupérer l'ID utilisateur
$utilisateur_id = $_SESSION['utilisateur_id'];

include_once $_SERVER["DOCUMENT_ROOT"] . "/ecoride-apie/includes/layouts/header.php";
include_once $_SERVER["DOCUMENT_ROOT"] . "/ecoride-apie/includes/layouts/navbar.php";
?>

<!-- Contenu principal -->
<div class="container px-4 py-8 mx-auto">
    <h1 class="mb-6 text-2xl font-bold text-center text-primary-90">Mon Tableau de Bord</h1>

    <!-- Section 1: Informations utilisateur -->
    <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 class="mb-4 text-xl font-semibold">Mes informations personnelles</h2>
        <?php if (isset($data['utilisateur'])): ?>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p class="text-gray-600">Nom:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['nom']) ?></p>
                </div>
                <div>
                    <p class="text-gray-600">Prénom:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['prenom']) ?></p>
                </div>
                <div>
                    <p class="text-gray-600">Email:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['email']) ?></p>
                </div>
                <div>
                    <p class="text-gray-600">Téléphone:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['telephone'] ?? 'Non renseigné') ?></p>
                </div>
                <div>
                    <p class="text-gray-600">Adresse:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['adresse'] ?? 'Non renseigné') ?></p>
                </div>
                <div>
                    <p class="text-gray-600">Date inscription:</p>
                    <p class="font-medium"><?= htmlspecialchars($data['utilisateur']['date_inscription'] ?? 'Non renseigné') ?></p>
                </div>
                <div class="mt-4">
                    <button onclick="detailshow()" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                        Modifier mes informations
                    </button>

                    <script>
                        // Afficher le détail
                        function detailshow() {
                            const detailElement = document.getElementById('modal');
                            if (detailElement) {
                                detailElement.classList.remove('hidden');
                            }
                        }

                        // Fermer le détail
                        function closeDetail() {
                            const detailElement = document.getElementById('modal');
                            if (detailElement) {
                                detailElement.classList.add('hidden');
                            }
                        }
                    </script>
                </div>
                <!-- Modal pour modifier mes informations -->

                <div id="modal" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-800 bg-opacity-75">
                    <div class="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
                        <h2 class="mb-4 text-xl font-semibold">Modifier mes informations</h2>
                        <form action="../controllers/UtilisateurController.php" method="POST">
                            <input type="hidden" name="action" value="update">
                            <input type="hidden" name="utilisateur_id" value="<?= $_SESSION['utilisateur_id'] ?>">
                            <div class="mb-4">
                                <label for="nom" class="block text-gray-700">Nom</label>
                                <input type="text" name="nom" id="nom" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['nom']) ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="prenom" class="block text-gray-700">Prénom</label>
                                <input type="text" name="prenom" id="prenom" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['prenom']) ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="email" class="block text-gray-700">Email</label>
                                <input type="email" name="email" id="email" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['email']) ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="telephone" class="block text-gray-700">Téléphone</label>
                                <input type="tel" name="telephone" id="telephone" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['telephone'] ?? 'Non renseigné') ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="adresse" class="block text-gray-700">Adresse</label>
                                <input type="text" name="adresse" id="adresse" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['adresse'] ?? 'Non renseigné') ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="date_naissance" class="block text-gray-700">Date de naissance</label>
                                <input type="date" name="date_naissance" id="date_naissance" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['date_naissance'] ?? 'Non renseigné') ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="pseudo" class="block text-gray-700">Pseudo</label>
                                <input type="text" name="pseudo" id="pseudo" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['pseudo'] ?? 'Non renseigné') ?>" required>
                            </div>
                            <div class="mb-4">
                                <label for="password" class="block text-gray-700">Mot de passe</label>
                                <input type="password" name="password" id="password" class="w-full px-3 py-2 border rounded" placeholder="Laissez vide pour ne pas changer">
                            </div>
                            <div class="mb-4">
                                <label for="role" class="block text-gray-700">Rôle</label>
                                <input type="text" name="role" id="role" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($data['utilisateur']['role'] ?? 'Non renseigné') ?>" required>
                            </div>

                            <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Enregistrer</button>
                            <button onclick="closeDetail()" class="mt-4 text-red-600 hover:text-red-800">Annuler</button>

                        </form>
                    </div>
                </div>
            <?php else: ?>
                <p>Aucune information disponible.</p>
            <?php endif; ?>
            </div>

            <!-- Section 2: Informations sur les voitures -->
            <?php
            $voitures = new Voiture($db);
            $voiture = json_decode($voitures->read_by_user($_SESSION['utilisateur_id']));
            ?>
            <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Mes voitures</h2>
                <?php if (isset($voiture) && is_array($voiture) && count($voiture) > 0): ?>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="px-4 py-3 text-left">Modèle</th>
                                    <th class="px-4 py-3 text-left">Immatriculation</th>
                                    <th class="px-4 py-3 text-left">Énergie</th>
                                    <th class="px-4 py-3 text-left">Couleur</th>
                                    <th class="px-4 py-3 text-left">Places</th>
                                    <th class="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($voiture as $voit): ?>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-4 py-3"><?= htmlspecialchars($voit->modele) ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($voit->immatriculation) ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($voit->energie ?? 'N/A') ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($voit->couleur ?? 'N/A') ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($voit->nombre_places ?? 'N/A') ?></td>
                                        <td class="px-4 py-3">
                                            <button onclick="showDetailVoiture(<?= $voit->voiture_id ?>)" class="mr-2 text-blue-600 hover:text-blue-800">Modifier</button>
                                            <form action="../controllers/VoitureController.php" method="POST" class="inline-block">
                                                <input type="hidden" name="voiture_id" value="<?= $voit->voiture_id ?>">
                                                <input type="hidden" name="action" value="delete">
                                                <button type="submit"
                                                    class="text-red-600 hover:text-red-800"
                                                    onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?');">Supprimer</button>
                                            </form>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4">
                        <a href="../vues/DashboardVue/dashvoituremaj.php" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Ajouter une voiture</a>
                    </div>
                <?php else: ?>
                    <p>Vous n'avez pas encore ajouté de voiture.</p>
                    <div class="mt-4">
                        <a href="../vues/DashboardVue/dashvoituremaj.php" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                            Ajouter une voiture
                        </a>
                    </div>

                <?php endif; ?>
            </div>
            <!-- script pour afficher le modal -->
            <script>
                // Afficher le détail de la voiture
                function showDetailVoiture(voitureId) {
                    const detailElement = document.getElementById('modalvoiture');
                    if (detailElement) {
                        detailElement.classList.remove('hidden');
                    }
                }

                // Fermer le détail de la voiture
                function closeDetailVoiture() {
                    const detailElement = document.getElementById('modalvoiture');
                    if (detailElement) {
                        detailElement.classList.add('hidden');
                    }
                }
            </script>
            <!-- modal por modifier les informations de la voiture -->
            <div id="modalvoiture" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-800 bg-opacity-75">
                <div class="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
                    <h2 class="mb-4 text-xl font-semibold">Modifier mes informations</h2>
                    <form action="../controllers/VoitureController.php" method="POST">
                        <input type="hidden" name="action" value="PUT">
                        <input type="hidden" name="voiture_id" value="<?= $voit->voiture_id ?>">

                        <div class="mb-4">
                            <label for="modele" class="block text-gray-700">Modèle</label>
                            <input type="text" name="modele" id="modele" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->modele) ?>" required>
                        </div>
                        <div class="mb-4">
                            <label for="immatriculation" class="block text-gray-700">Immatriculation</label>
                            <input type="text" name="immatriculation" id="immatriculation" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->immatriculation) ?>" required>
                        </div>
                        <div class="mb-4">
                            <label for="energie" class="block text-gray-700">Énergie</label>
                            <input type="text" name="energie" id="energie" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->energie ?? 'N/A') ?>" required>
                        </div>
                        <div class="mb-4">
                            <label for="couleur" class="block text-gray-700">Couleur</label>
                            <input type="text" name="couleur" id="couleur" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->couleur ?? 'N/A') ?>" required>
                        </div>
                        <div class="mb-4">
                            <label for="nombre_places" class="block text-gray-700">Nombre de places</label>
                            <input type="number" name="nombre_places" id="nombre_places" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->nombre_places ?? 'N/A') ?>" required>
                        </div>
                        <div class="mb-4">
                            <label for="photo_url" class="block text-gray-700">URL de la photo</label>
                            <input type="text" name="photo_url" id="photo_url" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($voit->photo_url ?? 'N/A') ?>">
                        </div>

                        <div class="mb-4">
                            <label for="description" class="block text-gray-700">Description</label>
                            <textarea name="description" id="description" class="w-full px-3 py-2 border rounded" rows="4"><?= htmlspecialchars($voit->description ?? 'N/A') ?></textarea>
                        </div>



                        <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Enregistrer</button>
                        <button type="button" onclick="closeDetailVoiture()" class="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400" data-modal-close>Annuler</button>
                    </form>
                </div>
            </div>


            <!-- Section 3: Informations sur les trajets -->
            <?php
            $trajets = new Trajet($db);
            $trajet_list = $trajets->read_by_conducteur($_SESSION['utilisateur_id']);
            ?>
            <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Mes trajets récents</h2>
                <?php if (isset($data['trajets']) && count($data['trajets']) > 0): ?>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="px-4 py-3 text-left">Départ</th>
                                    <th class="px-4 py-3 text-left">Arrivée</th>
                                    <th class="px-4 py-3 text-left">Date</th>
                                    <th class="px-4 py-3 text-left">Prix</th>
                                    <th class="px-4 py-3 text-left">Places</th>
                                    <th class="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($data['trajets'] as $trajet): ?>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-4 py-3"><?= htmlspecialchars($trajet['ville_depart']) ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($trajet['ville_arrivee']) ?></td>
                                        <td class="px-4 py-3"><?= date('d/m/Y H:i', strtotime($trajet['date_depart'])) ?></td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($trajet['prix']) ?> €</td>
                                        <td class="px-4 py-3"><?= htmlspecialchars($trajet['nombre_places']) ?></td>
                                        <td class="px-4 py-3">
                                            <button onclick="detailshow()" class="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700">Détails</button>
                                            <a href="../vues/DashboardVue/dashreservation.php?trajet_id=<?= $trajet['trajet_id'] ?>" class="mr-2 text-green-600 hover:text-green-800">Réservations</a>
                                            <?php if (strtotime($trajet['date_depart']) > time()): ?>
                                                <form action="../controllers/TrajetController.php" method="POST" class="inline-block">
                                                    <input type="hidden" name="trajet_id" value="<?= $trajet['trajet_id'] ?>">
                                                    <input type="hidden" name="action" value="DELETE">
                                                    <button type="submit"
                                                        class="text-red-600 hover:text-red-800"
                                                        onclick="return confirm('Êtes-vous sûr de vouloir annuler ce trajet ?');">Annuler</button>
                                                </form>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                    <script>
                                        // Afficher le détail
                                        function detailshow() {
                                            const detailElement = document.getElementById('modaltrajet');
                                            if (detailElement) {
                                                detailElement.classList.remove('hidden');
                                            }
                                        }

                                        // Fermer le détail
                                        function closeDetail() {
                                            const detailElement = document.getElementById('modaltrajet');
                                            if (detailElement) {
                                                detailElement.classList.add('hidden');
                                            }
                                        }
                                    </script>
                                    <!--Modal detail trajet-->
                                    <div id="modaltrajet" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-800 bg-opacity-75">
                                        <div class="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
                                            <h2 class="mb-4 text-xl font-semibold">Modifier mes informations</h2>
                                            <form action="../controllers/TrajetController.php" method="POST">
                                                <input type="hidden" name="action" value="PUT">
                                                <input type="hidden" name="voiture_id" value="<?= $trajet['voiture_id'] ?>">
                                                <input type="hidden" name="trajet_id" value="<?= $trajet['trajet_id'] ?>">
                                                <div class="mb-4">
                                                    <label for="ville_depart" class="block text-gray-700">Ville de départ</label>
                                                    <input type="text" name="ville_depart" id="ville_depart" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($trajet['ville_depart']) ?>" required>
                                                </div>
                                                <div class="mb-4">
                                                    <label for="ville_arrivee" class="block text-gray-700">Ville d'arrivée</label>
                                                    <input type="text" name="ville_arrivee" id="ville_arrivee" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($trajet['ville_arrivee']) ?>" required>
                                                </div>
                                                <div class="mb-4">
                                                    <label for="date_depart" class="block text-gray-700">Date de départ</label>
                                                    <input type="datetime-local" name="date_depart" id="date_depart" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars(date('Y-m-d\TH:i', strtotime($trajet['date_depart']))) ?>" required>
                                                </div>
                                                <div class="mb-4">
                                                    <label for="prix" class="block text-gray-700">Prix par passager (€)</label>
                                                    <input type="number" name="prix" id="prix" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($trajet['prix']) ?>" required>
                                                </div>
                                                <div class="mb-4">
                                                    <label for="nombre_places" class="block text-gray-700">Nombre de places</label>
                                                    <input type="number" name="nombre_places" id="nombre_places" class="w-full px-3 py-2 border rounded" value="<?= htmlspecialchars($trajet['nombre_places']) ?>" required>
                                                </div>
                                                <div class="mb-4">
                                                    <label for="description" class="block text-gray-700">Description</label>
                                                    <textarea name="description" id="description" class="w-full px-3 py-2 border rounded" rows="4"><?= htmlspecialchars($trajet['description'] ?? 'N/A') ?></textarea>
                                                </div>
                                                <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Enregistrer</button>
                                                <button type="button" onclick="closeDetail()" class="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400" data-modal-close>Annuler</button>
                                            </form>
                                        </div>
                                    </div>



                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                <?php else: ?>
                    <p>Vous n'avez pas encore proposé de trajet.</p>
                <?php endif; ?>
                <div class="mt-4">
                    <a href="../vues/DashboardVue/dashaddtrajet.php" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Proposer un trajet</a>
                </div>

            </div>



            <!-- Section 4: Réservations de trajets -->
            <?php
            $reservation = new Reservation($db);
            $reservations = $reservation->read_by_user($utilisateur_id);
            // Définir si l'utilisateur est conducteur en fonction de s'il a des voitures
            $is_conductor = isset($voiture) && is_array($voiture) && count($voiture) > 0;
            ?>
            <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Mes réservations</h2>
                <?php if (!empty($reservations)): ?>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="border-b-2 border-gray-200">
                                    <th class="px-4 py-3 text-left">Trajet</th>
                                    <th class="px-4 py-3 text-left">Date</th>
                                    <th class="px-4 py-3 text-left">Places</th>
                                    <th class="px-4 py-3 text-left">Montant</th>
                                    <th class="px-4 py-3 text-left">Statut</th>
                                    <th class="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($reservations as $res):
                                    // Déterminer la classe CSS du statut
                                    $statusClass = match ($res['statut']) {
                                        'confirmé' => 'bg-green-100 text-green-800',
                                        'en attente' => 'bg-yellow-100 text-yellow-800',
                                        'annulé' => 'bg-red-100 text-red-800',
                                        'refusé' => 'bg-gray-100 text-gray-800',
                                        default => 'bg-gray-100 text-gray-800'
                                    };

                                    // Déterminer si le trajet est à venir ou passé
                                    $is_past = isset($res['date_depart']) && strtotime($res['date_depart']) < time();
                                ?>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-4 py-3">
                                            <?= htmlspecialchars($res['ville_depart'] ?? 'N/A') ?> →
                                            <?= htmlspecialchars($res['ville_arrivee'] ?? 'N/A') ?>
                                        </td>
                                        <td class="px-4 py-3">
                                            <?= isset($res['date_depart']) ? date('d/m/Y H:i', strtotime($res['date_depart'])) : 'N/A' ?>
                                        </td>
                                        <td class="px-4 py-3">
                                            <?= htmlspecialchars($res['nombre_places_reservees'] ?? 'N/A') ?>
                                        </td>
                                        <td class="px-4 py-3">
                                            <?= number_format($res['montant_total'] ?? 0, 2) ?> €
                                        </td>
                                        <td class="px-4 py-3">
                                            <span class="px-2 py-1 rounded-full <?= $statusClass ?>">
                                                <?= ucfirst($res['statut'] ?? 'inconnu') ?>
                                            </span>
                                        </td>
                                        <td class="px-4 py-3">
                                            <button onclick="detailshowresa()" class="px-3 py-1 mr-2 text-white rounded bg-primary-100 hover:bg-blue-700">Détails</button>

                                            <?php if (!$is_past && $res['statut'] === 'en attente'): ?>
                                                <a href="javascript:void(0)" onclick="annulerReservation(<?= $res['reservation_id'] ?>)" class="text-red-600 hover:text-red-800">Annuler</a>
                                            <?php endif; ?>

                                            <?php if ($is_past && $res['statut'] === 'confirmé'): ?>
                                                <a href="../vues/donner-avis.php?reservation_id=<?= $res['reservation_id'] ?>" class="text-green-600 hover:text-green-800">Donner un avis</a>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <p>Vous n'avez pas encore effectué de réservation.</p>
                    <div class="mt-4">
                        <a href="../vues/trajets-disponibles.php" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                            Rechercher un trajet
                        </a>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Modal détails de la réservation -->
            <script>
                // Afficher le détail
                function detailshowresa() {
                    const detailElement = document.getElementById('detailreservation');
                    if (detailElement) {
                        detailElement.classList.remove('hidden');
                    }
                }

                // Fermer le détail
                function closeDetail() {
                    const detailElement = document.getElementById('detailreservation');
                    if (detailElement) {
                        detailElement.classList.add('hidden');
                    }
                }

                // Basculer l'état visible/caché
                function toggleDetail() {
                    const detailElement = document.getElementById('detailrreservation');
                    if (detailElement) {
                        detailElement.classList.toggle('hidden');
                    }
                }

                // Initialisation au chargement
                document.addEventListener('DOMContentLoaded', function() {
                    const closeButton = document.getElementById('close-detail');
                    if (closeButton) {
                        closeButton.addEventListener('click', closeDetail);
                    }

                    // Exemple d'ajout pour un bouton d'ouverture
                    const openButton = document.getElementById('open-detail');
                    if (openButton) {
                        openButton.addEventListener('click', detailshow);
                    }
                });
            </script>

            <div id="detailreservation" class="fixed inset-0 z-50 flex items-center justify-center hidden bg-gray-800 bg-opacity-75">
                <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
                    <h2 class="mb-4 text-xl font-bold">Détails du trajet</h2>
                    <div id="detail-content">
                        <div class="space-y-6">
                            <!-- Informations du conducteur -->
                            <div class="pb-4 border-b">
                                <h3 class="mb-2 text-lg font-bold text-green-700">Conducteur</h3>
                                <div class="flex items-center">
                                    <div class="w-16 h-16 mr-4 overflow-hidden bg-gray-200 rounded-full">
                                        <?php if (!empty($conducteur['photo'])): ?>
                                            <img src="<?= htmlspecialchars($conducteur['photo']) ?>" alt="Photo de profil" class="object-cover w-full h-full">
                                        <?php else: ?>
                                            <div class="flex items-center justify-center w-full h-full text-green-700 bg-green-100">
                                                <i class="text-xl fas fa-user"></i>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                    <div>
                                        <p class="text-lg font-medium"><?= htmlspecialchars($conducteur['pseudo'] ?? ($conducteur['prenom'] . ' ' . substr($conducteur['nom'], 0, 1) . '.')) ?></p>
                                        <div class="flex items-center">
                                            <div class="flex mr-1 text-yellow-400">
                                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                                    <?php if ($note_moyenne !== 'N/A' && $i <= $note_moyenne): ?>
                                                        <i class="fas fa-star"></i>
                                                    <?php elseif ($note_moyenne !== 'N/A' && $i - 0.5 <= $note_moyenne): ?>
                                                        <i class="fas fa-star-half-alt"></i>
                                                    <?php else: ?>
                                                        <i class="far fa-star"></i>
                                                    <?php endif; ?>
                                                <?php endfor; ?>
                                            </div>
                                            <span class="text-sm text-gray-500"><?= $note_moyenne !== 'N/A' ? $note_moyenne : 'Nouveau' ?></span>
                                        </div>
                                        <p class="text-sm text-gray-600">Membre depuis <?= (isset($conducteur['date_inscription'])) ? date('F Y', strtotime($conducteur['date_inscription'])) : 'récemment' ?></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Détails du trajet -->
                            <div class="pb-4 border-b">
                                <h3 class="mb-2 text-lg font-bold text-green-700">Détails du trajet</h3>
                                <div class="space-y-3">
                                    <div class="flex">
                                        <div class="w-8 text-center">
                                            <i class="text-green-600 fas fa-map-marker-alt"></i>
                                        </div>
                                        <div>
                                            <p class="font-medium"><?= htmlspecialchars($trajet_item['ville_depart']) ?></p>
                                            <p class="text-sm text-gray-500">
                                                <?= date('d/m/Y', strtotime($trajet_item['date_depart'])) ?> à <?= date('H:i', strtotime($trajet_item['heure_depart'])) ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="w-8 text-center">
                                            <i class="text-red-600 fas fa-map-marker-alt"></i>
                                        </div>
                                        <div>
                                            <p class="font-medium"><?= htmlspecialchars($trajet_item['ville_arrivee']) ?></p>
                                            <p class="text-sm text-gray-500">
                                                <?php if (!empty($trajet_item['heure_arrivee'])): ?>
                                                    Arrivée estimée à <?= date('H:i', strtotime($trajet_item['heure_arrivee'])) ?>
                                                <?php endif; ?>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <p class="font-bold"><?= number_format($trajet_item['prix'], 2) ?> € par personne</p>
                                        <p class="text-sm text-gray-600"><?= $places_restantes ?> place<?= $places_restantes > 1 ? 's' : '' ?> disponible<?= $places_restantes > 1 ? 's' : '' ?></p>
                                    </div>
                                </div>
                            </div>

                            <!-- Voiture -->
                            <div class="pb-4 border-b">
                                <h3 class="mb-2 text-lg font-bold text-green-700">Véhicule</h3>
                                <p class="text-sm text-gray-600"><?= htmlspecialchars($voiture_info['marque'] ?? 'Non précisée') ?></p>
                                <p class="text-sm text-gray-600"><?= htmlspecialchars($voiture_info['modele'] ?? 'Non précisée') ?></p>
                                <p class="text-sm text-gray-600">Couleur: <?= htmlspecialchars($voiture_info['couleur'] ?? 'Non précisée') ?></p>
                                <p class="text-sm text-gray-600">Énergie: <?= htmlspecialchars($voiture_info['energie'] ?? 'Non précisée') ?></p>
                            </div>

                            <!-- Options et préférences -->
                            <div class="pb-4 border-b">
                                <h3 class="mb-2 text-lg font-bold text-green-700">Préférences</h3>
                                <div class="flex flex-wrap gap-2">
                                    <?php if ($est_ecologique): ?>
                                        <span class="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                                            <i class="mr-1 fas fa-leaf"></i> Véhicule écologique
                                        </span>
                                    <?php endif; ?>

                                    <?php if ($trajet_item['bagages_autorises']): ?>
                                        <span class="inline-block px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                                            <i class="mr-1 fas fa-suitcase"></i> Bagages autorisés
                                        </span>
                                    <?php endif; ?>

                                    <?php if (isset($trajet_item['animaux_autorises']) && $trajet_item['animaux_autorises']): ?>
                                        <span class="inline-block px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                                            <i class="mr-1 fas fa-paw"></i> Animaux autorisés
                                        </span>
                                    <?php endif; ?>

                                    <?php if (isset($trajet_item['fumeur_autorise']) && $trajet_item['fumeur_autorise']): ?>
                                        <span class="inline-block px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                                            <i class="mr-1 fas fa-smoking"></i> Fumeur autorisé
                                        </span>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex justify-between">
                                <a href="contact.php?id=<?= $utilisateur_id ?>" class="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">
                                    <i class="mr-1 fas fa-comment-alt"></i> Contacter
                                </a>
                                <a href="reserver.php?trajet_id=<?= $trajet_item['trajet_id'] ?>" class="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700">
                                    <i class="mr-1 fas fa-check"></i> Réserver
                                </a>
                            </div>
                        </div>
                    </div>
                    <button id="close-detail" class="px-4 py-2 mt-4 font-bold text-white bg-red-600 rounded hover:bg-red-700">Fermer</button>
                </div>



                <!-- Section 5: Avis reçus et donnés -->
                <?php
                $avis = new Avis($db);
                // Récupérer les avis reçus
                $avis_recus = $avis->read_by_destinataire($utilisateur_id);
                // Récupérer les avis donnés
                $avis_donnes = $avis->read_by_auteur($utilisateur_id);
                ?>
                <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
                    <h2 class="mb-4 text-xl font-semibold">Mes avis</h2>

                    <!-- Sous-section : Avis reçus -->
                    <h3 class="mb-3 text-lg font-medium">Avis reçus</h3>
                    <?php if (!empty($avis_recus)): ?>
                        <div class="mb-6 overflow-x-auto">
                            <table class="min-w-full bg-white">
                                <thead>
                                    <tr class="border-b-2 border-gray-200">
                                        <th class="px-4 py-3 text-left">Date</th>
                                        <th class="px-4 py-3 text-left">De</th>
                                        <th class="px-4 py-3 text-left">Note</th>
                                        <th class="px-4 py-3 text-left">Commentaire</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($avis_recus as $avis_item): ?>
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <?= date('d/m/Y', strtotime($avis_item['date_creation'])) ?>
                                            </td>
                                            <td class="px-4 py-3">
                                                <?= htmlspecialchars($avis_item['prenom'] ?? 'Anonyme') ?>
                                            </td>
                                            <td class="px-4 py-3">
                                                <div class="flex">
                                                    <?php for ($i = 1; $i <= 5; $i++): ?>
                                                        <svg class="w-5 h-5 <?= $i <= $avis_item['note'] ? 'text-yellow-400' : 'text-gray-300' ?>" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                    <?php endfor; ?>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3">
                                                <?= htmlspecialchars($avis_item['commentaire'] ?? '') ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p class="mb-6">Vous n'avez pas encore reçu d'avis.</p>
                    <?php endif; ?>

                    <!-- Sous-section : Avis donnés -->
                    <h3 class="mb-3 text-lg font-medium">Avis donnés</h3>
                    <?php if (!empty($avis_donnes)): ?>
                        <div class="overflow-x-auto">
                            <table class="min-w-full bg-white">
                                <thead>
                                    <tr class="border-b-2 border-gray-200">
                                        <th class="px-4 py-3 text-left">Date</th>
                                        <th class="px-4 py-3 text-left">Pour</th>
                                        <th class="px-4 py-3 text-left">Note</th>
                                        <th class="px-4 py-3 text-left">Commentaire</th>
                                        <th class="px-4 py-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($avis_donnes as $avis_item): ?>
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <?= date('d/m/Y', strtotime($avis_item['date_creation'])) ?>
                                            </td>
                                            <td class="px-4 py-3">
                                                <?= htmlspecialchars($avis_item['prenom'] ?? 'Inconnu') ?>
                                            </td>
                                            <td class="px-4 py-3">
                                                <div class="flex">
                                                    <?php for ($i = 1; $i <= 5; $i++): ?>
                                                        <svg class="w-5 h-5 <?= $i <= $avis_item['note'] ? 'text-yellow-400' : 'text-gray-300' ?>" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                        </svg>
                                                    <?php endfor; ?>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3">
                                                <?= htmlspecialchars($avis_item['commentaire'] ?? '') ?>
                                            </td>
                                            <td class="px-4 py-3">
                                                <a href="../vues/modifier-avis.php?id=<?= $avis_item['avis_id'] ?>" class="mr-2 text-blue-600 hover:text-blue-800">Modifier</a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p>Vous n'avez pas encore donné d'avis.</p>
                    <?php endif; ?>
                </div>

                <!-- Section 6: Information sur le rôle -->
                <?php


                ?>
                <div class="p-6 mb-6 bg-white rounded-lg shadow-md">
                    <h2 class="mb-4 text-xl font-semibold">Mon profil utilisateur</h2>
                    <?php if (isset($data['utilisateur'])): ?>
                        <div class="mb-4">
                            <p class="text-gray-600">Rôle actuel:</p>
                            <p class="font-medium">
                                <span class="px-3 py-1 rounded-full 
                    <?php
                        htmlspecialchars($data['utilisateur']['nom']);
                        $role = $data['utilisateur']['role'] ?? 'membre';
                        $roleClass = 'bg-gray-200 text-gray-800'; // Default value

                        if ($role === 'Administrateur') {
                            $roleClass = 'bg-purple-200 text-purple-800';
                        } elseif ($role === 'Employer') {
                            $roleClass = 'bg-blue-200 text-blue-800';
                        } elseif ($role === 'Conducteur') {
                            $roleClass = 'bg-green-200 text-green-800';
                        } elseif ($role === 'Passager') {
                            $roleClass = 'bg-yellow-200 text-yellow-800';
                        }

                        echo $roleClass;
                    ?>">
                                    <?= htmlspecialchars(ucfirst($data['utilisateur']['role'] ?? 'membre')) ?>
                                </span>
                            </p>
                        </div>
                        <div class="mb-4">
                            <p class="text-gray-600">Date d'inscription:</p>
                            <p class="font-medium">
                                <?= isset($data['utilisateur']['date_inscription']) ? date('d/m/Y', strtotime($data['utilisateur']['date_inscription'])) : 'Non disponible' ?>
                            </p>
                        </div>
                        <div class="mb-4">
                            <p class="text-gray-600">Statut du compte:</p>
                            <p class="font-medium">
                                <span class="px-3 py-1 rounded-full 
                    <?= isset($data['utilisateur']['compte_verifie']) && $data['utilisateur']['compte_verifie'] ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800' ?>">
                                    <?= isset($data['utilisateur']['compte_verifie']) && $data['utilisateur']['compte_verifie'] ? 'Vérifié' : 'Non vérifié' ?>
                                </span>
                            </p>
                        </div>
                        <?php if ((!isset($user_role['libelle']) || $user_role['libelle'] === 'membre') && (!isset($data['utilisateur']['compte_verifie']) || !$data['utilisateur']['compte_verifie'])): ?>
                            <div class="mt-4">
                                <p class="mb-2 text-sm text-gray-600">Pour devenir conducteur, vous devez ajouter une voiture et vérifier votre compte.</p>
                                <a href="../vues/verifier-compte.php" class="text-blue-600 hover:text-blue-800">Vérifier mon compte</a>
                            </div>
                        <?php endif; ?>
                    <?php else: ?>
                        <p>Informations sur le profil non disponibles.</p>
                    <?php endif; ?>
                </div>
            </div>

            <script>
                // Fonction pour annuler une réservation
                function annulerReservation(reservationId) {
                    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
                        fetch('../controllers/ReservationController.php', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    reservation_id: reservationId,
                                    statut: 'annulé'
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                                window.location.reload();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Une erreur est survenue');
                            });
                    }
                }

                // Fonction pour annuler un trajet
                function annulerTrajet(trajetId) {
                    if (confirm('Êtes-vous sûr de vouloir annuler ce trajet ? Toutes les réservations associées seront également annulées.')) {
                        fetch('../controllers/TrajetController.php', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    trajet_id: trajetId,
                                    statut: 'annulé'
                                })
                            })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message);
                                window.location.reload();
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Une erreur est survenue');
                            });
                    }
                }

                // Script pour le menu responsive
                document.getElementById('menu-toggle').addEventListener('click', function() {
                    const menu = document.getElementById('menu');
                    if (menu.classList.contains('hidden')) {
                        menu.classList.remove('hidden');
                    } else {
                        menu.classList.add('hidden');
                    }
                });
            </script>
            <?php include_once '../includes/footer.php'; ?>