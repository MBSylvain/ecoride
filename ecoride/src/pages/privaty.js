import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>
      <p className="mb-6">
        Chez EcoRide, nous prenons votre vie privée au sérieux. Cette politique
        de confidentialité explique quelles informations nous collectons,
        comment nous les utilisons et comment nous les protégeons.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Informations que nous collectons
        </h2>
        <p>Nous collectons les informations suivantes :</p>
        <ul className="list-disc list-inside">
          <li className="mb-2">
            Informations personnelles telles que votre nom, adresse email et
            numéro de téléphone.
          </li>
          <li className="mb-2">
            Informations sur votre utilisation de notre service, telles que les
            trajets que vous réservez ou proposez.
          </li>
          <li className="mb-2">
            Données de localisation pour améliorer nos services de covoiturage.
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Comment nous utilisons vos informations
        </h2>
        <p>Nous utilisons vos informations pour :</p>
        <ul className="list-disc list-inside">
          <li className="mb-2">
            Fournir et améliorer notre service de covoiturage.
          </li>
          <li className="mb-2">
            Communiquer avec vous concernant votre compte ou vos trajets.
          </li>
          <li className="mb-2">
            Personnaliser votre expérience sur notre site.
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Comment nous protégeons vos informations
        </h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité pour protéger vos
          informations personnelles contre l'accès non autorisé, la
          modification, la divulgation ou la destruction.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Vos droits</h2>
        <p>
          Vous avez le droit d'accéder à vos informations personnelles, de les
          corriger ou de les supprimer. Pour exercer ces droits, veuillez nous
          contacter à l'adresse suivante :{" "}
          <a href="mailto:privacy@ecoride.com" className="text-blue-500">
            privacy@ecoride.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
