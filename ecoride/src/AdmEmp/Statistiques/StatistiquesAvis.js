import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";

const StatistiquesAvis = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("StatistiqueController.php?action=avis")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques avis."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-3xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des avis</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-center text-white bg-red-500 rounded-md shadow">{error}</div>
      ) : (
        <>
          <div className="p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <h3 className="mb-4 text-lg font-bold text-primary-100">Répartition des avis par statut</h3>
            {stats?.avis_statut && stats.avis_statut.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.avis_statut}>
                  <XAxis dataKey="statut" stroke="#003051" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#58c3af" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600">Aucune donnée disponible.</p>
            )}
          </div>
          <div className="p-6 mt-4 border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <h4 className="mb-2 font-semibold text-primary-100">Détail des avis</h4>
            <ul className="pl-6 text-gray-700 list-disc">
              <li>
                <span className="font-medium">Avis en attente :</span>{" "}
                <span className="text-customGreen2-100">{stats?.avis_en_attente ?? 0}</span>
              </li>
              <li>
                <span className="font-medium">Avis publiés :</span>{" "}
                <span className="text-customGreen2-100">{stats?.avis_publies ?? 0}</span>
              </li>
              <li>
                <span className="font-medium">Avis refusés :</span>{" "}
                <span className="text-customGreen2-100">{stats?.avis_refuses ?? 0}</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default StatistiquesAvis;