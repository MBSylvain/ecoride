import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666", "#AAFF99"];

const StatistiquesVoitures = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/api/Controllers/StatistiqueController.php?action=voitures")
      .then(res => setStats(res.data))
      .catch(() => setError("Erreur lors du chargement des statistiques voitures."))
      .finally(() => setLoading(false));
  }, []);

  const dataEnergie = (stats?.voitures_par_energie || []).map(item => ({
    ...item,
    total: Number(item.total)
  }));
  const dataMarque = (stats?.voitures_par_marque || []).map(item => ({
    ...item,
    total: Number(item.total)
  }));
  const dataPlaces = (stats?.voitures_par_places || []).map(item => ({
    ...item,
    total: Number(item.total)
  }));

  return (
    <section className="max-w-5xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-primary-100">Statistiques des voitures</h2>
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
            <h3 className="mb-2 text-lg font-bold text-primary-100">Voitures enregistrées</h3>
            <p className="mb-2 text-xl font-bold text-customGreen2-100">{stats?.total_voitures ?? "—"} voitures</p>
          </div>
          <section className="flex flex-col flex-wrap gap-8 xl:flex-row">
            {/* Répartition par énergie */}
            <section className="flex flex-col items-center flex-1 p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
              <h4 className="mb-4 font-semibold text-center text-primary-100">Répartition par énergie</h4>
              <ResponsiveContainer width={250} height={220}>
                <PieChart>
                  <Pie
                    data={dataEnergie}
                    dataKey="total"
                    nameKey="energie"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {dataEnergie.map((entry, index) => (
                      <Cell key={`cell-energie-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 text-xs">
                {(stats?.voitures_par_energie || []).map((item, idx) => (
                  <li key={idx}>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></span>
                    {item.energie} : {item.total}
                  </li>
                ))}
              </ul>
            </section>

            {/* Répartition par marque */}
            <section className="flex flex-col items-center flex-1 p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
              <h4 className="mb-4 font-semibold text-center text-primary-100">Répartition par marque</h4>
              <ResponsiveContainer width={250} height={220}>
                <PieChart>
                  <Pie
                    data={dataMarque}
                    dataKey="total"
                    nameKey="marque"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {dataMarque.map((entry, index) => (
                      <Cell key={`cell-marque-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 text-xs">
                {(stats?.voitures_par_marque || []).map((item, idx) => (
                  <li key={idx}>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></span>
                    {item.marque} : {item.total}
                  </li>
                ))}
              </ul>
            </section>

            {/* Répartition par nombre de places */}
            <section className="flex flex-col items-center flex-1 p-6 mb-8 border border-gray-100 rounded-lg shadow bg-customGrey-100">
              <h4 className="mb-4 font-semibold text-center text-primary-100">Répartition par nombre de places</h4>
              <ResponsiveContainer width={250} height={220}>
                <PieChart>
                  <Pie
                    data={dataPlaces}
                    dataKey="total"
                    nameKey="nombre_places"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={entry => `${entry.nombre_places} places`}
                  >
                    {dataPlaces.map((entry, index) => (
                      <Cell key={`cell-places-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 text-xs">
                {(stats?.voitures_par_places || []).map((item, idx) => (
                  <li key={idx}>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }}></span>
                    {item.nombre_places} places : {item.total}
                  </li>
                ))}
              </ul>
            </section>
          </section>
        </>
      )}
    </section>
  );
};

export default StatistiquesVoitures;