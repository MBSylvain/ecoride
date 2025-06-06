import React, { useState } from "react";

function TestApi() {
  const [result, setResult] = useState(null);

  const handleTest = async () => {
    try {
      const response = await fetch("http://localhost/ecoride-apie/config/Database.php");
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Erreur de connexion à l'API" });
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