import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";

const StatistiquesAvis = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=avis")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques avis."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="flex justify-center w-full overflow-x-auto">
            <h3 className="text-lg font-bold">Avis</h3>
            {stats?.avis_statut && stats.avis_statut.length > 0 ? (
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
            <div className="mt-4">
                <h4 className="font-semibold">Détail des avis</h4>
                <ul>
                    <li>
                        <span className="font-medium">Avis en attente :</span>{" "}
                        {stats?.avis_en_attente ?? 0}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StatistiquesAvis;