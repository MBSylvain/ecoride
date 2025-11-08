import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";

const StatistiquesTrajets = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("StatistiqueController.php?action=trajets")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques trajets."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des trajets</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-center text-white bg-red-500 rounded-md shadow">{error}</div>
      ) : (
        <>
          <div className="p-6 mb-8 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <h3 className="mb-2 text-lg font-bold text-primary-100">Trajets</h3>
            <p className="mb-2 text-xl font-bold text-customGreen2-100">{stats?.total_trajets ?? "—"} trajets au total</p>
          </div>
          <section className="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow">
            <h4 className="mb-4 font-semibold text-primary-100">Trajets par jour</h4>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.trajets_par_jour || []}>
                  <XAxis dataKey="jour" stroke="#003051" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#58c3af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <h4 className="mb-4 font-semibold text-primary-100">Détail des trajets</h4>
            <ul className="pl-6 text-gray-700 list-disc">
              <li>
                <span className="font-medium">Trajets annulés :</span>{" "}
                <span className="text-red-500">{stats?.trajets_annules ?? "—"}</span>
              </li>
              <li>
                <span className="font-medium">Trajets problématiques :</span>{" "}
                <span className="text-yellow-400">{stats?.trajets_problemes ?? "—"}</span>
              </li>
              <li>
                <span className="font-medium">Trajets écologiques :</span>{" "}
                <span className="text-customGreen2-100">{stats?.trajets_ecologiques ?? "—"}</span>
              </li>
              <li>
                <span className="font-medium">Trajets en cours :</span>{" "}
                <span className="text-primary-100">{stats?.trajets_en_cours ?? "—"}</span>
              </li>
              <li>
                <span className="font-medium">Trajets terminés :</span>{" "}
                <span className="text-indigo-600">{stats?.trajets_termines ?? "—"}</span>
              </li>
            </ul>
          </section>
        </>
      )}
    </section>
  );
};

export default StatistiquesTrajets;