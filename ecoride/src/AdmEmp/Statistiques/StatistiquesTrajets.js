import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import axios from "axios";

const StatistiquesTrajets = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=trajets")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques trajets."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="w-full max-w-2xl px-2 mx-auto my-8">
            <h3 className="text-lg font-bold">Trajets</h3>
            <p>{stats?.total_trajets ?? "—"} trajets</p>
           <div className="flex flex-row gap-2 mx-auto md:flex-col xl:flex-row"> 
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
            <BarChart width={500} height={300} data={stats?.trajets_par_jour || []}>
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
            </section>
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
            <p>{stats?.trajets_annules ?? "—"} trajets annulés</p>
            <p>{stats?.trajets_problemes ?? "—"} trajets problématiques</p>
            <p>{stats?.trajets_ecologiques ?? "—"} trajets écologiques</p>
            <p>{stats?.trajets_en_cours ?? "—"} trajets en cours</p>
            <p>{stats?.trajets_termines ?? "—"} trajets terminés</p>
            </section>
            </div>
        </div>
    );
};

export default StatistiquesTrajets;