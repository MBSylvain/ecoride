import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const Statistiques = () => {
  const [stats, setStats] = useState(null);

  // Couleurs pour les graphiques
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Récupérer les statistiques depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost/api/Controllers/getStats.php");
        setStats(response.data); // Les données doivent être formatées côté serveur
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <p>Chargement des statistiques...</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-customGreen-100">Statistiques</h2>

      {/* Graphique : Nombre d'utilisateurs par rôle */}
      <div className="my-8">
        <h3 className="text-lg font-bold">Répartition des utilisateurs par rôle</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={stats.usersByRole}
            dataKey="count"
            nameKey="role"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {stats.usersByRole.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Graphique : Nombre de trajets par statut */}
      <div className="my-8">
        <h3 className="text-lg font-bold">Nombre de trajets par statut</h3>
        <BarChart width={500} height={300} data={stats.tripsByStatus}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>

      {/* Graphique : Nombre de réservations par statut */}
      <div className="my-8">
        <h3 className="text-lg font-bold">Nombre de réservations par statut</h3>
        <BarChart width={500} height={300} data={stats.reservationsByStatus}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Moyenne des notes des avis */}
      <div className="my-8">
        <h3 className="text-lg font-bold">Moyenne des notes des avis</h3>
        <p className="text-2xl font-bold">{stats.averageRating.toFixed(2)} / 5</p>
      </div>
    </div>
  );
};

export default Statistiques;