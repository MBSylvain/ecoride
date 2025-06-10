import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const ReviewsSection = ({ 
  avisRecus, avisRecusLoading,
  avisDonnes, avisDonnesLoading 
}) => {
  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mes avis</h2>
      
      <h3 className="mb-3 text-lg font-medium">Avis reçus</h3>
      {avisRecusLoading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : avisRecus.length > 0 ? (
        <div className="mb-6 overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">De</th>
                <th className="px-4 py-3 text-left">Note</th>
                <th className="px-4 py-3 text-left">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {avisRecus.map((avis) => (
                <tr key={avis.avis_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{avis.date_creation}</td>
                  <td className="px-4 py-3">{avis.prenom || "Anonyme"}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={avis.note} />
                  </td>
                  <td className="px-4 py-3">{avis.commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="mb-6">Vous n'avez pas encore reçu d'avis.</p>}

      <h3 className="mb-3 text-lg font-medium">Avis donnés</h3>
      {avisDonnesLoading ? (
        <div className="p-4 text-center">Chargement...</div>
      ) : avisDonnes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Pour</th>
                <th className="px-4 py-3 text-left">Note</th>
                <th className="px-4 py-3 text-left">Commentaire</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {avisDonnes.map((avis) => (
                <tr key={avis.avis_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{avis.date_creation}</td>
                  <td className="px-4 py-3">{avis.prenom || "Inconnu"}</td>
                  <td className="px-4 py-3">
                    <StarRating rating={avis.note} />
                  </td>
                  <td className="px-4 py-3">{avis.commentaire}</td>
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/avis/modifier/${avis.avis_id}`} className="text-blue-600 hover:text-blue-800">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p>Vous n'avez pas encore donné d'avis.</p>}
    </div>
  );
};

export default ReviewsSection;