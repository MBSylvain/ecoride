import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#facc15", "#22c55e"];

const StatistiquesUtilisateurs = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inscriptions, setInscriptions] = useState([]);
  const utilisateur_role = localStorage.getItem("utilisateur_role") || localStorage.getItem("utilisateur.role");

  useEffect(() => {
    axiosInstance
      .get("StatistiqueController.php?action=utilisateurs")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques utilisateurs."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    axiosInstance
      .get("Administrateur/StatistiqueAdminController.php?action=comptes_par_jour",
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      )
      .then(res => {
        setInscriptions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setError("Erreur lors du chargement des statistiques utilisateurs."))
      .finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: "Administrateur", value: stats?.total_admins ?? 0 },
    { name: "Employé", value: stats?.total_employes ?? 0 },
    { name: "Utilisateur", value: stats?.total_utilisateurs_simples ?? 0 }
  ];

  const lineData = Array.isArray(inscriptions) ? inscriptions.map(item => ({
    date: item.date,
    total: item.total
  })) : [];

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des utilisateurs</h2>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-center text-white bg-red-500 rounded-md shadow">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="p-6 mb-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
              <h3 className="mb-2 text-lg font-bold text-primary-100">Répartition des rôles</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>Administrateur</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>Employé</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>Utilisateur</span>
              </div>
            </div>
            <div className="p-6 mt-4 border border-gray-100 rounded-lg shadow bg-customGrey-100">
              <h4 className="mb-2 font-semibold text-primary-100">Détail des utilisateurs</h4>
              <ul className="pl-6 text-gray-700 list-disc">
                <li>
                  <span className="font-medium">Total :</span>{" "}
                  <span className="text-primary-100">{stats?.total_utilisateurs ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">Actifs :</span>{" "}
                  <span className="text-customGreen2-100">{stats?.total_utilisateurs_actifs ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">Inactifs :</span>{" "}
                  <span className="text-gray-500">{stats?.total_utilisateurs_inactifs ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">Nouveaux inscrits aujourd'hui :</span>{" "}
                  <span className="text-indigo-600">{stats?.nouveaux_inscrits_jour ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">Comptes suspendus :</span>{" "}
                  <span className="text-red-500">{stats?.comptes_suspendus ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">Comptes supprimés :</span>{" "}
                  <span className="text-red-500">{stats?.comptes_supprimes ?? "—"}</span>
                </li>
                <li>
                  <span className="font-medium">En attente de validation :</span>{" "}
                  <span className="text-yellow-400">{stats?.utilisateurs_en_attente ?? "—"}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h4 className="mb-2 font-semibold text-primary-100">Inscriptions par jour</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

export default StatistiquesUtilisateurs;