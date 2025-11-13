import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Statistiques = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [trajetsParJour, setTrajetsParJour] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://api-ecride-production.up.railway.app/Controllers/StatistiqueController.php?action=vue_admin", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setStats(response.data.data);
        const responsestat = await axios.get("https://api-ecride-production.up.railway.app/Controllers/StatistiqueController.php?action=covoiturages_par_jour");
        setTrajetsParJour(responsestat.data.data);
      } catch (error) {
        setError("Erreur lors de la récupération des statistiques.");
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return (
    <div className="flex items-center justify-center p-8">
      <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
      <span className="ml-2 text-gray-600">Chargement des statistiques...</span>
    </div>
  );

  return (
    <section className="max-w-6xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-8 text-2xl font-bold text-center text-customGreen-100">Statistiques</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Utilisateurs actifs</h3>
          <p className="text-xl font-bold text-customGreen2-100">{stats.total_utilisateurs} utilisateurs actifs</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Nombre total de trajets</h3>
          <p className="text-xl font-bold text-customGreen2-100">{stats.total_trajets} trajets</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trajetsParJour}>
              <XAxis dataKey="jour" stroke="#003051" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#58c3af" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Trajets annulés</h3>
          <p className="text-xl font-bold text-red-500">{stats.trajets_annules} trajets annulés</p>
        </div>
        <div className="p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Trajets problématiques</h3>
          <p className="text-xl font-bold text-yellow-400">{stats.trajets_problemes} trajets problématiques</p>
        </div>
        <div className="col-span-2 p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Répartition des véhicules par énergie</h3>
          {stats.vehicules_repartition && stats.vehicules_repartition.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.vehicules_repartition.map(item => ({
                    ...item,
                    total: Number(item.total)
                  }))}
                  dataKey="total"
                  nameKey="energie"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.vehicules_repartition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">Aucune donnée disponible.</p>
          )}
        </div>
        <div className="col-span-2 p-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
          <h3 className="mb-2 text-lg font-bold text-primary-100">Avis (statut)</h3>
          {stats.avis_statut && stats.avis_statut.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.avis_statut}>
                <XAxis dataKey="statut" stroke="#003051" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">Aucune donnée disponible.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Statistiques;