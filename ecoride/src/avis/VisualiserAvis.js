import axios from 'axios';
import { useEffect, useState } from 'react';
import React from "react";

const getStatusColor = (statut) => {
  switch (statut) {
    case "confirmé":
      return "bg-green-500 text-white";
    case "en_attente":
      return "bg-yellow-400 text-black";
    case "annulée":
      return "bg-red-500 text-white";
    case "terminée":
      return "bg-gray-400 text-white";
    default:
      return "bg-blue-400 text-white";
  }
};

const ReservationsTimeline = ({ reservations, onVoirDetail, onAnnuler, onLaisserAvis }) => (
  <ol className="relative border-l border-gray-300">
    {reservations.map((r, idx) => (
      <li key={r.reservation_id} className="mb-8 ml-6">
        <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${getStatusColor(r.statut)}`}>
          {idx + 1}
        </span>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">{r.ville_depart} → {r.ville_arrivee}</div>
            <div className="text-sm text-gray-500">{r.date_depart} à {r.heure_depart}</div>
            <div className="text-xs text-gray-400">Places : {r.nombre_places_reservees} | Prix : {r.prix} €</div>
            <div className="mt-1">
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(r.statut)}`}>
                {r.statut}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => onVoirDetail(r)}
            >
              Détail
            </button>
            {r.statut === "en_attente" && (
              <button
                className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => onAnnuler(r)}
              >
                Annuler
              </button>
            )}
            {r.statut === "terminée" && (
              <button
                className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                onClick={() => onLaisserAvis(r)}
              >
                Laisser un avis
              </button>
            )}
          </div>
        </div>
      </li>
    ))}
  </ol>
);

const VisualiserAvis = ({ utilisateurId }) => {
  const [trajetsPasses, setTrajetsPasses] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [newAvis, setNewAvis] = useState({ note: 5, commentaire: '' });
  const [submitting, setSubmitting] = useState(false);
  const [creator, setCreator] = useState(null);

  // Charger les trajets passés
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost/api/Controllers/ReservationController.php?utilisateur_id=${utilisateurId}`,
          { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
        );

        if (Array.isArray(response.data)) {
          const now = new Date();
          const pastReservations = response.data.filter((reservation) => {
            const dateDepart = new Date(reservation.date_depart);
            return dateDepart < now;
          });

          setTrajetsPasses(pastReservations);
          console.log('Réservations passées récupérées :', pastReservations);
        } else {
          setTrajetsPasses([]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des réservations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [utilisateurId]);

  // Charger les données du créateur et les avis pour un trajet sélectionné
  useEffect(() => {
    if (selectedTrajet) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Charger les données du créateur
          const creatorResponse = await axios.get(
            `http://localhost/api/Controllers/TrajetController.php?trajet_id=${selectedTrajet.trajet_id}`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
          );

          if (creatorResponse.data) {
            setCreator(creatorResponse.data);
            console.log('Données du créateur récupérées :', creatorResponse.data);
          } else {
            setCreator(null);
          }

          // Charger les avis
          const avisResponse = await axios.get(
            `http://localhost/api/Controllers/AvisController.php?trajet_id=${selectedTrajet.trajet_id}`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
          );

          if (Array.isArray(avisResponse.data)) {
            setAvis(avisResponse.data);
          } else {
            setAvis([]);
          }
        } catch (err) {
          setError("Erreur lors du chargement des données");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedTrajet]);

  // Soumettre un nouvel avis
  const handleSubmitAvis = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost/api/Controllers/AvisController.php`,
        {
          trajet_id: selectedTrajet.trajet_id,
          auteur_id: localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id"),
          destinataire_id: creator && creator.utilisateur_id ? creator.utilisateur_id : (selectedTrajet.conducteur_id || ""),
          note: newAvis.note,
          utilisateur_id: selectedTrajet.utilisateur_id,
          commentaire: newAvis.commentaire,
          statut: newAvis.statut || 'publié'
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (response.data && response.data.success) {
        setAvis([...avis, { ...newAvis, auteur_id: localStorage.getItem("utilisateur_id") }]);
        setNewAvis({ note: 5, commentaire: '' });
        setSubmitting(false);
        alert("Votre avis a été soumis avec succès.");
      } else {
        setSubmitting(false);
        alert("Erreur lors de la soumission de votre avis. Veuillez réessayer.");
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
      alert("Erreur lors de la soumission de votre avis. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white border border-gray-100 shadow-md rounded-xl">
      <h2 className="mb-4 text-2xl font-bold">Vos trajets passés</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <ReservationsTimeline
          reservations={trajetsPasses}
          onVoirDetail={(trajet) => setSelectedTrajet(trajet)}
          onAnnuler={async (reservation) => {
            if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
              try {
                await axios.delete(
                  `http://localhost/api/Controllers/ReservationController.php?reservation_id=${reservation.reservation_id}`,
                  { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
                );
                setTrajetsPasses(trajetsPasses.filter((t) => t.reservation_id !== reservation.reservation_id));
                alert("Réservation annulée avec succès.");
              } catch (err) {
                console.error(err);
                alert("Erreur lors de l'annulation de la réservation. Veuillez réessayer.");
              }
            }
          }}
          onLaisserAvis={(trajet) => setSelectedTrajet(trajet)}
        />
      )}

      {selectedTrajet && (
        <div className="p-4 mt-8 border rounded">
          <h3 className="mb-4 text-xl font-semibold">Détails du trajet</h3>
          <div className="mb-4">
            <strong>Itinéraire :</strong> {selectedTrajet.ville_depart} → {selectedTrajet.ville_arrivee}
          </div>
          <div className="mb-4">
            <strong>Date et heure de départ :</strong> {selectedTrajet.date_depart} à {selectedTrajet.heure_depart}
          </div>
          <div className="mb-4">
            <strong>Places réservées :</strong> {selectedTrajet.nombre_places_reservees}
          </div>
          <div className="mb-4">
            <strong>Prix :</strong> {selectedTrajet.prix} €
          </div>
          <div className="mb-4">
            <strong>Statut :</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedTrajet.statut)}`}>{selectedTrajet.statut}</span>
          </div>

          {creator && (
            <div className="mb-4">
              <strong>Conducteur :</strong> {creator.nom} {creator.prenom}
            </div>
          )}

          <h4 className="mt-4 mb-2 text-lg font-semibold">Avis sur ce trajet</h4>
          {avis.length === 0 && <div>Aucun avis trouvé pour ce trajet.</div>}
          {avis.map((a) => (
            <div key={a.avis_id} className="py-2 border-b">
              <div className="flex justify-between">
                <div>
                  <strong>{a.auteur_id === localStorage.getItem("utilisateur_id") ? "Vous" : a.auteur_nom}</strong>
                  <span className="ml-2 text-xs text-gray-500">{new Date(a.date_creation).toLocaleString()}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(a.statut)}`}>{a.statut}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="flex items-center">
                  {[...Array(a.note)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 15.27L16.18 18 14.54 11.97 20 7.24l-6.91-.59L10 0 7.91 6.65 1 7.24l4.46 4.73L5.82 18z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-gray-700">{a.commentaire}</div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <h4 className="mb-2 text-lg font-semibold">Laisser un avis</h4>
            <form onSubmit={handleSubmitAvis}>
              <div className="flex gap-2 mb-2">
                <select
                  value={newAvis.note}
                  onChange={(e) => setNewAvis({ ...newAvis, note: parseInt(e.target.value) })}
                  className="px-3 py-1 border rounded"
                >
                  <option value={5}>5 étoiles</option>
                  <option value={4}>4 étoiles</option>
                  <option value={3}>3 étoiles</option>
                  <option value={2}>2 étoiles</option>
                  <option value={1}>1 étoile</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                  disabled={submitting}
                >
                  {submitting ? "Envoi en cours..." : "Envoyer l'avis"}
                </button>
              </div>
              <textarea
                value={newAvis.commentaire}
                onChange={(e) => setNewAvis({ ...newAvis, commentaire: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                placeholder="Votre commentaire (facultatif)"
              />
            </form>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setSelectedTrajet(null)}
              className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Retour à la liste des trajets
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualiserAvis;