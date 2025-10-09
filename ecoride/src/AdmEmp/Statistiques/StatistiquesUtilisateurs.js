import React, { useEffect, useState } from "react";
import axios from "axios";

const StatistiquesUtilisateurs = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=utilisateurs")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques utilisateurs."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="w-full max-w-2xl px-2 mx-auto my-8">
            <h3 className="text-lg font-bold">Utilisateurs</h3>
            <p>{stats?.total_utilisateurs ?? "—"} utilisateurs</p>
            <p>{stats?.total_utilisateurs_actifs ?? "—"} actifs</p>
            <p>{stats?.total_utilisateurs_inactifs ?? "—"} inactifs</p>
            <p>{stats?.nouveaux_inscrits_jour ?? "—"} nouveaux inscrits aujourd'hui</p>
            <p>{stats?.comptes_suspendus ?? "—"} comptes suspendus</p>
            <p>{stats?.comptes_supprimes ?? "—"} comptes supprimés</p>
            <p>{stats?.utilisateurs_en_attente ?? "—"} en attente de validation</p>
        </div>
    );
};

export default StatistiquesUtilisateurs;