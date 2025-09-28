import axios from 'axios';
import { useEffect, useState } from 'react';

const VisualiserAvis = ({ utilisateurId }) => {
  const [trajetsPasses, setTrajetsPasses] = useState([]);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [newAvis, setNewAvis] = useState({ note: 5, commentaire: '' });
  const [submitting, setSubmitting] = useState(false);
  const [creator, setCreator] = useState(null);

  // Charger les réservations passées de l'utilisateur
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
        // Filtrer les trajets passés
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

 

  // Charger les avis pour un trajet sélectionné
  useEffect(() => {
    if (selectedTrajet) {
      const fetchAvis = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost/api/Controllers/AvisController.php?trajet_id=${selectedTrajet.trajet_id}`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
          );
          if (Array.isArray(response.data)) {
            setAvis(response.data);
          } else {
            setAvis([]);
          }
        } catch (err) {
          setError("Erreur lors du chargement des avis");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAvis();
    }
  }, [selectedTrajet]);

   // Charger les données du créateur du trajet
  useEffect(() => {
    if (selectedTrajet) {
      const fetchCreator = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost/api/Controllers/TrajetController.php?trajet_id=${selectedTrajet.trajet_id}`,
            { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
          );
          if (response.data) {
            setCreator(response.data);
            console.log('Données du créateur récupérées :', response.data);
          } else {
            setCreator(null);
          }
        } catch (err) {
          setError("Erreur lors du chargement des données du créateur");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCreator();
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

      if (response.data.success) {
        setAvis((prevAvis) => [...prevAvis, { ...newAvis, utilisateur_nom: 'Vous' }]);
        setNewAvis({ note: 5, commentaire: '' });
      } else {
        alert(response.data.message || "Une erreur s'est produite.");
      }
    } catch (err) {
      alert("Erreur lors de l'ajout de l'avis.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white border border-gray-100 shadow-lg rounded-xl">
      <h2 className="mb-6 text-2xl font-semibold text-center">Mes Trajets Passés</h2>
      {loading ? (
        <div className="py-4 text-center text-gray-500">Chargement...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">{error}</div>
      ) : trajetsPasses.length === 0 ? (
        <div className="py-4 text-center text-gray-500">Aucun trajet passé trouvé.</div>
      ) : (
        <div className="space-y-4">
          {trajetsPasses.map((trajet) => (
            <div
              key={trajet.trajet_id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  {trajet.ville_depart} → {trajet.ville_arrivee}
                </h3>
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => setSelectedTrajet(trajet)}
                >
                  Voir les avis
                </button>
              </div>
              <p className="text-gray-600">{trajet.date_depart}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTrajet && (
        <div className="pt-6 mt-8 border-t">
          <h3 className="mb-4 text-xl font-semibold">
            Avis pour le trajet {selectedTrajet.ville_depart} → {selectedTrajet.ville_arrivee}
          </h3>
          <form onSubmit={handleSubmitAvis} className="mb-6">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Note</label>
              <select
                value={newAvis.note}
                onChange={(e) => setNewAvis({ ...newAvis, note: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
                name="note"
              >
                <option value="">Sélectionnez une note</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} ★
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Commentaire</label>
              <textarea
                value={newAvis.commentaire}
                onChange={(e) => setNewAvis({ ...newAvis, commentaire: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                required
                name="commentaire"
              ></textarea>
            </div>
            <input
              type="hidden"
              name="auteur_id"
              value={localStorage.getItem("utilisateur_id") || localStorage.getItem("user.id")}
            />
            <input
              type="hidden"
              name="destinataire_id"
              value={creator.utilisateur_id || selectedTrajet.conducteur_id || ""}
            />
            <input
              type="hidden"
              name="trajet_id"
              value={selectedTrajet.trajet_id}
            />
            <input
              type="hidden"
              name="statut"
              value={newAvis.statut || 'publié'}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              {submitting ? 'Envoi...' : 'Ajouter un avis'}
            </button>
          </form>

          <div className="space-y-4">
            {avis.map((avisItem) => (
              <div
                key={avisItem.avis_id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{avisItem.utilisateur_nom}</h3>
                  <span className="text-yellow-500">{avisItem.note} ★</span>
                </div>
                <p className="text-gray-600">{avisItem.commentaire}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualiserAvis;