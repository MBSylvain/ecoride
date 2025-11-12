import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/map.jpg";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    ville_depart: "",
    ville_arrivee: "",
    date_depart: "",
    motorisation: "",
  });
  const [trajets, setTrajets] = useState([]);
  const [suggestedTrajets, setSuggestedTrajets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleReservation = (trajetId) => {
    navigate(`/reservetrajet/${trajetId}`);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("action", "SEARCH");
      if (searchParams.ville_depart)
        queryParams.append("ville_depart", searchParams.ville_depart);
      if (searchParams.ville_arrivee)
        queryParams.append("ville_arrivee", searchParams.ville_arrivee);
      if (searchParams.date_depart)
        queryParams.append("date_depart", searchParams.date_depart);
      if (searchParams.prix_max)
        queryParams.append("prix_max", searchParams.prix_max);
      if (searchParams.duree_max)
        queryParams.append("duree_max", searchParams.duree_max);
      if (searchParams.note_min)
        queryParams.append("note_min", searchParams.note_min);
      if (searchParams.ecologique)
        queryParams.append("ecologique", "1");

      const response = await axios.get(
        `https://api-ecride-production.up.railway.app/api/Controllers/TrajetController.php?${queryParams.toString()}`,
        { withCredentials: true }
      );

      if (response.data && typeof response.data === "object") {
        if (
          response.data.success === false &&
          response.data.suggestions &&
          Object.keys(response.data.suggestions).length > 0
        ) {
          setTrajets([]);
          setSuggestedTrajets(Object.values(response.data.suggestions));
        } else if (response.data.data && response.data.data.trajets) {
          setTrajets(Array.isArray(response.data.data.trajets) ? response.data.data.trajets : []);
          setSuggestedTrajets([]);
        } else {
          setTrajets(Array.isArray(response.data.data) ? response.data.data : []);
          setSuggestedTrajets([]);
        }
      } else {
        setTrajets([]);
        setSuggestedTrajets([]);
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la recherche. Veuillez réessayer.");
      setTrajets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString.split(" ")[0]);
    return date.toLocaleDateString("fr-FR");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split(" ");
    return parts.length > 1 ? parts[1].substring(0, 5) : "";
  };

  const getTrajetDuration = (heure_depart, heure_arrivee) => {
    if (!heure_depart || !heure_arrivee) return null;
    const [h1, m1] = heure_depart.split(':').map(Number);
    const [h2, m2] = heure_arrivee.split(':').map(Number);
    let minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (minutes < 0) minutes += 24 * 60;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  const suggestionsArray = Array.isArray(suggestedTrajets)
    ? suggestedTrajets
    : suggestedTrajets && typeof suggestedTrajets === "object"
      ? Object.values(suggestedTrajets)
      : [];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      {/* Bloc de recherche */}
      <div
        className="w-full p-8 mb-8 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-full max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg bg-opacity-80">
          <h1 className="mb-4 text-2xl font-bold text-primary-100">Rechercher un trajet</h1>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <input
              type="text"
              name="ville_arrivee"
              value={searchParams.ville_arrivee}
              onChange={handleChange}
              placeholder="Ville d'arrivée"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <input
              type="date"
              name="date_depart"
              value={searchParams.date_depart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <input
              type="number"
              name="prix_max"
              value={searchParams.prix_max || ""}
              onChange={handleChange}
              placeholder="Prix max (€)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <input
              type="number"
              name="duree_max"
              value={searchParams.duree_max || ""}
              onChange={handleChange}
              placeholder="Durée max (h)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <input
              type="number"
              name="note_min"
              value={searchParams.note_min || ""}
              onChange={handleChange}
              placeholder="Note min conducteur"
              min={1}
              max={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                name="ecologique"
                checked={searchParams.ecologique || false}
                onChange={handleChange}
                className="mr-2 accent-customGreen2-100"
              />
              <span className="text-sm text-primary-100">Véhicule écologique (électrique)</span>
            </label>
            <button
              type="submit"
              className="w-full px-6 py-3 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100 md:w-auto"
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
          <h2 className="text-xl font-bold text-primary-100">Trajets disponibles</h2>
        </div>

        {error && (
          <div className="p-4 mb-6 text-white bg-red-500 rounded-md shadow">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="inline-block w-8 h-8 border-4 rounded-full border-primary-100 border-t-transparent animate-spin"></div>
            <span className="ml-2 text-gray-600">Recherche en cours...</span>
          </div>
        ) : hasSearched && trajets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">
              Aucun trajet ne correspond à votre recherche.
            </p>
            <p className="mt-2 text-gray-500">
              Essayez d'autres critères ou dates de recherche.
            </p>
            {/* Suggestions de trajets alternatifs */}
            {suggestionsArray.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-primary-100">Suggestions de trajets :</h3>
                <ul className="mt-2">
                  {suggestedTrajets.map((trajet) => (
                    <li key={trajet.trajet_id} className="py-2 border-b">
                      <p className="font-medium">{trajet.ville_depart} → {trajet.ville_arrivee}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(trajet.date_depart)} - {formatTime(trajet.date_depart)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Conducteur : {trajet.conducteur_prenom} {trajet.conducteur_nom} ({trajet.conducteur_email})
                      </p>
                      <button
                        className="px-4 py-2 mt-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
                        onClick={() => handleReservation(trajet.trajet_id)}
                      >
                        Réserver ce trajet
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trajets.map((trajet) => (
              <div
                key={trajet.trajet_id}
                className="p-6 transition-shadow bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg"
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

                {/* Infos conducteur */}
                <div className="flex items-center mb-2">
                  {trajet.photo && (
                    <img
                      src={trajet.photo}
                      alt="Conducteur"
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                  )}
                  <span className="ml-2 text-gray-500">Conducteur : </span>
                  <span className="m-10 font-semibold text-primary-100">{trajet.conducteur_pseudo}</span>
                  {trajet.note_conducteur && (
                    <span className="ml-2 text-yellow-500">
                      ★ {Number(trajet.note_conducteur).toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  {trajet.marque && (
                    <span>
                      <strong>Véhicule :</strong> {trajet.marque}
                    </span>
                  )}
                </div>
                {(trajet.energie === "electrique" || trajet.energie === "hybride") && (
                  <div className="flex items-center mb-2">
                    <span
                      title="Véhicule écologique"
                      className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded text-customGreen2-100 bg-customGrey-100"
                    >
                      Écologique
                    </span>
                  </div>
                )}

                <div className="flex mb-4">
                  <div className="m-5 text-sm text-gray-600">
                    {trajet.heure_depart && trajet.heure_arrivee && (
                      <span>
                        <strong>Durée :</strong> {getTrajetDuration(trajet.heure_depart, trajet.heure_arrivee)}
                      </span>
                    )}
                  </div>
                  <div className="mr-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-customGreen2-100">
                      <p className="m-2 text-xs text-primary-100">Départ</p>
                    </div>
                    <div className="w-0.5 h-10 mx-auto bg-gray-300"></div>
                    <div className="w-2 h-2 rounded-full bg-customPink-100">
                      <p className="m-2 text-xs text-primary-100">Arrivée</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary-100">{trajet.ville_depart}</p>
                    <p className="mt-8 font-medium text-primary-100">{trajet.ville_arrivee}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleReservation(trajet.trajet_id)}
                    className="w-full px-6 py-3 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100 md:w-auto"
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
