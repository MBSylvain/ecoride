import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Assurez-vous d'importer axios

// Simule la récupération de l'utilisateur connecté (à remplacer par ton auth context)
console.log(localStorage);
console.log(localStorage.getItem("user"));
console.log(localStorage.getItem("utilisateur_id"));
const Dashboard = () => {
const utilisateur_email = localStorage.getItem("user.email") || localStorage.getItem("email");
const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");
   // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripToEdit, setTripToEdit] = useState(null);

  // Charger les données du dashboard
  //Données utilisateur
  const [user, setUser] = useState(localStorage);
  const [userLoading, setUserLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${utilisateur_id}`
, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      },
        );
        
        setUser(response.data);

        console.log("Données utilisateur chargées:", response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur", error);
      } finally {
        setUserLoading(false);
      }
    };
    
    fetchUserData();
  }, [utilisateur_id]);
  //données voitures de l 'utilisateur
  const [voitures, setVoitures] = useState([]);
  const [voituresLoading, setVoituresLoading] = useState(true);
  
  useEffect(() => {
    const fetchVoitures = async () => {
      setVoituresLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`);
        setVoitures(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des voitures", error);
      } finally {
        setVoituresLoading(false);
      }
    };
    
    fetchVoitures();
  }, [utilisateur_id]);
  //données trajets de l'utilisateur
  const [trajets, setTrajets] = useState([]);
  const [trajetsLoading, setTrajetsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrajets = async () => {
      setTrajetsLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`);
        setTrajets(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des trajets", error);
      } finally {
        setTrajetsLoading(false);
      }
    };
    
    fetchTrajets();
  }, [utilisateur_id]);
  //données réservations de l'utilisateur
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  
  useEffect(() => {
    const fetchReservations = async () => {
      setReservationsLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`);
        setReservations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations", error);
      } finally {
        setReservationsLoading(false);
      }
    };
    
    fetchReservations();
  }, [utilisateur_id]);
  //données avis reçus de l'utilisateur
  const [avisRecus, setAvisRecus] = useState([]);
  const [avisRecusLoading, setAvisRecusLoading] = useState(true);
  
  useEffect(() => {
    const fetchAvisRecus = async () => {
      setAvisRecusLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/AvisController.php?destinataire_id=${utilisateur_id}`);
        setAvisRecus(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des avis reçus", error);
      } finally {
        setAvisRecusLoading(false);
      }
    };
    
    fetchAvisRecus();
  }, [utilisateur_id]);
  //données avis donnés par l'utilisateur
  const [avisDonnes, setAvisDonnes] = useState([]);
  const [avisDonnesLoading, setAvisDonnesLoading] = useState(true);
  
  useEffect(() => {
    const fetchAvisDonnes = async () => {
      setAvisDonnesLoading(true);
      try {
        const response = await axios.get(`http://localhost/api/Controllers/AvisController.php?auteur_id=${utilisateur_id}`);
        setAvisDonnes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des avis donnés", error);
      } finally {
        setAvisDonnesLoading(false);
      }
    };
    
    fetchAvisDonnes();
  }, [utilisateur_id]);


  // Helpers
  const roleClass = (role) => {
    switch (role) {
      case "Administrateur": return "bg-primary-100 text-white";
      case "Employer": return "bg-customGreen2-100 text-white";
      case "Conducteur": return "bg-customGreen-100 text-white";
      case "Passager": return "bg-customGrey-100 text-primary-100";
      default: return "bg-customGrey-100 text-primary-100";
    }
  };

  // --- RENDU ---
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">Mon Tableau de Bord</h1>

      {/* Section 1: Infos utilisateur */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes informations personnelles</h2>
        {userLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><p className="text-customGrey-80">Nom:</p><p className="font-medium text-primary-100">{user.nom}</p></div>
            <div><p className="text-customGrey-80">Prénom:</p><p className="font-medium text-primary-100">{user.prenom}</p></div>
            <div><p className="text-customGrey-80">Email:</p><p className="font-medium text-primary-100">{user.email}</p></div>
            <div><p className="text-customGrey-80">Téléphone:</p><p className="font-medium text-primary-100">{user.telephone || "Non renseigné"}</p></div>
            <div><p className="text-customGrey-80">Adresse:</p><p className="font-medium text-primary-100">{user.adresse || "Non renseigné"}</p></div>
            <div><p className="text-customGrey-80">Date inscription:</p><p className="font-medium text-primary-100">{user.date_inscription || "Non renseigné"}</p></div>
            <div className="mt-4">
              <button onClick={() => setShowUserModal(true)} className="px-4 py-2 text-white bg-customGreen-100 rounded hover:bg-customGreen2-100">
                Modifier mes informations
              </button>
            </div>
          </div>
        ) : <p>Aucune information disponible.</p>}
      </div>

      {/* Modal modification utilisateur */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-100 bg-opacity-75">
          <div className="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
            <h2 className="mb-4 text-xl font-semibold text-primary-100">Modifier mes informations</h2>
            {/* Ici, place ton formulaire de modification utilisateur */}
            <button onClick={() => setShowUserModal(false)} className="mt-4 text-customPink-100 hover:text-customPink-80">Annuler</button>
          </div>
        </div>
      )}

      {/* Section 2: Voitures */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes voitures</h2>
        {voitures.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b-2 border-customGrey-80">
                  <th className="px-4 py-3 text-left">Modèle</th>
                  <th className="px-4 py-3 text-left">Immatriculation</th>
                  <th className="px-4 py-3 text-left">Énergie</th>
                  <th className="px-4 py-3 text-left">Couleur</th>
                  <th className="px-4 py-3 text-left">Places</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {voitures.map((voit) => (
                  <tr key={voit.voiture_id} className="border-b hover:bg-customGrey-80">
                    <td className="px-4 py-3">{voit.modele}</td>
                    <td className="px-4 py-3">{voit.immatriculation}</td>
                    <td className="px-4 py-3">{voit.energie}</td>
                    <td className="px-4 py-3">{voit.couleur}</td>
                    <td className="px-4 py-3">{voit.nombre_places}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setCarToEdit(voit); setShowCarModal(true); }} className="mr-2 text-customGreen2-100 hover:text-customGreen2-80">Modifier</button>
                      {/* Ajoute ici la suppression si besoin */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Link to="/dashboard/voiture/ajouter" className="px-4 py-2 text-white bg-customGreen-100 rounded hover:bg-customGreen2-100">Ajouter une voiture</Link>
            </div>
          </div>
        ) : (
          <>
            <p>Vous n'avez pas encore ajouté de voiture.</p>
            <div className="mt-4">
              <Link to="/dashboard/voiture/ajouter" className="px-4 py-2 text-white bg-customGreen-100 rounded hover:bg-customGreen2-100">
                Ajouter une voiture
              </Link>
            </div>
          </>
        )}
      </div>
      {/* Modal modification voiture */}
      {showCarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-100 bg-opacity-75">
          <div className="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
            <h2 className="mb-4 text-xl font-semibold text-primary-100">Modifier ma voiture</h2>
            {/* Ici, place ton formulaire de modification voiture avec carToEdit */}
            <button onClick={() => setShowCarModal(false)} className="mt-4 text-customPink-100 hover:text-customPink-80">Annuler</button>
          </div>
        </div>
      )}

      {/* Section 3: Trajets */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes trajets récents</h2>
        {trajets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b-2 border-customGrey-80">
                  <th className="px-4 py-3 text-left">Départ</th>
                  <th className="px-4 py-3 text-left">Arrivée</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Prix</th>
                  <th className="px-4 py-3 text-left">Places</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trajets.map((trajet) => (
                  <tr key={trajet.trajet_id} className="border-b hover:bg-customGrey-80">
                    <td className="px-4 py-3">{trajet.ville_depart}</td>
                    <td className="px-4 py-3">{trajet.ville_arrivee}</td>
                    <td className="px-4 py-3">{trajet.date_depart}</td>
                    <td className="px-4 py-3">{trajet.prix} €</td>
                    <td className="px-4 py-3">{trajet.nombre_places}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setTripToEdit(trajet); setShowTripModal(true); }} className="px-3 py-1 text-white bg-primary-100 rounded hover:bg-primary-80">Détails</button>
                      <Link to={`/dashboard/reservations/${trajet.trajet_id}`} className="mr-2 text-customGreen-100 hover:text-customGreen2-100">Réservations</Link>
                      {/* Ajoute ici la suppression si besoin */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <Link to="/dashboard/trajet/ajouter" className="px-4 py-2 text-white bg-customGreen-100 rounded hover:bg-customGreen2-100">Proposer un trajet</Link>
            </div>
          </div>
        ) : (
          <p>Vous n'avez pas encore proposé de trajet.</p>
        )}
      </div>
      {/* Modal modification trajet */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-100 bg-opacity-75">
          <div className="w-3/4 p-6 overflow-y-auto bg-white rounded-lg shadow-lg h-3/4">
            <h2 className="mb-4 text-xl font-semibold text-primary-100">Modifier mon trajet</h2>
            {/* Ici, place ton formulaire de modification trajet avec tripToEdit */}
            <button onClick={() => setShowTripModal(false)} className="mt-4 text-customPink-100 hover:text-customPink-80">Annuler</button>
          </div>
        </div>
      )}

      {/* Section 4: Réservations */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes réservations</h2>
        {reservations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b-2 border-customGrey-80">
                  <th className="px-4 py-3 text-left">Trajet</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Places</th>
                  <th className="px-4 py-3 text-left">Montant</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.reservation_id} className="border-b hover:bg-customGrey-80">
                    <td className="px-4 py-3">{res.ville_depart} → {res.ville_arrivee}</td>
                    <td className="px-4 py-3">{res.date_depart}</td>
                    <td className="px-4 py-3">{res.nombre_places_reservees}</td>
                    <td className="px-4 py-3">{res.montant_total} €</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full ${
                        res.statut === "confirmé" ? "bg-customGreen-100 text-white" :
                        res.statut === "en attente" ? "bg-customGrey-100 text-primary-100" :
                        res.statut === "annulé" ? "bg-customPink-100 text-white" :
                        res.statut === "refusé" ? "bg-customGrey-100 text-primary-100" : "bg-customGrey-100 text-primary-100"
                      }`}>
                        {res.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {/* Ajoute ici les actions (détail, annuler, avis, etc.) */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <p>Vous n'avez pas encore effectué de réservation.</p>
            <div className="mt-4">
              <Link to="/trajets" className="px-4 py-2 text-white bg-customGreen-100 rounded hover:bg-customGreen2-100">
                Rechercher un trajet
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Section 5: Avis */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes avis</h2>
        <h3 className="mb-3 text-lg font-medium text-customGreen-100">Avis reçus</h3>
        {avisRecus.length > 0 ? (
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b-2 border-customGrey-80">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">De</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-left">Commentaire</th>
                </tr>
              </thead>
              <tbody>
                {avisRecus.map((avis) => (
                  <tr key={avis.avis_id} className="border-b hover:bg-customGrey-80">
                    <td className="px-4 py-3">{avis.date_creation}</td>
                    <td className="px-4 py-3">{avis.prenom || "Anonyme"}</td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`w-5 h-5 ${i <= avis.note ? "text-customGreen2-100" : "text-customGrey-80"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{avis.commentaire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="mb-6">Vous n'avez pas encore reçu d'avis.</p>}

        <h3 className="mb-3 text-lg font-medium text-customGreen-100">Avis donnés</h3>
        {avisDonnes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b-2 border-customGrey-80">
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Pour</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-left">Commentaire</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {avisDonnes.map((avis) => (
                  <tr key={avis.avis_id} className="border-b hover:bg-customGrey-80">
                    <td className="px-4 py-3">{avis.date_creation}</td>
                    <td className="px-4 py-3">{avis.prenom || "Inconnu"}</td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`w-5 h-5 ${i <= avis.note ? "text-customGreen2-100" : "text-customGrey-80"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{avis.commentaire}</td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard/avis/modifier/${avis.avis_id}`} className="mr-2 text-primary-100 hover:text-primary-80">Modifier</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>Vous n'avez pas encore donné d'avis.</p>}
      </div>

      {/* Section 6: Profil utilisateur */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Mon profil utilisateur</h2>
        {user ? (
          <>
            <div className="mb-4">
              <p className="text-customGrey-80">Rôle actuel:</p>
              <p className="font-medium">
                <span className={`px-3 py-1 rounded-full ${roleClass(user.role)}`}>
                  {user.role || "membre"}
                </span>
              </p>
            </div>
            <div className="mb-4">
              <p className="text-customGrey-80">Date d'inscription:</p>
              <p className="font-medium text-primary-100">{user.date_inscription ? new Date(user.date_inscription).toLocaleDateString("fr-FR") : "Non disponible"}</p>
            </div>
            <div className="mb-4">
              <p className="text-customGrey-80">Statut du compte:</p>
              <p className="font-medium">
                <span className={`px-3 py-1 rounded-full ${
                  user.compte_verifie ? "bg-customGreen-100 text-white" : "bg-customPink-100 text-white"
                }`}>
                  {user.compte_verifie ? "Vérifié" : "Non vérifié"}
                </span>
              </p>
            </div>
            {!user.compte_verifie && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-customGrey-80">Pour devenir conducteur, vous devez ajouter une voiture et vérifier votre compte.</p>
                <Link to="/dashboard/verifier-compte" className="text-primary-100 hover:text-primary-80">Vérifier mon compte</Link>
              </div>
            )}
          </>
        ) : <p>Informations sur le profil non disponibles.</p>}
      </div>
    </div>
  );
};

export default Dashboard;