import React, { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/map.jpg";


const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    ville_depart: "",
    ville_arrivee: "",
    date_depart: "",
  });
  const [trajets, setTrajets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleReservation = (trajetId) => {
  navigate(`/reservetrajet/${trajetId}`);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      queryParams.append("action", "SEARCH"); 
      if (searchParams.ville_depart)
        queryParams.append("ville_depart", searchParams.ville_depart);
      if (searchParams.ville_arrivee)
        queryParams.append("ville_arrivee", searchParams.ville_arrivee);
      if (searchParams.date_depart)
        queryParams.append("date_depart", searchParams.date_depart);

      const response = await axios.get(
        `http://localhost/api/Controllers/TrajetController.php?${queryParams.toString()}`,
        { withCredentials: true }
      );

      if (response.data && typeof response.data === "object") {
        if (response.data.trajets) {
          setTrajets(
            Array.isArray(response.data.trajets) ? response.data.trajets : []
          );
        } else {
          setTrajets(Array.isArray(response.data) ? response.data : []);
        }
      } else {
        setTrajets([]);
      }
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setError(
        "Une erreur s'est produite lors de la recherche. Veuillez réessayer."
      );
      setTrajets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.split(" ")[0]);
    return date.toLocaleDateString("fr-FR");
  };

  // Extraire l'heure de la date
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split(" ");
    return parts.length > 1 ? parts[1].substring(0, 5) : "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Bloc de recherche */}
      <div
        className="w-full p-8 mb-8 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full max-w-4xl p-8 mx-auto bg-white bg-opacity-75 rounded-lg shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Rechercher un trajet</h1>
          <form
            onSubmit={handleSearch}
            className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4"
          >
            <input
              type="text"
              name="ville_depart"
              value={searchParams.ville_depart}
              onChange={handleChange}
              placeholder="Ville de départ"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="ville_arrivee"
              value={searchParams.ville_arrivee}
              onChange={handleChange}
              placeholder="Ville d'arrivée"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              name="date_depart"
              value={searchParams.date_depart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Recherche..." : "Rechercher"}
            </button>
          </form>
        </div>
      </div>

      {/* Résultats de recherche */}
      <div className="container px-4 py-8 mx-auto mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Trajets disponibles</h2>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="inline-block w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="ml-2">Recherche en cours...</span>
          </div>
        ) : hasSearched && trajets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">
              Aucun trajet ne correspond à votre recherche.
            </p>
            <p className="mt-2 text-gray-500">
              Essayez d'autres critères ou dates de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trajets.map((trajet) => (
              <div
                key={trajet.trajet_id}
                className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDate(trajet.date_depart)}
                    </p>
                    <p className="font-medium">
                      {formatTime(trajet.date_depart)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-100">
                      {trajet.prix} €
                    </p>
                    <p className="text-sm text-gray-500">
                      {trajet.nombre_places} place(s)
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  <div className="mr-4">
                    <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"> <p className="m-2">Départ</p></div>
                    <div className="w-0.5 h-10 mx-auto bg-gray-300"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full"> <p className="m-2">Arrivée</p></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{trajet.ville_depart}</p>
                    <p className="mt-8 font-medium">{trajet.ville_arrivee}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
  onClick={() => handleReservation(trajet.trajet_id)}
              className="w-full px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 md:w-auto"
>
  Réserver
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
