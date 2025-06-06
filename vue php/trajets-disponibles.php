<?php
// filepath: c:\xampp\htdocs\api\vues\trajets-disponibles.php
include_once '../includes/header.php';
include_once '../includes/navbar.php';
include_once '../config/Database.php';
include_once '../models/Trajet.php';
include_once '../models/Avis.php';
include_once '../models/Voiture.php';
include_once '../models/Utilisateur.php';
include_once '../models/Reservation.php';

// Initialisation de la base de données
$database = new Database();
$db = $database->connect();
$trajet = new Trajet($db);
$avis = new Avis($db);
$voiture = new Voiture($db);
$utlisateur= new Utilisateur($db);
//Début de la session
session_start();
// Récupération des filtres
$ville_depart = isset($_GET['ville_depart']) ? htmlspecialchars($_GET['ville_depart']) : '';
$ville_arrivee = isset($_GET['ville_arrivee']) ? htmlspecialchars($_GET['ville_arrivee']) : '';
$date_depart = isset($_GET['date_depart']) ? htmlspecialchars($_GET['date_depart']) : '';

// Récupération des trajets filtrés
$results =( $trajet->filtre_by_searchbar($ville_depart, $ville_arrivee, $date_depart));
//var_dump($results);

// 2. Vérifier si des résultats ont été trouvés
if (!empty($results)) {
    // Parcourir les résultats et utiliser chaque utilisateur_id pour read_single
    foreach ($results as $result) {
        // Extraire l'utilisateur_id
        $utilisateur_id = $result['utilisateur_id']; 
        
        // Créer une nouvelle instance d'Utilisateur pour éviter la confusion
        $utilisateurDetails = new Utilisateur($db);
        $utilisateurDetails->utilisateur_id = $utilisateur_id;
        
        // Appeler read_single pour obtenir les détails complets
        if ($utilisateurDetails->read_single()) {
            // Maintenant vous avez accès à tous les détails de l'utilisateur
            $details = $utilisateurDetails->read_single();
            // Afficher les détails de l'utilisateur
            //var_dump($details);
            
            

            echo "<hr>"; // Séparateur entre chaque utilisateur
        } else {
            echo "Impossible de récupérer les détails pour l'utilisateur ID: " . $utilisateur_id . "<br>";
        }
        //Appeler la méthode read_single  voiture
        $voiture_id = $result['voiture_id'];
        //Créer une nouvelle instance de Voiture
        $voitureDetails = new Voiture($db);
        $voitureDetails->voiture_id = $voiture_id;
        //Appeler la méthode read_single
        if ($voitureDetails->read_single()) {
            // Maintenant vous avez accès à tous les détails de la voiture
            $details = $voitureDetails->read_single();
            // Afficher les détails de la voiture
            var_dump($details);
           // Afficher les détails de la voiture
            


            echo "<hr>"; // Séparateur entre chaque voiture
        } else {
            echo "Impossible de récupérer les détails pour la voiture ID: " . $voiture_id . "<br>";
        }
        //Appeler la méthode read_single  avis
        $utilisateur_id = $result['utilisateur_id'];
        //Créer une nouvelle instance d'avis
        $avisDetails = new Avis($db);
        $avisDetails->utilisateur_id = $utilisateur_id;
        //Appeler la méthode read_single
        if ($avisDetails->read_by_conducteur()) {
            // Maintenant vous avez accès à tous les détails de l'avis
            $avis = $avisDetails->read_by_user();
            // Afficher les détails de l'avis
           // var_dump($avis);
            
            echo "<hr>";
        } else {
            echo "Impossible de récupérer les détails pour l'avis ID: " . $avis . "<br>";
        }
    }
} else {
    echo "Aucun résultat trouvé pour la recherche: $ville_depart - $ville_arrivee - $date_depart"; 
}



?>

<div class="bg-gray-100 min-h-screen py-8">
    <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold text-green-700 mb-8 text-center">Rechercher un trajet</h1>
        
        <!-- Formulaire de recherche -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <form action=" " method="GET"  class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="hidden" name="action" value="SEARCH" id="action">
                <div>
                    <label for="ville_depart" class="block text-gray-700 mb-2">Ville de départ</label>
                    <input type="text" id="ville_depart" name="ville_depart" value="<?= $ville_depart ?>" 
                           placeholder="Ex: Paris" 
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                
                <div>
                    <label for="ville_arrivee" class="block text-gray-700 mb-2">Ville d'arrivée</label>
                    <input type="text" id="ville_arrivee" name="ville_arrivee" value="<?= $ville_arrivee ?>"
                           placeholder="Ex: Lyon"
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                
                <div>
                    <label for="date_depart" class="block text-gray-700 mb-2">Date de départ</label>
                    <input type="date" id="date_depart" name="date_depart" value="<?= $date_depart ?>"
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                </div>
                
                <div class="flex items-end">
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                        <i class="fas fa-search mr-2"></i> Rechercher
                    </button>
                </div>
            </form>
        </div>
        
        <!-- Résultats de recherche -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php if (!empty($results)): ?>
                <?php foreach ($results as $trajet_item): ?>                
                    <?php 
                    // Récupération des informations du conducteur
                    $utilisateur_id = $trajet_item['utilisateur_id'];
                    $utlisateur = new Utilisateur($db);
                    $utlisateur->utilisateur_id = $utilisateur_id;
                    //$utlisateur->read_single();
                    $conducteur = $utlisateur->read_single();                                      
                    
                    // Calcul de la note moyenne du conducteur
                    $query = "SELECT AVG(note) as moyenne FROM avis WHERE destinataire_id = ?";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$utilisateur_id]);
                    $note = $stmt->fetch(PDO::FETCH_ASSOC);
                    $note_moyenne = $note['moyenne'] ? round($note['moyenne'], 1) : 'N/A';
                    
                    // Vérification si le trajet est écologique
                    
                    $voiture_info = $details;
                    //var_dump($voiture_info);
                    $est_ecologique = in_array(strtolower($voiture_info['energie'] ?? ''), ['electrique', 'hybride']);
                    
                    // Calcul des places restantes
                    $places_totales = $trajet_item['nombre_places'];
                    $query = "SELECT SUM(nombre_places_reservees) as places_reservees FROM reservations WHERE trajet_id = ? AND statut != 'annulé'";
                    $stmt = $db->prepare($query);
                    $stmt->execute([$trajet_item['trajet_id']]);
                    $reservations = $stmt->fetch(PDO::FETCH_ASSOC);
                    $places_reservees = $reservations['places_reservees'] ?: 0;
                    $places_restantes = $places_totales - $places_reservees;
                    
                    // Formatage de l'heure
                    $heure_depart = date('H:i', strtotime($trajet_item['heure_depart']));
                    $heure_arrivee = !empty($trajet_item['heure_arrivee']) 
                                     ? date('H:i', strtotime($trajet_item['heure_arrivee'])) 
                                     : 'Non précisée';
                    ?>
                    
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:scale-102">
                        <div class="p-5">
                            <!-- En-tête avec info conducteur -->
                            <div class="flex items-center mb-4">
                                <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                                    <?php if (!empty($conducteur['photo'])): ?>
                                        <img src="<?= htmlspecialchars($conducteur['photo']) ?>" alt="Photo de profil" class="w-full h-full object-cover">
                                    <?php else: ?>
                                        <div class="w-full h-full flex items-center justify-center bg-green-100 text-green-700">
                                            <i class="fas fa-user text-xl"></i>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div>
                                    <h3 class="font-bold"><?= htmlspecialchars($conducteur['pseudo'] ?? ($details['prenom'] . ' ' . substr($conducteur['nom'], 0, 1) . '.')) ?></h3>
                                    <div class="flex items-center">
                                        <div class="flex text-yellow-400 mr-1">
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
                                </div>
                            </div>
                            
                            <!-- Trajet -->
                            <div class="mb-4">
                                <div class="flex items-center mb-2">
                                    <div class="w-8 text-center">
                                        <i class="fas fa-map-marker-alt text-green-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-medium"><?= htmlspecialchars($trajet_item['ville_depart']) ?></h4>
                                        <p class="text-sm text-gray-500">
                                            <?= date('d/m/Y', strtotime($trajet_item['date_depart'])) ?> à <?= $heure_depart ?>
                                        </p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center">
                                    <div class="w-8 text-center">
                                        <i class="fas fa-map-marker-alt text-red-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-medium"><?= htmlspecialchars($trajet_item['ville_arrivee']) ?></h4>
                                        <p class="text-sm text-gray-500">
                                            <?php if (!empty($trajet_item['heure_arrivee'])): ?>
                                                Arrivée estimée à <?= $heure_arrivee ?>
                                            <?php endif; ?>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Prix et places -->
                            <div class="flex justify-between items-center mb-4">
                                <div>
                                    <span class="font-bold text-xl text-green-700"><?= number_format($trajet_item['prix'], 2) ?> €</span>
                                    <span class="text-sm text-gray-500">/personne</span>
                                </div>
                                <div>
                                    <span class="<?= $places_restantes > 0 ? 'text-green-600' : 'text-red-600' ?> font-medium">
                                        <?= $places_restantes ?> place<?= $places_restantes > 1 ? 's' : '' ?> restante<?= $places_restantes > 1 ? 's' : '' ?>
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Badges et bouton -->
                            <div class="flex justify-between items-center">
                                <div class="flex space-x-2">
                                    <?php if ($est_ecologique): ?>
                                        <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            <i class="fas fa-leaf mr-1"></i> Écologique
                                        </span>
                                    <?php endif; ?>
                                    
                                    <?php if ($trajet_item['bagages_autorises']): ?>
                                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            <i class="fas fa-suitcase mr-1"></i> Bagages
                                        </span>
                                    <?php endif; ?>
                                </div>
                                
                               <button id="btn" onclick="detailshow()" class="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition duration-200"> 
                                Détails
                                
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Aucun trajet ne correspond à votre recherche</h3>
                    <p class="text-gray-500 max-w-md mx-auto">
                        Essayez de modifier vos critères de recherche ou consultez les trajets à venir.
                    </p>
                </div>
            <?php endif; ?>
        </div>
    </div>
<script>
    // Afficher le détail
    function detailshow() {
        const detailElement = document.getElementById('detail');
        if (detailElement) {
            detailElement.classList.remove('hidden');
        }
    }

    // Fermer le détail
    function closeDetail() {
        const detailElement = document.getElementById('detail');
        if (detailElement) {
            detailElement.classList.add('hidden');
        }
    }

    // Basculer l'état visible/caché
    function toggleDetail() {
        const detailElement = document.getElementById('detail');
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

        <div id="detail" class="hidden fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
            <h2 class="text-xl font-bold mb-4">Détails du trajet</h2>
            <div id="detail-content">
            <div class="space-y-6">
                <!-- Informations du conducteur -->
                <div class="border-b pb-4">
                    <h3 class="font-bold text-lg text-green-700 mb-2">Conducteur</h3>
                    <div class="flex items-center">
                        <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                            <?php if (!empty($conducteur['photo'])): ?>
                                <img src="<?= htmlspecialchars($conducteur['photo']) ?>" alt="Photo de profil" class="w-full h-full object-cover">
                            <?php else: ?>
                                <div class="w-full h-full flex items-center justify-center bg-green-100 text-green-700">
                                    <i class="fas fa-user text-xl"></i>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div>
                            <p class="font-medium text-lg"><?= htmlspecialchars($conducteur['pseudo'] ?? ($conducteur['prenom'] . ' ' . substr($conducteur['nom'], 0, 1) . '.')) ?></p>
                            <div class="flex items-center">
                                <div class="flex text-yellow-400 mr-1">
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
                <div class="border-b pb-4">
                    <h3 class="font-bold text-lg text-green-700 mb-2">Détails du trajet</h3>
                    <div class="space-y-3">
                        <div class="flex">
                            <div class="w-8 text-center">
                                <i class="fas fa-map-marker-alt text-green-600"></i>
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
                                <i class="fas fa-map-marker-alt text-red-600"></i>
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
                <div class="border-b pb-4">
                    <h3 class="font-bold text-lg text-green-700 mb-2">Véhicule</h3>
                    <p class="text-sm text-gray-600"><?= htmlspecialchars($voiture_info['marque']?? 'Non précisée') ?></p>
                    <p class="text-sm text-gray-600"><?= htmlspecialchars($voiture_info['modele']?? 'Non précisée') ?></p>
                    <p class="text-sm text-gray-600">Couleur: <?= htmlspecialchars($voiture_info['couleur'] ?? 'Non précisée') ?></p>
                    <p class="text-sm text-gray-600">Énergie: <?= htmlspecialchars($voiture_info['energie'] ?? 'Non précisée') ?></p>
                </div>
                
                <!-- Options et préférences -->
                <div class="border-b pb-4">
                    <h3 class="font-bold text-lg text-green-700 mb-2">Préférences</h3>
                    <div class="flex flex-wrap gap-2">
                        <?php if ($est_ecologique): ?>
                            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                <i class="fas fa-leaf mr-1"></i> Véhicule écologique
                            </span>
                        <?php endif; ?>
                        
                        <?php if ($trajet_item['bagages_autorises']): ?>
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                <i class="fas fa-suitcase mr-1"></i> Bagages autorisés
                            </span>
                        <?php endif; ?>
                        
                        <?php if (isset($trajet_item['animaux_autorises']) && $trajet_item['animaux_autorises']): ?>
                            <span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                <i class="fas fa-paw mr-1"></i> Animaux autorisés
                            </span>
                        <?php endif; ?>
                        
                        <?php if (isset($trajet_item['fumeur_autorise']) && $trajet_item['fumeur_autorise']): ?>
                            <span class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                <i class="fas fa-smoking mr-1"></i> Fumeur autorisé
                            </span>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex justify-between">
                    <a href="contact.php?id=<?= $utilisateur_id ?>" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <i class="fas fa-comment-alt mr-1"></i> Contacter
                    </a>
                    <a href="reserver.php?trajet_id=<?= $trajet_item['trajet_id'] ?>" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        <i class="fas fa-check mr-1"></i> Réserver
                    </a>
                </div>
            </div>
            </div>
            <button id="close-detail" class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Fermer</button>
        </div>
</div>
</div>


<?php include_once '../includes/footer.php'; ?>