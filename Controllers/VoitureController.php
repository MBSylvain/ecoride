<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

session_start();
include_once '../config/Database.php';
include_once '../models/Voiture.php';

// Initialize database connection
$database = new Database();
$db = $database->connect();
if (!$db) {
    http_response_code(500);
    echo json_encode(array('message' => 'Erreur de connexion à la base de données'));
    exit;
}

$voiture = new Voiture($db);

$method = $_SERVER['REQUEST_METHOD'];
// Récupération de l'id de l'utilisateur connecté
$utilisateur_id = $_SESSION['utilisateur_id'] ?? null;
// Récupération des données selon la méthode
if ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'PUT') {
    $method = strtoupper($_POST['action']);
}

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $voiture->voiture_id = $_GET['id'];
            if ($voiture->read_single()) {
                $voiture_arr = array(
                    'voiture_id' => $voiture->voiture_id,
                    'modele' => $voiture->modele,
                    'immatriculation' => $voiture->immatriculation,
                    'energie' => $voiture->energie,
                    'couleur' => $voiture->couleur,
                    'date_premiere_immatriculation' => $voiture->date_premiere_immatriculation,
                    'nombre_places' => $voiture->nombre_places,
                    'photo_url' => $voiture->photo_url,
                    'description' => $voiture->description,
                );
                echo json_encode($voiture_arr);
            } else {
                http_response_code(404);
                echo json_encode(array('message' => 'Voiture non trouvée'));
            }
        } else {
            $result = $voiture->read();
            if ($result) {
                $num = $result->rowCount();
                if ($num > 0) {
                    $voitures_arr = array();
                    $voitures_arr['data'] = array();

                    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                        $voiture_item = array(
                            'voiture_id' => $row['voiture_id'],
                            'modele' => $row['modele'],
                            'immatriculation' => $row['immatriculation'],
                            'energie' => $row['energie'],
                            'couleur' => $row['couleur'],
                            'date_premiere_immatriculation' => $row['date_premiere_immatriculation'],
                            'nombre_places' => $row['nombre_places'],
                            'photo_url' => $row['photo_url'],
                            'description' => $row['description']
                        );
                        array_push($voitures_arr['data'], $voiture_item);
                    }
                    echo json_encode($voitures_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array('message' => 'Aucune voiture trouvée'));
                }
            } else {
                http_response_code(500);
                echo json_encode(array('message' => 'Erreur lors de la récupération des voitures'));
            }
        }
        break;

    case 'POST':
        $data = (object)$_POST;
        
        // Validate required fields
        $required = ['modele', 'immatriculation', 'energie', 'date_premiere_immatriculation', 'nombre_places'];
        foreach ($required as $field) {
            if (empty($data->$field)) {
                http_response_code(400);
                echo json_encode(array('message' => 'Le champ ' . $field . ' est requis'));
                exit;
            }
        }

        // Assign all values
        $voiture->marque = $data->marque ?? null;
        $voiture->modele = $data->modele;
        $voiture->immatriculation = $data->immatriculation;
        $voiture->energie = $data->energie;
        $voiture->couleur = $data->couleur ?? null;
        $voiture->date_premiere_immatriculation = $data->date_premiere_immatriculation;
        $voiture->nombre_places = $data->nombre_places;
        $voiture->photo_url = $data->photo_url ?? null;
        $voiture->description = $data->description ?? null;
        $voiture->utilisateur_id = $utilisateur_id;

        // Create the car and handle the relationship
        if ($voiture->create()) {
            // If a specific marque_id was provided (from the marque table)
            if (isset($data->marque_id) && !empty($data->marque_id)) {
                $voiture->associateWithMarque($data->marque_id);
            }
            
            // If this is the user's primary car
            if (isset($data->is_primary) && $data->is_primary) {
                $utilisateur = new Utilisateur($db);
                $utilisateur->utilisateur_id = $utilisateur_id;
                $utilisateur->assignVoiture($voiture->voiture_id, true);
            }
            
            http_response_code(201);
            echo json_encode(['message' => 'Voiture créée avec succès', 'voiture_id' => $voiture->voiture_id]);
            header('location:../vues/dashboard.php');
        } else {
            http_response_code(500);
            echo json_encode(array('message' => 'Échec de la création'));
            header('location:../vues/dashboard.php');
        }
        break;
        
    
    case 'PUT':
        //$data = json_decode(file_get_contents("php://input"));
        $data = (object)$_POST;

        //var_dump($data);
        if (!$data) {
            http_response_code(400);
            echo json_encode(array('message' => 'Données invalides'));
            break;
        }

        $voiture->voiture_id = $data->voiture_id ?? null;
        $voiture->modele = $data->modele ?? null;
        $voiture->immatriculation = $data->immatriculation ?? null;
        $voiture->energie = $data->energie ?? null;
        $voiture->couleur = $data->couleur ?? null;
        $voiture->date_premiere_immatriculation = $data->date_premiere_immatriculation ?? null;
        $voiture->nombre_places = $data->nombre_places ?? null;
        $voiture->photo_url = $data->photo_url  ?? null;
        $voiture->description = $data->description ?? null;
        $voiture->utilisateur_id = $utilisateur_id ?? null;

        if ($voiture->update()) {
            echo json_encode(array('message' => 'Voiture mise à jour'));
            header('location:../vues/dashboard.php');
        } else {
            http_response_code(500);
            echo json_encode(array('message' => 'Échec de la mise à jour'));
            header('location:../vues/dashboard.php');

        }
    break;

    case 'DELETE':
    
    // Pour DELETE, on lit les données de la requête
    $data = (object)$_POST;
    $voiture_id = $_POST['voiture_id'] ?? null;
    // Vérification des données
    if (!isset($voiture_id)) {
        http_response_code(400);
        echo json_encode(['message' => 'ID de voiture manquant']);
        exit;
    }

    // Assignation de l'ID
    $voiture->voiture_id = $voiture_id;
    
    // Vérifier si la voiture existe
    if (!$voiture->read_single()) {
        http_response_code(404);
        echo json_encode(['message' => 'Voiture non trouvée']);
        exit;
    }

    // Tentative de suppression
    if ($voiture->delete()) {
        http_response_code(200);
        echo json_encode([
            'message' => 'Voiture supprimée avec succès',
            'deleted_id' => $voiture_id
        ]);
        header('location:../vues/dashboard.php');
    } else {
        http_response_code(500);
        echo json_encode([
            'message' => 'Échec de la suppression',
            'error' => $voiture->getLastError() // Vous devriez ajouter cette méthode à votre classe Voiture
        ]);
    }
    break;
}
?>