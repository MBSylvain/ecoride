import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const AjouterAvisModal = ({ trajetId, onClose, onAvisAdded }) => {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `AvisController.php`,
        {
          trajet_id: trajetId,
          note,
          commentaire,
        },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (response.data.success) {
        onAvisAdded();
        onClose();
      } else {
        setError(response.data.message || "Une erreur s'est produite.");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de l'avis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
      <div className="w-full max-w-md p-8 font-sans bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-primary-100">Ajouter un avis</h2>
        {error && <div className="px-4 py-2 mb-4 font-semibold text-white bg-red-500 rounded shadow">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Note</label>
            <select
              value={note}
              onChange={(e) => setNote(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              rows="4"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition-all duration-200 rounded bg-customGrey-100 hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 font-bold text-white transition-all duration-200 rounded bg-primary-100 hover:bg-customGreen2-100"
            >
              {loading ? 'Envoi...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterAvisModal;