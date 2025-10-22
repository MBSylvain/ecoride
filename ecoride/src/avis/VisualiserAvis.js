import axios from 'axios';
import { useEffect, useState } from 'react';
import React from "react";
import CreerSignalement from "../Signalement/CreerSignalement";

const getStatusColor = (statut) => {
  switch (statut) {
    case "confirmé":
      return "bg-customGreen2-100 text-white";
    case "en_attente":
      return "bg-yellow-400 text-black";
    case "annulée":
      return "bg-red-500 text-white";
    case "terminée":
      return "bg-gray-400 text-white";
    default:
      return "bg-primary-100 text-white";
  }
};

const STATUTS = [
  { value: "", label: "Tous" },
  { value: "confirmé", label: "Confirmé" },
  { value: "en_attente", label: "En attente" },
  { value: "annulée", label: "Annulée" },
  { value: "terminée", label: "Terminée" }
];

const VisualiserAvis = ({ utilisateurId }) => {
  const [trajetsPasses, setTrajetsPasses] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [newAvis, setNewAvis] = useState({ note: 5, commentaire: '' });
  const [submitting, setSubmitting] = useState(false);
  const [creator, setCreator] = useState(null);
  const [showSignalement, setShowSignalement] = useState(false);
  const [statutFilter, setStatutFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const trajetsPerPage = 5;

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
        } else {
          setTrajetsPasses([]);
        }
      } catch (err) {
        setError("Erreur lors du chargement des réservations");
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
          statut: newAvis.statut || 'modéré'
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
      alert("Erreur lors de la soumission de votre avis. Veuillez réessayer.");
    }
  };

  // Filtres et pagination
  const filteredTrajets = statutFilter
    ? trajetsPasses.filter(t => t.statut === statutFilter)
    : trajetsPasses;

  const totalPages = Math.ceil(filteredTrajets.length / trajetsPerPage);
  const paginatedTrajets = filteredTrajets.slice((currentPage - 1) * trajetsPerPage, currentPage * trajetsPerPage);

  return (
    <div className="max-w-5xl p-6 mx-auto font-sans bg-white border border-gray-100 shadow-md rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-primary-100">Vos trajets passés</h2>
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      )}
      {error && <div className="p-3 mb-4 font-semibold text-red-500 bg-red-100 rounded-md">{error}</div>}
      {!loading && !error && (
        <>
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <label className="font-medium text-primary-100">Filtrer par statut :</label>
            <select
              value={statutFilter}
              onChange={e => { setStatutFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
            >
              {STATUTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-customGrey-100">
                  <th className="px-2 py-1 font-semibold border text-primary-100">Départ</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Arrivée</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Date</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Heure</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Places</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Prix (€)</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Statut</th>
                  <th className="px-2 py-1 font-semibold border text-primary-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrajets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-600">Aucun trajet trouvé.</td>
                  </tr>
                )}
                {paginatedTrajets.map(trajet => (
                  <tr key={trajet.reservation_id}>
                    <td className="px-2 py-1 border">{trajet.ville_depart}</td>
                    <td className="px-2 py-1 border">{trajet.ville_arrivee}</td>
                    <td className="px-2 py-1 border">{trajet.date_depart}</td>
                    <td className="px-2 py-1 border">{trajet.heure_depart}</td>
                    <td className="px-2 py-1 border">{trajet.nombre_places_reservees}</td>
                    <td className="px-2 py-1 border">{trajet.prix}</td>
                    <td className="px-2 py-1 border">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(trajet.statut)}`}>
                        {trajet.statut}
                      </span>
                    </td>
                    <td className="flex flex-wrap gap-2 px-2 py-1 border">
                      <button
                        className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
                        onClick={() => setSelectedTrajet(trajet)}
                      >
                        Détail
                      </button>
                      {trajet.statut === "en_attente" && (
                        <>
                        <button
                          className="px-4 py-2 font-bold text-white transition-colors bg-red-500 rounded-md shadow-md hover:bg-red-600"
                          onClick={async () => {
                            if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
                              try {
                                await axios.delete(
                                  `http://localhost/api/Controllers/ReservationController.php?reservation_id=${trajet.reservation_id}`,
                                  { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
                                );
                                setTrajetsPasses(trajetsPasses.filter((t) => t.reservation_id !== trajet.reservation_id));
                                alert("Réservation annulée avec succès.");
                              } catch (err) {
                                alert("Erreur lors de l'annulation de la réservation. Veuillez réessayer.");
                              }
                            }
                          }}
                        >
                          Annuler
                        </button>

                        <button
                          className="px-4 py-2 font-bold text-black transition-colors bg-yellow-400 rounded-md shadow-md hover:bg-yellow-500"
                          onClick={() => setShowSignalement(trajet)}
                        >
                          Signaler
                        </button>
                        </>
                      )}
                      {trajet.statut === "terminée" && (
                        <>
                          <button
                            className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
                            onClick={() => setSelectedTrajet(trajet)}
                          >
                            Laisser un avis
                          </button>
                          <button
                            className="px-4 py-2 font-bold text-black transition-colors bg-yellow-400 rounded-md shadow-md hover:bg-yellow-500"
                            onClick={() => setShowSignalement(trajet)}
                          >
                            Signaler
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center gap-2 my-4">
            <button
              className="px-4 py-2 font-bold text-white transition-colors border rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 border rounded-md font-bold shadow-md ${
                  currentPage === idx + 1 ? "bg-primary-100 text-white" : "bg-gray-100 text-primary-100"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 font-bold text-white transition-colors border rounded-md shadow-md bg-customGreen-100 hover:bg-customGreen2-100"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {/* Modale détail trajet + avis */}
      {selectedTrajet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
          <div className="relative w-full max-w-2xl p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setSelectedTrajet(null)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <h3 className="mb-4 text-xl font-bold text-primary-100">Détails du trajet</h3>
            <div className="mb-2"><strong>Itinéraire :</strong> {selectedTrajet.ville_depart} → {selectedTrajet.ville_arrivee}</div>
            <div className="mb-2"><strong>Date et heure de départ :</strong> {selectedTrajet.date_depart} à {selectedTrajet.heure_depart}</div>
            <div className="mb-2"><strong>Places réservées :</strong> {selectedTrajet.nombre_places_reservees}</div>
            <div className="mb-2"><strong>Prix :</strong> {selectedTrajet.prix} €</div>
            <div className="mb-2"><strong>Statut :</strong> <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedTrajet.statut)}`}>{selectedTrajet.statut}</span></div>
            {creator && (
              <div className="mb-2"><strong>Conducteur :</strong> {creator.nom} {creator.prenom}</div>
            )}

            <h4 className="mt-4 mb-2 text-lg font-semibold text-primary-100">Avis sur ce trajet</h4>
            {avis.length === 0 && <div className="text-gray-600">Aucun avis trouvé pour ce trajet.</div>}
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
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 15.27L16.18 18 14.54 11.97 20 7.24l-6.91-.59L10 0 7.91 6.65 1 7.24l4.46 4.73L5.82 18z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-700">{a.commentaire}</div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <h4 className="mb-2 text-lg font-semibold text-primary-100">Laisser un avis</h4>
              <form onSubmit={handleSubmitAvis}>
                <div className="flex gap-2 mb-2">
                  <select
                    value={newAvis.note}
                    onChange={(e) => setNewAvis({ ...newAvis, note: parseInt(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
                  >
                    <option value={5}>5 étoiles</option>
                    <option value={4}>4 étoiles</option>
                    <option value={3}>3 étoiles</option>
                    <option value={2}>2 étoiles</option>
                    <option value={1}>1 étoile</option>
                  </select>
                  <button
                    type="submit"
                    className={`px-4 py-2 font-bold rounded-md shadow-md transition-colors ${
                      submitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-customGreen-100 text-white hover:bg-customGreen2-100"
                    }`}
                    disabled={submitting}
                  >
                    {submitting ? "Envoi en cours..." : "Envoyer l'avis"}
                  </button>
                </div>
                <textarea
                  value={newAvis.commentaire}
                  onChange={(e) => setNewAvis({ ...newAvis, commentaire: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100 focus:outline-none"
                  rows="3"
                  placeholder="Votre commentaire (facultatif)"
                />
              </form>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setSelectedTrajet(null)}
                className="px-4 py-2 font-bold text-white transition-colors rounded-md shadow-md bg-primary-100 hover:bg-customPink-100"
              >
                Retour à la liste des trajets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale signalement */}
      {showSignalement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
          <div className="relative w-full max-w-xl p-8 transition-all duration-300 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
              onClick={() => setShowSignalement(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
            <CreerSignalement
              trajet_id={showSignalement.trajet_id}
              utilisateur_id={utilisateurId}
              onSuccess={() => setShowSignalement(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualiserAvis;