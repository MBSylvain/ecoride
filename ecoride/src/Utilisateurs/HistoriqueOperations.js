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
        `http://localhost/api/Controllers/CreditController.php?utilisateur_id=${utilisateur_id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      setOperations(response.data || []);
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
                <th>Type opération</th>
                <th>Détail</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, idx) => (
                <tr key={idx}>
                  <td>{op.date_operation}</td>
                  <td>{op.type_operation}</td>
                  <td>{op.Commentaire ??"-"}</td>
                  <td>{op.montant ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form
            className="flex flex-col items-center gap-2 mt-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const montant = e.target.elements.montant.value;
              if (!montant || isNaN(montant) || montant <= 0) {
                alert("Veuillez entrer un montant valide.");
                return;
              }
              try {
                await axios.post(
                  "http://localhost/api/Controllers/CreditController.php",
                  { utilisateur_id, montant, type_operation: 'ajout', Commentaire: 'Ajout de crédits' },
                  {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                  }
                );
                alert("Crédit ajouté avec succès !");
                fetchOperations();
                e.target.reset();
              } catch (error) {
                alert("Erreur lors de l'ajout de crédit.");
              }
            }}
          >
            <label className="block mb-1 font-medium">Ajouter des crédits :</label>
            <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
            <input
              type="hidden"
              name="type_operation"
              value="ajout"
            />
            <input
              type="hidden"
              name="Commentaire"
              value="Ajout de crédits"
            />
            <input
              type="number"
              name="montant"
              min="1"
              step="1"
              placeholder="Montant"
              className="px-2 py-1 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </form>
        </div>
      ) : (
        <div className='p-4 text-center'>
           <p>Aucune opération trouvée.</p>
          <form
            className="flex flex-col items-center gap-2 mt-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const montant = e.target.elements.montant.value;
              if (!montant || isNaN(montant) || montant <= 0) {
                alert("Veuillez entrer un montant valide.");
                return;
              }
              try {
                await axios.post(
                  "http://localhost/api/Controllers/CreditController.php",
                  { utilisateur_id, montant, type_operation: 'ajout', Commentaire: 'Ajout de crédits' },
                  {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                  }
                );
                alert("Crédit ajouté avec succès !");
                fetchOperations();
                e.target.reset();
              } catch (error) {
                alert("Erreur lors de l'ajout de crédit.");
              }
            }}
          >
            <label className="block mb-1 font-medium">Ajouter des crédits :</label>
            <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
            <input
              type="hidden"
              name="type_operation"
              value="ajout"
            />
            <input
              type="hidden"
              name="Commentaire"
              value="Ajout de crédits"
            />
            <input
              type="number"
              name="montant"
              min="1"
              step="1"
              placeholder="Montant"
              className="px-2 py-1 border rounded"
              required
            />
            <button
              type="submit"
              className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Ajouter
            </button>
          </form>
          </div>

      )}
    </div>
  );
};

export default HistoriqueOperations;