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
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="w-full max-w-2xl px-2 mx-auto my-8">
            <h3 className="mb-4 text-lg font-bold">Statistiques Employés</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold">{stats?.total_employes ?? "—"}</div>
                    <div className="text-gray-600">Total employés</div>
                </div>
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold text-green-600">{stats?.employes_actifs ?? "—"}</div>
                    <div className="text-gray-600">Actifs</div>
                </div>
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold text-yellow-600">{stats?.employes_en_attente ?? "—"}</div>
                    <div className="text-gray-600">En attente</div>
                </div>
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold text-red-600">{stats?.employes_suspendus ?? "—"}</div>
                    <div className="text-gray-600">Suspendus</div>
                </div>
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">{stats?.employes_admins ?? "—"}</div>
                    <div className="text-gray-600">Administrateurs</div>
                </div>
                <div className="p-4 text-center bg-white rounded shadow">
                    <div className="text-2xl font-bold text-indigo-600">{stats?.employes_ajoutes_ce_mois ?? "—"}</div>
                    <div className="text-gray-600">Ajoutés ce mois</div>
                </div>
            </div>
        </div>
    );
};

export default StatistiquesEmployes;