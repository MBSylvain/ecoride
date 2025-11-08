import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const StatistiquesEmployes = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("StatistiqueController.php?action=employes")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques employés."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-3xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des employés</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-center text-white bg-red-500 rounded-md shadow">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-primary-100">{stats?.total_employes ?? "—"}</div>
            <div className="text-gray-700">Total employés</div>
          </div>
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-customGreen2-100">{stats?.employes_actifs ?? "—"}</div>
            <div className="text-gray-700">Actifs</div>
          </div>
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-yellow-400">{stats?.employes_en_attente ?? "—"}</div>
            <div className="text-gray-700">En attente</div>
          </div>
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-red-500">{stats?.employes_suspendus ?? "—"}</div>
            <div className="text-gray-700">Suspendus</div>
          </div>
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-primary-100">{stats?.employes_admins ?? "—"}</div>
            <div className="text-gray-700">Administrateurs</div>
          </div>
          <div className="p-6 text-center border border-gray-100 rounded-lg shadow bg-customGrey-100">
            <div className="text-2xl font-bold text-indigo-600">{stats?.employes_ajoutes_ce_mois ?? "—"}</div>
            <div className="text-gray-700">Ajoutés ce mois</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StatistiquesEmployes;