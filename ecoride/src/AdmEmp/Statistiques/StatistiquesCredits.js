import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const StatistiquesCredits = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://api-ecride-production.up.railway.app/api/Controllers/StatistiqueController.php?action=credits")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques crédits."))
      .finally(() => setLoading(false));
  }, []);

  const creditsParJour = stats?.credits_par_jour || [];

  return (
    <section className="max-w-3xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des crédits</h2>
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
            <h3 className="mb-4 text-lg font-bold text-primary-100">Crédits gagnés</h3>
            <p className="mb-2 text-xl font-bold text-customGreen2-100">{stats?.total_credits ?? "—"} crédits gagnés</p>
          </div>
          <div className="p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <h4 className="mb-4 font-semibold text-primary-100">Évolution des crédits par jour</h4>
            {creditsParJour.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={creditsParJour}>
                  <XAxis dataKey="jour" stroke="#003051" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credits" fill="#58c3af" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-600">Aucune donnée disponible.</p>
            )}
            <div className="mt-6 space-y-2">
              <p>
                <span className="font-medium">Moyenne de crédits par jour :</span>{" "}
                <span className="text-customGreen2-100">
                  {creditsParJour.length > 0
                    ? (
                        creditsParJour.reduce((sum, item) => sum + Number(item.credits), 0) /
                        creditsParJour.length
                      ).toFixed(2)
                    : "—"}
                </span>
              </p>
              <p>
                <span className="font-medium">Jour avec le plus de crédits :</span>{" "}
                <span className="text-customGreen2-100">
                  {creditsParJour.length > 0
                    ? creditsParJour.reduce((max, item) =>
                        Number(item.credits) > Number(max.credits) ? item : max
                      ).jour
                    : "—"}
                </span>
              </p>
              <p>
                <span className="font-medium">Crédits max en un jour :</span>{" "}
                <span className="text-customGreen2-100">
                  {creditsParJour.length > 0
                    ? Math.max(...creditsParJour.map((item) => Number(item.credits)))
                    : "—"}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default StatistiquesCredits;