import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Statistiques = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [trajetsParJour, setTrajetsParJour] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=vue_admin", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setStats(response.data.data);
        const responsestat = await axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=covoiturages_par_jour");
      setTrajetsParJour(responsestat.data.data); // data est un tableau [{jour: '2025-10-03', total: 5}, ...]
    
      } catch (error) {
        setError("Erreur lors de la récupération des statistiques.");
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stats) return <p>Chargement des statistiques...</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-customGreen-100">Statistiques</h2>

      <div className="my-8">
        <h3 className="text-lg font-bold">Utilisateurs actifs</h3>
        <p>{stats.total_utilisateurs} utilisateurs actifs</p>
      </div>

      <div className="my-8">
        <h3 className="text-lg font-bold">Nombre total de trajets</h3>
        <p>{stats.total_trajets} trajets</p>
        <BarChart width={500} height={300} data={trajetsParJour}>
          <XAxis dataKey="jour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </div>


      <div className="my-8">
        <h3 className="text-lg font-bold">Trajets annulés</h3>
        <p>{stats.trajets_annules} trajets annulés</p>
      </div>

      <div className="my-8">
        <h3 className="text-lg font-bold">Trajets problématiques</h3>
        <p>{stats.trajets_problemes} trajets problématiques</p>
      </div>

      <div className="my-8">
        <h3 className="text-lg font-bold">Répartition des véhicules par énergie</h3>
        {stats.vehicules_repartition && stats.vehicules_repartition.length > 0 ? (
          <PieChart width={400} height={300}>
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
              fill="#8884d8"
              label
            >
              {stats.vehicules_repartition.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p>Aucune donnée disponible.</p>
        )}
      </div>

      <div className="my-8">
        <h3 className="text-lg font-bold">Avis (statut)</h3>
        {stats.avis_statut && stats.avis_statut.length > 0 ? (
          <BarChart width={500} height={300} data={stats.avis_statut}>
            <XAxis dataKey="statut" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        ) : (
          <p>Aucune donnée disponible.</p>
        )}
      </div>
    </div>
  );
};

export default Statistiques;