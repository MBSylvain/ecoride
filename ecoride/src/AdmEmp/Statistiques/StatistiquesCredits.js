import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";

const StatistiquesCredits = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=credits")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques crédits."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const creditsParJour = stats?.credits_par_jour || [];

    return (
        <div className="flex justify-center w-full overflow-x-auto">
            <h3 className="text-lg font-bold">Crédits</h3>
            <p>{stats?.total_credits ?? "—"} crédits gagnés</p>
            <BarChart width={500} height={300} data={creditsParJour}>
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="credits" fill="#00C49F" />
            </BarChart>
            <div className="mt-4">
                <p>
                    Moyenne de crédits par jour :{" "}
                    {creditsParJour.length > 0
                        ? (
                            creditsParJour.reduce((sum, item) => sum + Number(item.credits), 0) /
                            creditsParJour.length
                        ).toFixed(2)
                        : "—"}
                </p>
                <p>
                    Jour avec le plus de crédits :{" "}
                    {creditsParJour.length > 0
                        ? creditsParJour.reduce((max, item) =>
                            Number(item.credits) > Number(max.credits) ? item : max
                        ).jour
                        : "—"}
                </p>
                <p>
                    Crédits max en un jour :{" "}
                    {creditsParJour.length > 0
                        ? Math.max(...creditsParJour.map((item) => Number(item.credits)))
                        : "—"}
                </p>
            </div>
        </div>
    );
};

export default StatistiquesCredits;