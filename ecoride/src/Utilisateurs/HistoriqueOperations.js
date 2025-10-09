import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoriqueOperations = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [utilisateur_id] = useState(localStorage.getItem('utilisateur_id'));

  const fetchOperations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost/api/Controllers/HistoriqueActionController.php?utilisateur_id=${utilisateur_id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      setOperations(response.data.data || []);
      console.log("Données reçues:", response.data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (utilisateur_id) {
      fetchOperations();
    }
  }, [utilisateur_id]);

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mon historique d'opérations</h2>
      {loading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : operations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Détail</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, idx) => (
                <tr key={idx}>
                  <td>{op.date_action}</td>
                  <td>{op.type_action}</td>
                  <td>{op.detail || "-"}</td>
                  <td>{op.montant ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Aucune opération trouvée.</p>
      )}
    </div>
  );
};

export default HistoriqueOperations;