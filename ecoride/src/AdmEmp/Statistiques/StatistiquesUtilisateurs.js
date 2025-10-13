import React, { useEffect, useState } from "react";
import axios from "axios";
import checkAuth from "../../features/checkAuth";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#2563eb", "#facc15", "#22c55e"];

const StatistiquesUtilisateurs = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscriptions, setInscriptions] = useState([]);
    const utilisateur_role = localStorage.getItem("utilisateur_role") || localStorage.getItem("utilisateur.role");

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=utilisateurs")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques utilisateurs."))
            .finally(() => setLoading(false));
    }, []);
    
    useEffect(() => {
        axios
            .get("http://localhost/api/ControllersAdministrateur/StatistiqueAdminController.php?action=comptes_par_jour",
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }, { utilisateur_role }
            )
            .then(res => {
                // On s'assure que c'est un tableau
                setInscriptions(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => setError("Erreur lors du chargement des statistiques utilisateurs."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // PieChart : on utilise stats pour la répartition des rôles
    const pieData = [
        { name: "Administrateur", value: stats?.total_admins ?? 0 },
        { name: "Employé", value: stats?.total_employes ?? 0 },
        { name: "Utilisateur", value: stats?.total_utilisateurs_simples ?? 0 }
    ];

    // LineChart : on utilise inscriptions (toujours un tableau)
    const lineData = Array.isArray(inscriptions) ? inscriptions.map(item => ({
        date: item.date,
        total: item.total
    })) : [];

    return (
        <div className="w-full max-w-3xl px-2 mx-auto my-8">
            <h3 className="mb-2 text-lg font-bold">Utilisateurs</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <p>{stats?.total_utilisateurs ?? "—"} utilisateurs</p>
                    <p>{stats?.total_utilisateurs_actifs ?? "—"} actifs</p>
                    <p>{stats?.total_utilisateurs_inactifs ?? "—"} inactifs</p>
                    <p>{stats?.nouveaux_inscrits_jour ?? "—"} nouveaux inscrits aujourd&apos;hui</p>
                    <p>{stats?.comptes_suspendus ?? "—"} comptes suspendus</p>
                    <p>{stats?.comptes_supprimes ?? "—"} comptes supprimés</p>
                    <p>{stats?.utilisateurs_en_attente ?? "—"} en attente de validation</p>
                    <div className="flex flex-col items-center my-4">
                        <PieChart width={250} height={250}>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {pieData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        <div className="flex justify-center gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>Administrateur</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>Employé</span>
                            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>Utilisateur</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <h4 className="mb-2 font-semibold">Inscriptions par jour</h4>
                    <LineChart width={300} height={200} data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default StatistiquesUtilisateurs;