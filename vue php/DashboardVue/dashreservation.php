<?php
// filepath: c:\xampp\htdocs\api\vues\DashboardVue\dashreservation.php
// Démarrer la session
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['utilisateur_id'])) {
    // Rediriger vers la page de connexion
    header("Location: /api/login.php");
    exit();
}

// Inclure les fichiers nécessaires
include_once '../../config/Database.php';
include_once '../../models/Trajet.php';
include_once '../../models/Reservation.php';
include_once '../../models/Utilisateur.php';
include_once '../../includes/header.php';
include_once '../../includes/navbar.php';

// Connexion à la base de données
$database = new Database();
$db = $database->connect();

// Récupération de l'ID utilisateur
$utilisateur_id = $_SESSION['utilisateur_id'];

// Initialisation des objets
$trajet = new Trajet($db);
$reservation = new Reservation($db);
$utilisateur = new Utilisateur($db);

// Message de retour
$message = '';
$message_type = '';

// Traitement des actions (annuler, confirmer, etc.)
if (isset($_GET['action']) && isset($_GET['id'])) {
    $action = $_GET['action'];
    $id = intval($_GET['id']);
    
    // Vérification de l'existence de la réservation
    $reservation->reservation_id = $id;
    if ($reservation->read_single()) {
        // Récupération des informations du trajet
        $trajet->trajet_id = $reservation->trajet_id;
        $trajet->read_single();
        
        // Vérifier si l'utilisateur est le conducteur du trajet
        $is_conductor = ($trajet->utilisateur_id == $utilisateur_id);
        
        // Vérifier si l'utilisateur est le passager
        $is_passenger = ($reservation->utilisateur_id == $utilisateur_id);
        
        // Exécuter l'action appropriée
        if ($action === 'confirmer' && $is_conductor) {
            $reservation->statut = 'confirmé';
            if ($reservation->update()) {
                $message = "La réservation a été confirmée avec succès.";
                $message_type = "success";
            } else {
                $message = "Une erreur est survenue lors de la confirmation.";
                $message_type = "danger";
            }
        } elseif ($action === 'refuser' && $is_conductor) {
            $reservation->statut = 'refusé';
            if ($reservation->update()) {
                $message = "La réservation a été refusée.";
                $message_type = "success";
            } else {
                $message = "Une erreur est survenue lors du refus.";
                $message_type = "danger";
            }
        } elseif ($action === 'annuler' && ($is_conductor || $is_passenger)) {
            $reservation->statut = 'annulé';
            if ($reservation->update()) {
                $message = "La réservation a été annulée avec succès.";
                $message_type = "success";
            } else {
                $message = "Une erreur est survenue lors de l'annulation.";
                $message_type = "danger";
            }
        } else {
            $message = "Vous n'avez pas l'autorisation d'effectuer cette action.";
            $message_type = "danger";
        }
    } else {
        $message = "Réservation introuvable.";
        $message_type = "danger";
    }
}

// Récupération des données

// Option 1: Afficher les détails d'une réservation spécifique
if (isset($_GET['reservation_id'])) {
    $reservation_id = intval($_GET['reservation_id']);
    $reservation->reservation_id = $reservation_id;
    
    // Récupérer les données de la réservation
    if ($reservation->read_single()) {
        // Récupérer les détails du trajet
        $trajet->trajet_id = $reservation->trajet_id;
        $trajet->read_single();
        
        // Déterminer si l'utilisateur est conducteur
        $is_conductor = ($trajet->utilisateur_id == $utilisateur_id);
        
        // Récupérer les informations sur le passager ou le conducteur
        $other_user = new Utilisateur($db);
        $other_user->utilisateur_id = $is_conductor ? $reservation->utilisateur_id : $trajet->utilisateur_id;
        $other_user->read_single();
        
        // Créer un tableau formaté pour l'affichage
        $reservation_data = [
            'reservation_id' => $reservation->reservation_id,
            'utilisateur_id' => $reservation->utilisateur_id,
            'trajet_id' => $reservation->trajet_id,
            'nombre_places_reservees' => $reservation->nombre_places_reservees,
            'statut' => $reservation->statut,
            'montant_total' => $reservation->montant_total,
            'date_reservation' => $reservation->date_reservation,
            'date_confirmation' => $reservation->date_confirmation,
            'point_rdv' => $reservation->point_rdv,
            'commentaire' => $reservation->commentaire,
            'bagages' => $reservation->bagages,
            'ville_depart' => $trajet->ville_depart,
            'ville_arrivee' => $trajet->ville_arrivee,
            'date_depart' => $trajet->date_depart,
            'heure_depart' => $trajet->heure_depart,
            'prix' => $trajet->prix,
            'other_user_name' => $other_user->prenom . ' ' . substr($other_user->nom, 0, 1) . '.',
            'other_user_id' => $other_user->utilisateur_id,
            'other_user_email' => $other_user->email,
            'other_user_tel' => $other_user->telephone
        ];
    } else {
        $message = "Réservation introuvable.";
        $message_type = "danger";
    }
}
// Option 2: Afficher toutes les réservations pour un trajet spécifique
elseif (isset($_GET['trajet_id'])) {
    $trajet_id = intval($_GET['trajet_id']);
    $trajet->trajet_id = $trajet_id;
    
    // Vérifier que le trajet existe
    if ($trajet->read_single()) {
        // Vérifier que l'utilisateur connecté est le conducteur du trajet
        if ($trajet->utilisateur_id == $utilisateur_id) {
            // Récupérer toutes les réservations pour ce trajet
            $reservation->trajet_id = $trajet_id;
            $result = $reservation->read_by_trajet();
            $reservations = [];
            
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                // Récupérer les informations du passager
                $passager = new Utilisateur($db);
                $passager->utilisateur_id = $row['utilisateur_id'];
                $passager->read_single();
                
                $row['passager_nom'] = $passager->prenom . ' ' . substr($passager->nom, 0, 1) . '.';
                $row['passager_email'] = $passager->email;
                $row['passager_tel'] = $passager->telephone;
                
                $reservations[] = $row;
            }
            
            $is_conductor = true;
        } else {
            $message = "Vous n'êtes pas autorisé à voir ces réservations.";
            $message_type = "danger";
        }
    } else {
        $message = "Trajet introuvable.";
        $message_type = "danger";
    }
}
// Option 3: Afficher toutes les réservations de l'utilisateur
else {
    $reservations = $reservation->read_by_user($utilisateur_id);
}
?>

<!-- Contenu principal -->
<div class="container mx-auto px-4 py-8">
    <div class="mb-6">
        <a href="../../vues/dashboard.php" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour au tableau de bord
        </a>
    </div>

    <?php if (!empty($message)): ?>
        <div class="mb-6 p-4 rounded-md <?= $message_type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'; ?>">
            <?= $message ?>
        </div>
    <?php endif; ?>

    <!-- Option 1: Détails d'une réservation spécifique -->
    <?php if (isset($reservation_data)): ?>
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="bg-blue-600 text-white p-4">
                <h1 class="text-xl font-bold">Détails de la réservation #<?= $reservation_data['reservation_id'] ?></h1>
                <p><?= $reservation_data['ville_depart'] ?> → <?= $reservation_data['ville_arrivee'] ?></p>
            </div>
            
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Informations sur la réservation -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">Informations sur le trajet</h2>
                        
                        <div class="mb-4">
                            <p class="text-gray-700 mb-2"><strong>Date et heure de départ:</strong> <?= date('d/m/Y à H:i', strtotime($reservation_data['date_depart'] . ' ' . $reservation_data['heure_depart'])) ?></p>
                            <p class="text-gray-700 mb-2"><strong>Prix par place:</strong> <?= number_format($reservation_data['prix'], 2) ?> €</p>
                            <p class="text-gray-700 mb-2"><strong>Statut actuel:</strong> 
                                <span class="px-2 py-1 rounded-full text-xs 
                                    <?= $reservation_data['statut'] === 'confirmé' ? 'bg-green-100 text-green-800' : 
                                       ($reservation_data['statut'] === 'en attente' ? 'bg-yellow-100 text-yellow-800' : 
                                       ($reservation_data['statut'] === 'annulé' ? 'bg-red-100 text-red-800' : 
                                       'bg-gray-100 text-gray-800')) ?>">
                                    <?= ucfirst($reservation_data['statut']) ?>
                                </span>
                            </p>
                        </div>
                        
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">Détails de la réservation</h2>
                        
                        <div class="mb-4">
                            <p class="text-gray-700 mb-2"><strong>Places réservées:</strong> <?= $reservation_data['nombre_places_reservees'] ?></p>
                            <p class="text-gray-700 mb-2"><strong>Montant total:</strong> <?= number_format($reservation_data['montant_total'], 2) ?> €</p>
                            <p class="text-gray-700 mb-2"><strong>Date de réservation:</strong> <?= date('d/m/Y H:i', strtotime($reservation_data['date_reservation'])) ?></p>
                            <?php if ($reservation_data['date_confirmation']): ?>
                                <p class="text-gray-700 mb-2"><strong>Date de confirmation:</strong> <?= date('d/m/Y H:i', strtotime($reservation_data['date_confirmation'])) ?></p>
                            <?php endif; ?>
                            <p class="text-gray-700 mb-2"><strong>Bagages:</strong> <?= $reservation_data['bagages'] ? 'Oui' : 'Non' ?></p>
                            <?php if ($reservation_data['commentaire']): ?>
                                <p class="text-gray-700 mb-2"><strong>Commentaire:</strong> <?= nl2br(htmlspecialchars($reservation_data['commentaire'])) ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                    
                    <!-- Coordonnées et actions -->
                    <div>
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">
                            Coordonnées du <?= $is_conductor ? 'passager' : 'conducteur' ?>
                        </h2>
                        
                        <div class="bg-gray-50 p-4 rounded-lg mb-6">
                            <p class="text-gray-700 mb-2"><strong>Nom:</strong> <?= $reservation_data['other_user_name'] ?></p>
                            
                            <?php if ($reservation_data['statut'] === 'confirmé'): ?>
                                <p class="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:<?= $reservation_data['other_user_email'] ?>" class="text-blue-600 hover:text-blue-800"><?= $reservation_data['other_user_email'] ?></a></p>
                                <?php if ($reservation_data['other_user_tel']): ?>
                                <p class="text-gray-700 mb-2"><strong>Téléphone:</strong> <a href="tel:<?= $reservation_data['other_user_tel'] ?>" class="text-blue-600 hover:text-blue-800"><?= $reservation_data['other_user_tel'] ?></a></p>
                                <?php endif; ?>
                            <?php else: ?>
                                <p class="text-gray-600 text-sm italic">Les coordonnées complètes seront disponibles après confirmation de la réservation.</p>
                            <?php endif; ?>
                        </div>
                        
                        <h2 class="text-lg font-semibold mb-4 text-gray-800">Actions</h2>
                        
                        <div class="space-y-2">
                            <?php if ($is_conductor && $reservation_data['statut'] === 'en attente'): ?>
                            <div class="flex space-x-2">
                                <a href="?action=confirmer&id=<?= $reservation_data['reservation_id'] ?>" 
                                   class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
                                    Confirmer
                                </a>
                                <a href="?action=refuser&id=<?= $reservation_data['reservation_id'] ?>" 
                                   class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                                    Refuser
                                </a>
                            </div>
                            <?php endif; ?>
                            
                            <?php if (($is_conductor || $reservation_data['utilisateur_id'] == $utilisateur_id) && $reservation_data['statut'] !== 'annulé'): ?>
                            <div>
                                <a href="?action=annuler&id=<?= $reservation_data['reservation_id'] ?>" 
                                   onclick="return confirm('Êtes-vous sûr de vouloir annuler cette réservation ?');"
                                   class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">
                                    Annuler la réservation
                                </a>
                            </div>
                            <?php endif; ?>
                            
                            <div>
                                <a href="../details-trajet.php?id=<?= $reservation_data['trajet_id'] ?>" 
                                   class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                    Voir les détails du trajet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    <!-- Option 2: Liste des réservations pour un trajet -->
    <?php elseif (isset($trajet_id) && isset($is_conductor) && $is_conductor): ?>
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="bg-blue-600 text-white p-4">
                <h1 class="text-xl font-bold">Réservations pour le trajet : <?= $trajet->ville_depart ?> → <?= $trajet->ville_arrivee ?></h1>
                <p>Date de départ : <?= date('d/m/Y', strtotime($trajet->date_depart)) ?> à <?= date('H:i', strtotime($trajet->heure_depart)) ?></p>
            </div>
            
            <div class="p-6">
                <?php if (empty($reservations)): ?>
                    <p class="text-gray-600">Aucune réservation pour ce trajet pour le moment.</p>
                <?php else: ?>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="bg-gray-100 border-b">
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passager</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Places</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <?php foreach ($reservations as $res): 
                                    $statusClass = match($res['statut']) {
                                        'confirmé' => 'bg-green-100 text-green-800',
                                        'en attente' => 'bg-yellow-100 text-yellow-800',
                                        'annulé' => 'bg-red-100 text-red-800',
                                        'refusé' => 'bg-gray-100 text-gray-800',
                                        default => 'bg-gray-100 text-gray-800'
                                    };
                                ?>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= $res['passager_nom'] ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= $res['nombre_places_reservees'] ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= number_format($res['montant_total'], 2) ?> €</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full <?= $statusClass ?>">
                                            <?= ucfirst($res['statut']) ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= date('d/m/Y', strtotime($res['date_reservation'])) ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <a href="?reservation_id=<?= $res['reservation_id'] ?>" class="text-blue-600 hover:text-blue-900 mr-3">Détails</a>
                                        
                                        <?php if ($res['statut'] === 'en attente'): ?>
                                            <a href="?action=confirmer&id=<?= $res['reservation_id'] ?>" class="text-green-600 hover:text-green-900 mr-3">Confirmer</a>
                                            <a href="?action=refuser&id=<?= $res['reservation_id'] ?>" class="text-red-600 hover:text-red-900">Refuser</a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    
    <!-- Option 3: Liste des réservations de l'utilisateur -->
    <?php else: ?>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="bg-blue-600 text-white p-4">
                <h1 class="text-xl font-bold">Mes réservations</h1>
            </div>
            
            <div class="p-6">
                <?php if (empty($reservations)): ?>
                    <p class="text-gray-600">Vous n'avez pas encore de réservation.</p>
                    <div class="mt-4">
                        <a href="../trajets-disponibles.php" class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded inline-block">
                            Rechercher un trajet
                        </a>
                    </div>
                <?php else: ?>
                    <div class="overflow-x-auto">
                        <table class="min-w-full bg-white">
                            <thead>
                                <tr class="bg-gray-100 border-b">
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trajet</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Places</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <?php foreach ($reservations as $res): 
                                    $statusClass = match($res['statut']) {
                                        'confirmé' => 'bg-green-100 text-green-800',
                                        'en attente' => 'bg-yellow-100 text-yellow-800',
                                        'annulé' => 'bg-red-100 text-red-800',
                                        'refusé' => 'bg-gray-100 text-gray-800',
                                        default => 'bg-gray-100 text-gray-800'
                                    };
                                    
                                    $is_past = strtotime($res['date_depart']) < time();
                                ?>
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <?= htmlspecialchars($res['ville_depart']) ?> → <?= htmlspecialchars($res['ville_arrivee']) ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <?= date('d/m/Y H:i', strtotime($res['date_depart'] . ' ' . $res['heure_depart'])) ?>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= $res['nombre_places_reservees'] ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap"><?= number_format($res['montant_total'], 2) ?> €</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs rounded-full <?= $statusClass ?>">
                                            <?= ucfirst($res['statut']) ?>
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <a href="?reservation_id=<?= $res['reservation_id'] ?>" class="text-blue-600 hover:text-blue-900 mr-3">Détails</a>
                                        
                                        <?php if (!$is_past && $res['statut'] === 'en attente'): ?>
                                            <a href="?action=annuler&id=<?= $res['reservation_id'] ?>" 
                                               onclick="return confirm('Êtes-vous sûr de vouloir annuler cette réservation ?');"
                                               class="text-red-600 hover:text-red-900">Annuler</a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php include_once '../../includes/footer.php'; ?>