import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // importe l'instance

function TestApi() {
  const [result, setResult] = useState(null);

  const handleTest = async () => {
    try {
      // Utilise axiosInstance pour faire un appel GET
      const response = await axiosInstance.get("UtilisateurController.php?test=1");
      setResult(response.data);
    } catch (err) {
      setResult({ error: `Erreur de connexion à l'API: ${err.message}` });
    }
  };

  return (
    <div>
      <button onClick={handleTest}>Tester connexion API</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default TestApi;