import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeUtilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const utilisateursPerPage = 10;

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://api-ecride-production.up.railway.app/ControllersAdministrateur/UtilisateurAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setUtilisateurs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredUtilisateurs = utilisateurs
    .filter(u =>
      (search === "" ||
        String(u.nom).toLowerCase().includes(search.toLowerCase()) ||
        String(u.prenom).toLowerCase().includes(search.toLowerCase()) ||
        String(u.email).toLowerCase().includes(search.toLowerCase()))
      && (roleFilter === "Tous" || u.role === roleFilter)
    );

  // Pagination
  const totalPages = Math.ceil(filteredUtilisateurs.length / utilisateursPerPage);
  const paginatedUtilisateurs = filteredUtilisateurs.slice((currentPage - 1) * utilisateursPerPage, currentPage * utilisateursPerPage);

  return (
    <section className="max-w-4xl p-8 mx-auto my-8 font-sans bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-primary-100">Liste des utilisateurs</h2>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Recherche nom, prénom ou email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        />
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
        >
          <option value="Tous">Tous les rôles</option>
          <option value="Administrateur">Administrateur</option>
          <option value="Employé">Employé</option>
          <option value="Utilisateur">Utilisateur</option>
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      ) : paginatedUtilisateurs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-100 rounded-lg shadow">
            <thead>
              <tr className="bg-customGrey-100">
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Nom</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Prénom</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Email</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Téléphone</th>
                <th className="px-4 py-2 font-semibold text-left text-primary-100">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUtilisateurs.map(u => (
                <tr key={u.utilisateur_id}>
                  <td className="px-4 py-2 border-b">{u.nom}</td>
                  <td className="px-4 py-2 border-b">{u.prenom}</td>
                  <td className="px-4 py-2 border-b">{u.email}</td>
                  <td className="px-4 py-2 border-b">{u.telephone}</td>
                  <td className="px-4 py-2 border-b">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
      )}
      {/* Pagination */}
      <div className="flex justify-center gap-2 my-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </section>
  );
};

export default ListeUtilisateurs;