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
    <div className="max-w-3xl p-8 mx-auto mb-8 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Mon historique d'opérations</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : operations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Date</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Type opération</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Détail</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Montant</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="px-4 py-2">{op.date_operation}</td>
                  <td className="px-4 py-2">{op.type_operation}</td>
                  <td className="px-4 py-2">{op.Commentaire ?? "-"}</td>
                  <td className="px-4 py-2">{op.montant ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form
            className="flex flex-col items-center gap-2 mt-6"
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
            <label className="block mb-1 font-semibold text-primary-100">Ajouter des crédits :</label>
            <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
            <input type="hidden" name="type_operation" value="ajout" />
            <input type="hidden" name="Commentaire" value="Ajout de crédits" />
            <input
              type="number"
              name="montant"
              min="1"
              step="1"
              placeholder="Montant"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 mt-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
            >
              Ajouter
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-gray-600">Aucune opération trouvée.</p>
          <form
            className="flex flex-col items-center gap-2 mt-6"
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
            <label className="block mb-1 font-semibold text-primary-100">Ajouter des crédits :</label>
            <input type="hidden" name="utilisateur_id" value={utilisateur_id} />
            <input type="hidden" name="type_operation" value="ajout" />
            <input type="hidden" name="Commentaire" value="Ajout de crédits" />
            <input
              type="number"
              name="montant"
              min="1"
              step="1"
              placeholder="Montant"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 mt-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
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