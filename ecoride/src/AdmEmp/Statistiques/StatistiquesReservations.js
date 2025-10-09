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
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="flex justify-center w-full overflow-x-auto">
            <h3 className="text-lg font-bold">Réservations</h3>
            <p>{stats?.total_reservations ?? "—"} réservations au total</p>

            {/* Répartition par statut */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Répartition par statut</h4>
            {stats?.reservations_par_statut && stats.reservations_par_statut.length > 0 ? (
                <PieChart width={400} height={250}>
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
            ) : (
                <p>Aucune donnée disponible.</p>
            )}
            </section>

            {/* Réservations par jour */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Réservations par jour</h4>
            <BarChart width={500} height={250} data={stats?.reservations_par_jour || []}>
                <XAxis dataKey="jour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#FFBB28" />
            </BarChart>
            </section>

            {/* Répartition par nombre de places réservées */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Répartition par nombre de places réservées</h4>
            {stats?.reservations_par_places && stats.reservations_par_places.length > 0 ? (
                <PieChart width={400} height={250}>
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
            ) : (
                <p>Aucune donnée disponible.</p>
            )}
            </section>

            {/* Top utilisateurs par nombre de réservations */}
            <section className="w-full max-w-2xl px-2 mx-auto my-8">
            <h4 className="mt-4 font-semibold">Top utilisateurs (par nombre de réservations)</h4>
            {stats?.reservations_top_utilisateurs && stats.reservations_top_utilisateurs.length > 0 ? (
                <ul>
                    {stats.reservations_top_utilisateurs.map((user, idx) => (
                        <li key={user.utilisateur_id}>
                            Utilisateur #{user.utilisateur_id} : {user.total} réservation{user.total > 1 ? "s" : ""}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune donnée disponible.</p>
            )}
            </section>
        </div>
    );
};

export default StatistiquesReservations;