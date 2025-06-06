<?php
// filepath: c:\xampp\htdocs\api\vues\reserver.php
session_start();
include_once '../includes/header.php';
include_once '../includes/navbar.php';
include_once '../config/Database.php';
include_once '../models/Trajet.php';
include_once '../models/Utilisateur.php';
include_once '../models/Voiture.php';
include_once '../models/Reservation.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['utilisateur_id'])) {
    // Rediriger vers la page de connexion avec un paramètre de redirection
    header('Location: connexion.php?redirect=reserver.php?trajet_id=' . $_GET['trajet_id']);
    exit;
}

// Vérifier si l'ID du trajet est fourni
if (!isset($_GET['trajet_id']) || empty($_GET['trajet_id'])) {
    header('Location: trajets-disponibles.php');
    exit;
}

$trajet_id = intval($_GET['trajet_id']);

// Initialiser la base de données
$database = new Database();
$db = $database->connect();

// Récupérer les détails du trajet
$trajet = new Trajet($db);
$trajet->trajet_id = $trajet_id;
if (!$trajet->read_single()) {
    // Si le trajet n'existe pas, rediriger vers la liste des trajets
    header('Location: trajets-disponibles.php?error=trajet_not_found');
    exit;
}

// Vérifier que l'utilisateur ne réserve pas son propre trajet
if ($trajet->utilisateur_id == $_SESSION['utilisateur_id']) {
    // Rediriger avec un message d'erreur
    header('Location: trajets-disponibles.php?error=own_trajet');
    exit;
}

// Récupérer les détails du conducteur
$conducteur = new Utilisateur($db);
$conducteur->utilisateur_id = $trajet->utilisateur_id;
$conducteur->read_single();

// Récupérer le véhicule
$voiture = new Voiture($db);
$voiture->voiture_id = $trajet->voiture_id;
$voiture->read_single();

// Vérifier si le trajet est complet
$query = "SELECT SUM(nombre_places_reservees) as places_reservees FROM reservations WHERE trajet_id = ? AND statut != 'annulé'";
$stmt = $db->prepare($query);
$stmt->execute([$trajet_id]);
$reservations = $stmt->fetch(PDO::FETCH_ASSOC);
$places_reservees = $reservations['places_reservees'] ?: 0;
$places_restantes = $trajet->nombre_places - $places_reservees;

// Vérifier si l'utilisateur a déjà réservé ce trajet
$reservation = new Reservation($db);
$user_reservations = $reservation->read_by_user_and_trajet($_SESSION['utilisateur_id'], $trajet_id);
$has_reservation = !empty($user_reservations);

// Traitement du formulaire de réservation
$reservation_success = false;
$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_reservation'])) {
    // Vérifier que le nombre de places demandées est valide
    $nombre_places = isset($_POST['nombre_places']) ? intval($_POST['nombre_places']) : 0;
    
    if ($nombre_places <= 0) {
        $error_message = "Veuillez sélectionner au moins une place.";
    } elseif ($nombre_places > $places_restantes) {
        $error_message = "Il n'y a pas assez de places disponibles. Places restantes: " . $places_restantes;
    } else {
        // Créer la réservation
        $reservation = new Reservation($db);
        $reservation->utilisateur_id = $_SESSION['utilisateur_id'];
        $reservation->trajet_id = $trajet_id;
        $reservation->nombre_places_reservees = $nombre_places;
        $reservation->statut = 'en attente';
        $reservation->montant_total = $trajet->prix * $nombre_places;
        $reservation->date_reservation = date('Y-m-d H:i:s');
        
        // Informations spéciales (bagages, commentaire)
        $reservation->bagages = isset($_POST['bagages']) ? 1 : 0;
        $reservation->commentaire = isset($_POST['commentaire']) ? htmlspecialchars($_POST['commentaire']) : '';
        
        // Essayer de créer la réservation
        if ($reservation->create()) {
            $reservation_success = true;
        } else {
            $error_message = "Une erreur est survenue lors de la réservation.";
        }
    }
}

// Formater les dates et heures
$date_depart = date('d/m/Y', strtotime($trajet->date_depart));
$heure_depart = date('H:i', strtotime($trajet->heure_depart));
$heure_arrivee = !empty($trajet->heure_arrivee) ? date('H:i', strtotime($trajet->heure_arrivee)) : 'Non précisée';
?>

<div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
        <div class="mb-6">
            <a href="trajets-disponibles.php" class="text-green-700 hover:text-green-800">
                <i class="fas fa-arrow-left mr-2"></i> Retour aux trajets
            </a>
        </div>
        
        <?php if ($reservation_success): ?>
        <!-- Message de succès -->
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <div class="flex items-center">
                <div class="py-1"><i class="fas fa-check-circle text-green-500 mr-2"></i></div>
                <div>
                    <p class="font-bold">Réservation effectuée avec succès!</p>
                    <p>Votre demande de réservation a été envoyée au conducteur. Vous recevrez une confirmation prochainement.</p>
                </div>
            </div>
            <div class="mt-4">
                <a href="../vues/dashboard.php" class="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Voir mes réservations
                </a>
            </div>
        </div>
        <?php elseif (!empty($error_message)): ?>
        <!-- Message d'erreur -->
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <div class="flex">
                <div class="py-1"><i class="fas fa-exclamation-circle text-red-500 mr-2"></i></div>
                <div>
                    <p class="font-bold">Erreur</p>
                    <p><?= $error_message ?></p>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <!-- Si l'utilisateur a déjà une réservation pour ce trajet -->
        <?php if ($has_reservation && !$reservation_success): ?>
        <div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
            <div class="flex">
                <div class="py-1"><i class="fas fa-info-circle text-blue-500 mr-2"></i></div>
                <div>
                    <p class="font-bold">Vous avez déjà réservé ce trajet</p>
                    <p>Vous pouvez consulter l'état de votre réservation dans la section "Mes réservations".</p>
                </div>
            </div>
            <div class="mt-4">
                <a href="../vues/dashboard.php" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Voir mes réservations
                </a>
            </div>
        </div>
        <?php endif; ?>
        
        <!-- Détails du trajet -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <h1 class="text-2xl font-bold mb-2">Réservation de trajet</h1>
                <p class="text-lg">
                    <?= htmlspecialchars($trajet->ville_depart) ?> → <?= htmlspecialchars($trajet->ville_arrivee) ?>
                </p>
                <p class="text-sm opacity-90">
                    <?= $date_depart ?> - Départ à <?= $heure_depart ?>
                </p>
            </div>
            
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Informations sur le trajet -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">Détails du trajet</h2>
                        
                        <div class="bg-gray-50 p-4 rounded-lg mb-4">
                            <div class="flex mb-4">
                                <div class="flex-shrink-0 w-8 flex justify-center">
                                    <div class="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">A</div>
                                </div>
                                <div class="ml-2">
                                    <h3 class="font-medium"><?= htmlspecialchars($trajet->ville_depart) ?></h3>
                                    <?php if (!empty($trajet->adresse_depart)): ?>
                                        <p class="text-sm text-gray-600"><?= htmlspecialchars($trajet->adresse_depart) ?></p>
                                    <?php endif; ?>
                                    <p class="text-sm text-gray-500"><?= $date_depart ?> à <?= $heure_depart ?></p>
                                </div>
                            </div>
                            
                            <div class="flex">
                                <div class="flex-shrink-0 w-8 flex justify-center">
                                    <div class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">B</div>
                                </div>
                                <div class="ml-2">
                                    <h3 class="font-medium"><?= htmlspecialchars($trajet->ville_arrivee) ?></h3>
                                    <?php if (!empty($trajet->adresse_arrivee)): ?>
                                        <p class="text-sm text-gray-600"><?= htmlspecialchars($trajet->adresse_arrivee) ?></p>
                                    <?php endif; ?>
                                    <?php if (!empty($trajet->heure_arrivee)): ?>
                                        <p class="text-sm text-gray-500">Arrivée estimée à <?= $heure_arrivee ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg mb-4">
                            <h3 class="font-medium mb-2">Conducteur</h3>
                            <div class="flex items-center">
                                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                                    <?php if (!empty($conducteur->photo)): ?>
                                        <img src="<?= htmlspecialchars($conducteur->photo) ?>" alt="Photo de profil" class="w-full h-full object-cover">
                                    <?php else: ?>
                                        <div class="w-full h-full flex items-center justify-center bg-green-100 text-green-700">
                                            <i class="fas fa-user text-xl"></i>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div>
                                    <p class="font-medium">
                                        <?= htmlspecialchars($conducteur->pseudo ?? ($conducteur->prenom . ' ' . substr($conducteur->nom, 0, 1) . '.')) ?>
                                    </p>
                                    <p class="text-sm text-gray-500">
                                        <?php 
                                        // Requête pour obtenir la note moyenne
                                        $query = "SELECT AVG(note) as moyenne FROM avis WHERE destinataire_id = ?";
                                        $stmt = $db->prepare($query);
                                        $stmt->execute([$conducteur->utilisateur_id]);
                                        $note = $stmt->fetch(PDO::FETCH_ASSOC);
                                        $note_moyenne = $note['moyenne'] ? round($note['moyenne'], 1) : 'Nouveau conducteur';
                                        echo $note_moyenne !== 'Nouveau conducteur' ? $note_moyenne . '/5' : $note_moyenne;
                                        ?>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-medium mb-2">Véhicule</h3>
                            <p class="text-gray-700"><?= htmlspecialchars($voiture->marque . ' ' . $voiture->modele) ?></p>
                            <p class="text-sm text-gray-600"><?= htmlspecialchars($voiture->couleur . ' • ' . $voiture->energie) ?></p>
                        </div>
                    </div>
                    
                    <!-- Formulaire de réservation -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">Votre réservation</h2>
                        
                        <?php if ($places_restantes <= 0 && !$reservation_success): ?>
                            <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                                <p class="font-bold">Trajet complet</p>
                                <p>Il n'y a plus de places disponibles pour ce trajet.</p>
                            </div>
                        <?php elseif (!$has_reservation || $reservation_success): ?>
                            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                                <div class="flex justify-between items-center mb-4">
                                    <div>
                                        <p class="text-lg font-bold text-green-700"><?= number_format($trajet->prix, 2) ?> €</p>
                                        <p class="text-sm text-gray-500">Par personne</p>
                                    </div>
                                    <div>
                                        <span class="text-green-600"><?= $places_restantes ?> place<?= $places_restantes > 1 ? 's' : '' ?> disponible<?= $places_restantes > 1 ? 's' : '' ?></span>
                                    </div>
                                </div>
                                
                                <?php if (!$reservation_success): ?>
                                    <form action="" method="POST">
                                        <div class="mb-4">
                                            <label for="nombre_places" class="block text-gray-700 font-medium mb-2">Nombre de places à réserver</label>
                                            <select id="nombre_places" name="nombre_places" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                                <?php for ($i = 1; $i <= min(4, $places_restantes); $i++): ?>
                                                    <option value="<?= $i ?>"><?= $i ?> place<?= $i > 1 ? 's' : '' ?> (<?= number_format($trajet->prix * $i, 2) ?> €)</option>
                                                <?php endfor; ?>
                                            </select>
                                        </div>
                                        
                                        <?php if ($trajet->bagages_autorises): ?>
                                            <div class="mb-4">
                                                <label class="flex items-center">
                                                    <input type="checkbox" name="bagages" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                                                    <span class="ml-2 text-gray-700">J'ai des bagages</span>
                                                </label>
                                            </div>
                                        <?php endif; ?>
                                        
                                        <div class="mb-6">
                                            <label for="commentaire" class="block text-gray-700 font-medium mb-2">Message pour le conducteur (facultatif)</label>
                                            <textarea id="commentaire" name="commentaire" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Informations supplémentaires, heure précise de rendez-vous..."></textarea>
                                        </div>
                                        
                                        <div class="bg-gray-100 p-4 rounded-lg mb-4">
                                            <h4 class="font-medium text-sm mb-2">Conditions de réservation</h4>
                                            <ul class="text-sm text-gray-600 space-y-1">
                                                <li>• Votre réservation doit être acceptée par le conducteur</li>
                                                <li>• Le paiement s'effectue directement auprès du conducteur</li>
                                                <li>• En cas d'annulation tardive, vous pourriez recevoir un avis négatif</li>
                                            </ul>
                                        </div>
                                        
                                        <button type="submit" name="submit_reservation" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                                            Réserver maintenant
                                        </button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>