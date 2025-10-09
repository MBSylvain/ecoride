import React, { useEffect, useState } from "react";
import axios from "axios";

const StatistiquesEmployes = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=employes")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques employés."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="w-full max-w-2xl px-2 mx-auto my-8 ">
            <h3 className="text-lg font-bold">Employés</h3>
            <p>{stats?.total_employes ?? "—"} employés</p>
            <p>{stats?.employes_suspendus ?? "—"} employés suspendus</p>
            <p>{stats?.employes_actifs ?? "—"} employés actifs</p>
            <p>{stats?.employes_en_attente ?? "—"} employés en attente</p>
            <p>{stats?.employes_admins ?? "—"} administrateurs</p>
            <p>{stats?.employes_ajoutes_ce_mois ?? "—"} ajoutés ce mois</p>
        </div>
    );
};

export default StatistiquesEmployes;