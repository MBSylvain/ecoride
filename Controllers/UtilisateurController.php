<?php
// En-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Démarrer la session
session_start();

// Gestion des requêtes OPTIONS (CORS pré-vol)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclusions
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Utilisateur.php';

// Initialisation de la base de données
$database = new Database();
$db = $database->connect();
$utilisateur = new Utilisateur($db);

// Récupération de la méthode HTTP et des données
$method = $_SERVER['REQUEST_METHOD'];

// Fonction utilitaire pour nettoyer les entrées
function sanitize($input)
{
    return htmlspecialchars(strip_tags(trim($input)));
}

// Routeur principal
switch ($method) {
    case 'GET':
        // Vérification authentification
        if (!isset($_SESSION['utilisateur_id'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Non authentifié']);
            exit;
        }

        // Lecture par email
        if (isset($_GET['email'])) {
            $utilisateur->email = sanitize($_GET['email']);
            if ($utilisateur->read_by_email()) {
                $response = [
                    'utilisateur_id' => $utilisateur->utilisateur_id,
                    'nom' => $utilisateur->nom,
                    'prenom' => $utilisateur->prenom,
                    'email' => $utilisateur->email,
                    'telephone' => $utilisateur->telephone,
                    'adresse' => $utilisateur->adresse,
                    'date_naissance' => $utilisateur->date_naissance,
                    'pseudo' => $utilisateur->pseudo
                ];
                echo json_encode($response);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Utilisateur non trouvé']);
            }
        } else {
            // Lecture de tous les utilisateurs
            $result = $utilisateur->read();
            if (is_array($result) && count($result) > 0) {
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Aucun utilisateur trouvé']);
            }
        }
        break;

    case 'POST':
        // Récupération des données JSON ou POST selon le format
        $data = null;
        if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
            // Format JSON
            $data = json_decode(file_get_contents("php://input"));
        } else {
            // Format POST standard
            $data = (object)$_POST;
        }

        // Vérifier l'action pour différencier connexion et inscription
        if (isset($data->action) && $data->action === 'register') {
            // Traitement de l'inscription
            if (empty($data->nom) || empty($data->mot_de_passe)) {
                http_response_code(400);
                echo json_encode(['message' => 'Nom et mot de passe sont requis']);
                exit;
            }

            if (empty($data->email)) {
                http_response_code(400);
                echo json_encode(['message' => 'Email est requis']);
                exit;
            }

            // Vérifier que les mots de passe correspondent
            if ($data->mot_de_passe !== $data->confirm_password) {
                http_response_code(400);
                echo json_encode(['message' => 'Les mots de passe ne correspondent pas']);
                exit;
            }

            $utilisateur->nom = sanitize($data->nom);
            $utilisateur->prenom = sanitize($data->prenom);
            $utilisateur->email = sanitize($data->email);
            $utilisateur->password = $data->mot_de_passe; // Le hash est fait dans create()
            $utilisateur->telephone = !empty($data->telephone) ? sanitize($data->telephone) : null;
            $utilisateur->adresse = !empty($data->adresse) ? sanitize($data->adresse) : null;
            $utilisateur->date_naissance = !empty($data->date_naissance) ? sanitize($data->date_naissance) : null;
            $utilisateur->pseudo = !empty($data->pseudo) ? sanitize($data->pseudo) : null;
            $utilisateur->role = sanitize($data->role);

            if ($utilisateur->create()) {
                // Rediriger vers la page de connexion après inscription réussie
                header('Location: ../vues/connexion.php?success=1');
                exit;
            } else {
                $error = "Échec de la création du compte.";
                header('Location: ../vues/enregistrement.php?error=' . urlencode($error));
                exit;
            }
        } else if (isset($data->email) && isset($data->password)) {
            // Tentative de connexion
            $utilisateur->email = sanitize($data->email);
            $utilisateur->password = $data->password; // Ne pas sanitizer le mot de passe

            if ($utilisateur->login()) {
                // Rediriger vers le tableau de bord après connexion réussie
                header('Location: ../vues/DashboardVue/dashboard.php');
                exit;
            } else {
                $error = "Email ou mot de passe incorrect";
                header('Location: ../vues/connexion.php?error=' . urlencode($error));
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Données requises manquantes']);
            exit;
        }
        break;

    case 'PUT':
        // Vérification authentification
        if (!isset($_SESSION['utilisateur_id'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Non authentifié']);
            exit;
        }

        // Récupération propre des données PUT
        parse_str(file_get_contents("php://input"), $putData);
        $data = (object)$putData;

        // Debug (à enlever en production)
        error_log("Données reçues: " . print_r($data, true));

        // Validation des données obligatoires
        if (empty($data->nom) || empty($data->email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Nom et email sont requis']);
            exit;
        }

        // Assignation des valeurs
        $utilisateur->utilisateur_id = $_SESSION['utilisateur_id'];
        $utilisateur->nom = sanitize($data->nom);
        $utilisateur->prenom = isset($data->prenom) ? sanitize($data->prenom) : null;
        $utilisateur->email = sanitize($data->email);
        $utilisateur->telephone = isset($data->telephone) ? sanitize($data->telephone) : null;
        $utilisateur->adresse = isset($data->adresse) ? sanitize($data->adresse) : null;
        $utilisateur->date_naissance = isset($data->date_naissance) ? sanitize($data->date_naissance) : null;
        $utilisateur->pseudo = isset($data->pseudo) ? sanitize($data->pseudo) : null;

        // Gestion spécifique du mot de passe
        if (!empty($data->password)) {
            $utilisateur->password = $data->password; // Le hash est géré dans la méthode update()
        }

        // Exécution de la mise à jour
        if ($utilisateur->update()) {
            // Réponse JSON uniquement (pas de redirection ici)
            echo json_encode([
                'success' => true,
                'message' => 'Utilisateur mis à jour',
                'utilisateur_id' => $utilisateur->utilisateur_id
            ]);
            header('Location: /../vues/dashboard.php');
            exit;
        } else {
            // Récupération des erreurs SQL pour le debug
            $errorInfo = $utilisateur->getDb()->errorInfo();
            error_log("Erreur SQL: " . print_r($errorInfo, true));

            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Échec de la mise à jour',
                'error' => $errorInfo[2] ?? 'Erreur inconnue'
            ]);
        }
        break;


    case 'DELETE':
        // Suppression
        if (!isset($_SESSION['utilisateur_id'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Non authentifié']);
            exit;
        }

        $utilisateur->utilisateur_id = $_SESSION['utilisateur_id'];

        if ($utilisateur->delete()) {
            session_destroy();
            echo json_encode(['message' => 'Utilisateur supprimé']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Échec de la suppression']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Méthode non autorisée']);
        break;
}
