import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserModal from "../features/EditUserModal";
import EditVehicleModal from "../features/EditVehicleModal";
import EditTrajetModal from "../features/EditTrajetModal";
import CreateTrajetModal from "../features/CreateTrajetModal";
import checkAuth from "../features/checkAuth";


const Dashboard = () => {
  const utilisateur_email = localStorage.getItem("user.email") || localStorage.getItem("email");
  const utilisateur_id = localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id");

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [carToEdit, setCarToEdit] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripToEdit, setTripToEdit] = useState(null);
  // Etat modale userEditmodale
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // Etat modale EditvehiculeModal
  const [isEditVehicleModalOpen, setIsEditVehicleModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  // Etat modale EdittrajetModal
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  // Etat modale createTrajetModal
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [selectedCreateTrip, setSelectedCreateTrip] = useState(null);

  //Etat modale userEditmodale
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  // Données utilisateur
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Données voitures
  const [voitures, setVoitures] = useState([]);
  const [voituresLoading, setVoituresLoading] = useState(true);

  // Données trajets
  const [trajets, setTrajets] = useState([]);
  const [trajetsLoading, setTrajetsLoading] = useState(true);

  // Données réservations
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);

  // Données avis reçus
  const [avisRecus, setAvisRecus] = useState([]);
  const [avisRecusLoading, setAvisRecusLoading] = useState(true);

  // Données avis donnés
  const [avisDonnes, setAvisDonnes] = useState([]);
  const [avisDonnesLoading, setAvisDonnesLoading] = useState(true);

  


  // Fonction générique pour les appels API
  const fetchData = async (url, setData, setLoading) => {
    setLoading(true);
    try {
      const response = await axios.get(url, { withCredentials: true }, {responseType: 'json' });
      setData(Array.isArray(response.data) ? response.data : response.data || []);
    } catch (error) {
      console.error(`Erreur lors de la récupération des données depuis ${url}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=${utilisateur_id}`,
      
      setUser,
      setUserLoading
    );
  }, [utilisateur_id]);

  // Charger les voitures de l'utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/VoitureController.php?utilisateur_id=${utilisateur_id}`,
      setVoitures,
      setVoituresLoading
    );
  }, [utilisateur_id]);

  // Charger les trajets de l'utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`,
      setTrajets,
      setTrajetsLoading
    );
  }, [utilisateur_id]);

  // Charger les réservations de l'utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/ReservationController.php?utilisateur_id=${utilisateur_id}`,
      setReservations,
      setReservationsLoading
    );
  }, [utilisateur_id]);

  // Charger les avis reçus par l'utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/AvisController.php?destinataire_id=${utilisateur_id}`,
      setAvisRecus,
      setAvisRecusLoading
    );
  }, [utilisateur_id]);

  // Charger les avis donnés par l'utilisateur
  useEffect(() => {
    fetchData(
      `http://localhost/api/Controllers/AvisController.php?auteur_id=${utilisateur_id}`,
      setAvisDonnes,
      setAvisDonnesLoading
    );
  }, [utilisateur_id]);

  // Helpers
  const roleClass = (role) => {
    switch (role) {
      case "Administrateur":
        return "bg-primary-100 text-white";
      case "Employer":
        return "bg-customGreen2-100 text-white";
      case "Conducteur":
        return "bg-customGreen-100 text-white";
      case "Passager":
        return "bg-customGrey-100 text-primary-100";
      default:
        return "bg-customGrey-100 text-primary-100";
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
            <p>Chargement des informations...</p>
          ) : user ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-customGrey-100">Nom:</p>
            <p className="font-medium text-primary-100">{user.nom}</p>
          </div>
          <div>
            <p className="text-customGrey-100">Prénom:</p>
            <p className="font-medium text-primary-100">{user.prenom}</p>
          </div>
          <div>
            <p className="text-customGrey-100">Email:</p>
            <p className="font-medium text-primary-100">{user.email}</p>
          </div>
          <div>
            <p className="text-customGrey-100">Téléphone:</p>
            <p className="font-medium text-primary-100">{user.telephone || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-customGrey-100">Adresse:</p>
            <p className="font-medium text-primary-100">{user.adresse || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-customGrey-100">Date inscription:</p>
            <p className="font-medium text-primary-100">{user.date_inscription || "Non renseigné"}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => handleEditUser(true)}
              className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100"
            >
              Modifier mes informations
            </button>
          </div>
            </div>
          ) : (
            <p>Aucune information disponible.</p>
          )}
        </div>

        {/* Modal modification utilisateur */}
         <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onUserUpdated={(updatedUser) => {
          console.log('Utilisateur mis à jour :', updatedUser);
          setIsEditModalOpen(false);
        }}
      />

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
                      <button onClick={() => { setSelectedCar(voit); setIsEditVehicleModalOpen(true); }} className="mr-2 text-customGreen2-100 hover:text-customGreen2-80">Modifier</button>
                     <Link to={`../UpdateVehicleForm/${voit.voiture_id}`} className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100">Modifier</Link>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
             <button onClick={() => { setSelectedCar(); setIsEditVehicleModalOpen(true); }} className="mr-2 text-customGreen2-100 hover:text-customGreen2-80">Ajouter bouton</button>

              <Link to="/pages/dashcarupdate" className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100">Ajouter une voiture</Link>
            </div>
          </div>
        ) : (
          <>
            <p>Vous n'avez pas encore ajouté de voiture.</p>
            <div className="flex flex-row mt-4">
             <button onClick={() => { setSelectedCar(); setIsEditVehicleModalOpen(true); }} className="mr-2 text-customGreen2-100 hover:text-customGreen2-80">Ajouter bouton</button>

              <Link to="/pages/" className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100">Ajouter une voiture </Link>
            </div>
          </>
        )}
      </div>
      {/* Modal modification voiture */}
      {/* Utilisation du composant EditVehicleModal */}
            <EditVehicleModal
              isOpen={isEditVehicleModalOpen}
              onClose={() => setIsEditVehicleModalOpen(false)}
              voiture={carToEdit}
              onVoitureUpdated={() => {
                setIsEditVehicleModalOpen(false);
                // Optionnel: rafraîchir la liste des voitures ici si besoin
                }}
              />

            {/* Bouton pour ouvrir la modale d'ajout de trajet */}
            <div className="mb-4">
            <button
              onClick={() => {
              setTripToEdit(null);
              setShowTripModal(true);
              }}
              className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100"
            >
              Ajouter un trajet
            </button>
            </div>

            {/* Section 3: Trajets */}
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-primary-100">Mes trajets récents</h2>
            {Array.isArray(trajets) && trajets.length > 0 ? (
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
                    <td className="flex gap-2 px-4 py-3">
                      <button
                      onClick={() => {
                        setTripToEdit(trajet);
                        setShowTripModal(true);
                        }}
                        className="px-3 py-1 text-white rounded bg-primary-100 hover:bg-primary-80"
                      >
                        Détails
                      </button>
                                         <Link
                      to={`/VisualiserTrajet/${trajet.trajet_id}`}
                      className="mr-2 text-customGreen-100 hover:text-customGreen2-100"
                    >
                      Réservations
                    </Link>
                      <button
                        onClick={async () => {
                        if (window.confirm("Voulez-vous vraiment annuler ce trajet ?")) {
                        try {
                          await axios.delete(
                          `http://localhost/api/Controllers/TrajetController.php`,
                          {
                            data: { trajet_id: trajet.trajet_id },
                            action: "delete",
                            withCredentials: true,
                            headers: { "Content-Type": "application/json" }
                          }
                          );
                          // Rafraîchir la liste des trajets après suppression
                          fetchData(
                          `http://localhost/api/Controllers/TrajetController.php?utilisateur_id=${utilisateur_id}`,
                          setTrajets,
                          setTrajetsLoading
                          );
                        } catch (error) {
                          alert("Erreur lors de l'annulation du trajet.");
                        }
                        }
                      }}
                      className="px-3 py-1 text-white rounded bg-customPink-100 hover:bg-customPink-80"
                      >
                      Annuler
                      </button>
                    </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Vous n'avez pas encore proposé de trajet.</p>
            )}
            </div>
            {/* Modal modification trajet */}
      <EditTrajetModal
        isOpen={showTripModal}
        onClose={() => setShowTripModal(false)}
        trajet={tripToEdit}
        onTrajetUpdated={() => {
          setShowTripModal(false);
          // Optionnel: rafraîchir la liste des trajets ici si besoin
        }}
      />

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
              <Link to="/trajets" className="px-4 py-2 text-white rounded bg-customGreen-100 hover:bg-customGreen2-100">
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