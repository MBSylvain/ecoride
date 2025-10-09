import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Statistiques from "./Statistiques";

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [trajets, setTrajets] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Récupération et affichage des données administrateur
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, voituresRes, trajetsRes, reservationsRes, avisRes] = await Promise.all([
          axios.get("http://localhost/api/ControllersAdministrateur/UtilisateurAdminController.php", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }),
          axios.get("http://localhost/api/ControllersAdministrateur/VoitureAdminController.php", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }),
          axios.get("http://localhost/api/ControllersAdministrateur/TrajetAdminController.php", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }),
          axios.get("http://localhost/api/ControllersAdministrateur/ReservationAdminController.php", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }),
          axios.get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
          }),
        ]);
        setUsers(usersRes.data || usersRes.data.data || []);
        setVoitures(voituresRes.data.data || []);
        setTrajets(trajetsRes.data || []);
        console.log(trajetsRes.data.data);
        setReservations(reservationsRes.data || []);
        setAvis(avisRes.data.data || []);
      } catch (error) {
        setError("Erreur lors du chargement des données administrateur.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Activation d'un compte utilisateur
  const handleActivateUser = async (userId) => {
    try {
      await axios.post(
        "http://localhost/api/Controllers/UtilisateurController.php",
        { utilisateur_id: userId },
        { action: "activate" },
        { role: "Administrateur" },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setUsers(users => users.map(u => u.utilisateur_id === userId
        ? { ...u, actif: true }
        : u
      ));
    } catch (error) {
      alert("Erreur lors de l'activation du compte.");
    }
  };
  // Désactivation d'un compte utilisateur
  const handleDeactivateUser = async (userId) => {
    try {
      await axios.post(
        "http://localhost/api/Controllers/UtilisateurController.php",
        { utilisateur_id: userId },
        { action: "deactivate" },
        { role: "Administrateur" },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setUsers(users => users.map(u => u.utilisateur_id === userId
        ? { ...u, actif: false }
        : u
      ));
    } catch (error) {
      alert("Erreur lors de la désactivation du compte 120.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-customGreen-100">
        Tableau de Bord Administrateur
      </h1>
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Statistiques Clés</h2>
        <Statistiques />
      </section>

      <section>
        <h2>Utilisateurs</h2>
        {users.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Nom</th>
                <th className="px-2 py-1 border">Email</th>
                <th className="px-2 py-1 border">Role</th>
                <th className="px-2 py-1 border">Statut</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.utilisateur_id|| []}>
                  <td className="px-2 py-1 border">{user.nom}</td>
                  <td className="px-2 py-1 border">{user.email}</td>
                  <td className="px-2 py-1 border">{user.role}</td>
                  <td className="px-2 py-1 border">{user.compte_actif ? "Actif" : "Inactif"}</td>
                  <td className="flex gap-2 px-2 py-1 border">
                    <button
                      className="px-2 py-1 text-white bg-green-500 rounded disabled:opacity-50"
                      onClick={() => handleActivateUser(user.utilisateur_id)}
                      disabled={user.compte_actif}
                    >
                      Activer
                    </button>
                    <button
                      className="px-2 py-1 text-white bg-red-500 rounded disabled:opacity-50"
                      onClick={() => handleDeactivateUser(user.utilisateur_id)}
                      disabled={!user.compte_actif}
                    >
                      Désactiver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun utilisateur trouvé.</p>
        )}
      </section>

      <section>
        <h2>Voitures</h2>
        {voitures.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Modèle</th>
                <th className="px-2 py-1 border">Immatriculation</th>
                <th className="px-2 py-1 border">Énergie</th>
                <th className="px-2 py-1 border">Couleur</th>
                <th className="px-2 py-1 border">Places</th>
                <th className="px-2 py-1 border">Date 1ère immatriculation</th>
                <th className="px-2 py-1 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {voitures.map(voiture => (
                <tr key={voiture.voiture_id}>
                  <td className="px-2 py-1 border">{voiture.modele}</td>
                  <td className="px-2 py-1 border">{voiture.immatriculation}</td>
                  <td className="px-2 py-1 border">{voiture.energie}</td>
                  <td className="px-2 py-1 border">{voiture.couleur}</td>
                  <td className="px-2 py-1 border">{voiture.nombre_places}</td>
                  <td className="px-2 py-1 border">{voiture.date_premiere_immatriculation}</td>
                  <td className="px-2 py-1 border">{voiture.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
      ) : (
        <p>Aucune voiture trouvée.</p>
      )}
    </section>

      <section>
        <h2>Trajets</h2>
        {trajets.length > 0 ? (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">ID</th>
                <th className="px-2 py-1 border">Départ</th>
                <th className="px-2 py-1 border">Arrivée</th>
                <th className="px-2 py-1 border">Adresse départ</th>
                <th className="px-2 py-1 border">Adresse arrivée</th>
                <th className="px-2 py-1 border">Date départ</th>
                <th className="px-2 py-1 border">Heure départ</th>
                <th className="px-2 py-1 border">Heure arrivée</th>
                <th className="px-2 py-1 border">Places</th>
                <th className="px-2 py-1 border">Prix (€)</th>
                <th className="px-2 py-1 border">Description</th>
                <th className="px-2 py-1 border">Bagages</th>
                <th className="px-2 py-1 border">Fumeur</th>
                <th className="px-2 py-1 border">Animaux</th>
                <th className="px-2 py-1 border">Statut</th>
                <th className="px-2 py-1 border">Utilisateur</th>
                <th className="px-2 py-1 border">Voiture</th>
                <th className="px-2 py-1 border">Date création</th>
              </tr>
            </thead>
            <tbody>
              {trajets.map(trajet => (
                <tr key={trajet.trajet_id}>
                  <td className="px-2 py-1 border">{trajet.trajet_id}</td>
                  <td className="px-2 py-1 border">{trajet.ville_depart}</td>
                  <td className="px-2 py-1 border">{trajet.ville_arrivee}</td>
                  <td className="px-2 py-1 border">{trajet.adresse_depart}</td>
                  <td className="px-2 py-1 border">{trajet.adresse_arrivee}</td>
                  <td className="px-2 py-1 border">{trajet.date_depart}</td>
                  <td className="px-2 py-1 border">{trajet.heure_depart}</td>
                  <td className="px-2 py-1 border">{trajet.heure_arrivee || "-"}</td>
                  <td className="px-2 py-1 border">{trajet.nombre_places}</td>
                  <td className="px-2 py-1 border">{trajet.prix}</td>
                  <td className="px-2 py-1 border">{trajet.description || "-"}</td>
                  <td className="px-2 py-1 border">{trajet.bagages_autorises === "1" ? "Oui" : "Non"}</td>
                  <td className="px-2 py-1 border">{trajet.fumeur_autorise === "1" ? "Oui" : "Non"}</td>
                  <td className="px-2 py-1 border">{trajet.animaux_autorises === "1" ? "Oui" : "Non"}</td>
                  <td className="px-2 py-1 border">{trajet.statut}</td>
                  <td className="px-2 py-1 border">{trajet.utilisateur_id}</td>
                  <td className="px-2 py-1 border">{trajet.voiture_id || "-"}</td>
                  <td className="px-2 py-1 border">{trajet.date_creation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun trajet trouvé.</p>
        )}
      </section>

      <section>
        <h2>Réservations</h2>
        {reservations.length > 0 ? (
          <ul>
            {reservations.map(reservation => (
              <li key={reservation.id}>
                Utilisateur: {reservation.utilisateur_id}, Trajet: {reservation.trajet_id}, Statut: {reservation.statut}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune réservation trouvée.</p>
        )}
      </section>

      <section>
        <h2>Avis</h2>
        {avis.length > 0 ? (
          <ul>
            {avis.map(a => (
              <li key={a.id}>
                Utilisateur: {a.utilisateur_id}, Note: {a.note}, Commentaire: {a.commentaire}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun avis trouvé.</p>
        )}
      </section>
    </div>
  );

};

export default DashboardAdmin;