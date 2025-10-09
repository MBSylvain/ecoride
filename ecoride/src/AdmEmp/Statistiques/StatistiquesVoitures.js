import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
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

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

     // Conversion des totaux en nombres
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
        <div className="flex justify-center w-full overflow-x-auto">
            <h3 className="text-lg font-bold">Voitures</h3>
            <p>{stats?.total_voitures ?? "—"} voitures enregistrées</p>

            {/* Répartition par énergie */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Répartition par énergie</h4>
            <PieChart width={400} height={250}>
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
            <ul>
                {(stats?.voitures_par_energie || []).map((item, idx) => (
                    <li key={idx}>
                        {item.energie} : {item.total}
                    </li>
                ))}
            </ul>
            </section>

            {/* Répartition par marque */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Répartition par marque</h4>
            <PieChart width={400} height={250}>
                <Pie
                    data={dataMarque}
                    dataKey="total"
                    nameKey="marque"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                >
                    {(stats?.voitures_par_marque || []).map((entry, index) => (
                        <Cell key={`cell-marque-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            <ul>
                {(stats?.voitures_par_marque || []).map((item, idx) => (
                    <li key={idx}>
                        {item.marque} : {item.total}
                    </li>
                ))}
            </ul>
            </section>

            {/* Répartition par nombre de places */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Répartition par nombre de places</h4>
            <PieChart width={400} height={250}>
                <Pie
                    data={dataPlaces}
                    dataKey="total"
                    nameKey="nombre_places"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={entry => `${entry.nombre_places} places`}
                >
                    {(stats?.voitures_par_places || []).map((entry, index) => (
                        <Cell key={`cell-places-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            <ul>
                {(stats?.voitures_par_places || []).map((item, idx) => (
                    <li key={idx}>
                        {item.nombre_places} places : {item.total}
                    </li>
                ))}
            </ul>
            </section>
        </div>
    );
};

export default StatistiquesVoitures;