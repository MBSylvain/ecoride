import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666", "#AAFF99"];

const StatistiquesReservations = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost/api/Controllers/StatistiqueController.php?action=reservations")
            .then(res => setStats(res.data))
            .catch(() => setError("Erreur lors du chargement des statistiques réservations."))
            .finally(() => setLoading(false));
    }, []);
    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="w-full max-w-6xl px-2 mx-auto my-8">
            <h3 className="mb-2 text-lg font-bold">Réservations</h3>
            <p className="mb-6">{stats?.total_reservations ?? "—"} réservations au total</p>

            {/* Répartition par statut */}
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
                <h4 className="mb-4 font-semibold">Répartition par statut</h4>
                {stats?.reservations_par_statut && stats.reservations_par_statut.length > 0 ? (
                    <div className="flex justify-center">
                        <PieChart width={350} height={220}>
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
                    </div>
                ) : (
                    <p className="text-center">Aucune donnée disponible.</p>
                )}
            </section>

            {/* Réservations par jour */}
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
                <h4 className="mb-4 font-semibold">Réservations par jour</h4>
                <div className="overflow-x-auto">
                    <BarChart width={500} height={250} data={stats?.reservations_par_jour || []}>
                        <XAxis dataKey="jour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#FFBB28" />
                    </BarChart>
                </div>
            </section>

            {/* Répartition par nombre de places réservées */}
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
                <h4 className="mb-4 font-semibold">Répartition par nombre de places réservées</h4>
                {stats?.reservations_par_places && stats.reservations_par_places.length > 0 ? (
                    <div className="flex justify-center">
                        <PieChart width={350} height={220}>
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
                    </div>
                ) : (
                    <p className="text-center">Aucune donnée disponible.</p>
                )}
            </section>

            {/* Top utilisateurs par nombre de réservations */}
            <section className="w-full p-4 mb-8 bg-white shadow rounded-xl">
                <h4 className="mb-4 font-semibold">Top utilisateurs (par nombre de réservations)</h4>
                {stats?.reservations_top_utilisateurs && stats.reservations_top_utilisateurs.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {stats.reservations_top_utilisateurs.map((user, idx) => (
                            <li key={user.utilisateur_id}>
                                Utilisateur #{user.utilisateur_id} : {user.total} réservation{user.total > 1 ? "s" : ""}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">Aucune donnée disponible.</p>
                )}
            </section>
        </div>
    );
};

export default StatistiquesReservations;