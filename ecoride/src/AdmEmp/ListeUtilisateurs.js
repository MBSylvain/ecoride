import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [sortKey, setSortKey] = useState("nom");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pour la modale de création/édition
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get("http://localhost/api/ControllersAdministrateur/UtilisateurAdminController.php", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        let usersArray = [];
        if (Array.isArray(res.data)) {
          usersArray = res.data;
        } else if (Array.isArray(res.data.data)) {
          usersArray = res.data.data;
        }
        setUsers(usersArray);
      })
      .catch(() => setError("Erreur lors du chargement des utilisateurs."))
      .finally(() => setLoading(false));
  };

  // Recherche, filtre, tri
  const filteredUsers = users
    .filter(u =>
      (search === "" ||
        u.nom?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()))
      && (roleFilter === "Tous" || u.role === roleFilter)
      && (statutFilter === "Tous" || (statutFilter === "Actif" ? (!u.suspendu && u.suspendu !== undefined) : (u.suspendu && u.suspendu !== undefined)))
    )
    .sort((a, b) => {
      if (!a[sortKey] || !b[sortKey]) return 0;
      if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // Gestion suppression
  const handleDelete = (utilisateur_id) => {
    if (window.confirm("Supprimer ce compte utilisateur ?")) {
      axios.delete(`http://localhost/api/ControllersAdministrateur/UtilisateurAdminController.php?utilisateur_id=${utilisateur_id}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      })
      .then(() => fetchUsers());
    }
  };

  // Gestion création/édition
  const handleSave = (user) => {
    const method = user.utilisateur_id ? "put" : "post";
    axios[method]("http://localhost/api/ControllersAdministrateur/UtilisateurAdminController.php", user, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      setShowModal(false);
      fetchUsers();
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section>
      <h2>Utilisateurs</h2>
      {/* Recherche et filtres */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Recherche nom ou email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-2 py-1 border rounded"
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-2 py-1 border rounded">
          <option value="Tous">Tous les rôles</option>
          <option value="Utilisateur">Utilisateur</option>
          <option value="Employé">Employé</option>
          <option value="Administrateur">Administrateur</option>
        </select>
        <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)} className="px-2 py-1 border rounded">
          <option value="Tous">Tous les statuts</option>
          <option value="Actif">Actif</option>
          <option value="Inactif">Inactif</option>
        </select>
        <button
          className="px-4 py-2 ml-auto text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => { setSelectedUser(null); setShowModal(true); }}
        >
          Créer un compte
        </button>
      </div>
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              <th className="px-2 py-1 border cursor-pointer" aria-label="Trier par nom" onClick={() => { setSortKey("nom"); setSortAsc(k => !k); }}>Nom</th>
              <th className="px-2 py-1 border cursor-pointer" aria-label="Trier par email" onClick={() => { setSortKey("email"); setSortAsc(k => !k); }}>Email</th>
              <th className="px-2 py-1 border cursor-pointer" aria-label="Trier par rôle" onClick={() => { setSortKey("role"); setSortAsc(k => !k); }}>Rôle</th>
              <th className="px-2 py-1 border cursor-pointer" aria-label="Trier par statut" onClick={() => { setSortKey("suspendu"); setSortAsc(k => !k); }}>Statut</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.utilisateur_id}>
                <td className="px-2 py-1 border">{user.nom}</td>
                <td className="px-2 py-1 border">{user.email}</td>
                <td className="px-2 py-1 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === "Administrateur" ? "bg-blue-100 text-blue-800" :
                    user.role === "Employé" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-2 py-1 border">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    !user.suspendu ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {!user.suspendu ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="flex flex-wrap gap-2 px-2 py-1 border">
                  <button
                    className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => { setSelectedUser(user); setShowModal(true); }}
                  >
                    Modifier
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.utilisateur_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-2 my-4">
        <button
          className="px-2 py-1 border rounded"
          aria-label="Page précédente"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-2 py-1 border rounded ${currentPage === idx + 1 ? "bg-customGreen-100 text-white" : ""}`}
            aria-label={`Page ${idx + 1}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-2 py-1 border rounded"
          aria-label="Page suivante"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>

      {/* Modale création/édition */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

// Modale utilisateur (création/édition)
const UserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState(
    user || { nom: "", email: "", role: "Utilisateur", suspendu: false }
  );

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold">{user ? "Modifier" : "Créer"} un utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              name="nom"
              className="w-full px-2 py-1 border rounded"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-2 py-1 border rounded"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Rôle</label>
            <select
              name="role"
              className="w-full px-2 py-1 border rounded"
              value={form.role}
              onChange={handleChange}
            >
              <option value="Utilisateur">Utilisateur</option>
              <option value="Modérateur">Employé</option>
              <option value="Administrateur">Administrateur</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="suspendu"
              type="checkbox"
              checked={form.suspendu}
              onChange={handleChange}
              id="suspendu"
            />
            <label htmlFor="suspendu" className="text-sm">Compte suspendu</label>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListeUtilisateurs;