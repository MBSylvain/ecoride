import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#58c3af", "#003051", "#e85d75", "#facc15", "#8884d8", "#FF6666", "#AAFF99"];

const StatistiquesReservations = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://api-ecride-production.up.railway.app/api/Controllers/StatistiqueController.php?action=reservations")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques réservations."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-5xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des réservations</h2>
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
            <h3 className="mb-2 text-lg font-bold text-primary-100">Réservations</h3>
            <p className="mb-2 text-xl font-bold text-customGreen2-100">{stats?.total_reservations ?? "—"} réservations au total</p>
          </div>

          {/* Répartition par statut */}
          <section className="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow">
            <h4 className="mb-4 font-semibold text-primary-100">Répartition par statut</h4>
            {stats?.reservations_par_statut && stats.reservations_par_statut.length > 0 ? (
              <div className="flex justify-center">
                <ResponsiveContainer width={350} height={220}>
                  <PieChart>
                    <Pie
                      data={stats.reservations_par_statut.map(item => ({
                        ...item,
                        total: Number(item.total)
                      }))}
                      dataKey="total"
                      nameKey="statut"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.reservations_par_statut.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée disponible.</p>
            )}
          </section>

          {/* Réservations par jour */}
          <section className="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow">
            <h4 className="mb-4 font-semibold text-primary-100">Réservations par jour</h4>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.reservations_par_jour || []}>
                  <XAxis dataKey="jour" stroke="#003051" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#58c3af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Répartition par nombre de places réservées */}
          <section className="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow">
            <h4 className="mb-4 font-semibold text-primary-100">Répartition par nombre de places réservées</h4>
            {stats?.reservations_par_places && stats.reservations_par_places.length > 0 ? (
              <div className="flex justify-center">
                <ResponsiveContainer width={350} height={220}>
                  <PieChart>
                    <Pie
                      data={stats.reservations_par_places.map(item => ({
                        ...item,
                        total: Number(item.total)
                      }))}
                      dataKey="total"
                      nameKey="nombre_places_reservees"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={entry => `${entry.nombre_places_reservees} places`}
                    >
                      {stats.reservations_par_places.map((entry, idx) => (
                        <Cell key={`cell-places-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée disponible.</p>
            )}
          </section>

          {/* Top utilisateurs par nombre de réservations */}
          <section className="p-6 mb-8 bg-white border border-gray-100 rounded-lg shadow">
            <h4 className="mb-4 font-semibold text-primary-100">Top utilisateurs (par nombre de réservations)</h4>
            {stats?.reservations_top_utilisateurs && stats.reservations_top_utilisateurs.length > 0 ? (
              <ul className="text-gray-700 list-disc list-inside">
                {stats.reservations_top_utilisateurs.map((user, idx) => (
                  <li key={user.utilisateur_id}>
                    Utilisateur #{user.utilisateur_id} : <span className="font-bold text-customGreen2-100">{user.total}</span> réservation{user.total > 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée disponible.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default StatistiquesReservations;