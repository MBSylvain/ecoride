import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container flex flex-row gap-4 p-6 font-sans">
      <div className="items-center content-center flex-1 mb-4 text-center">
        <h1 className="mb-2 text-3xl font-bold">Politique de confidentialité</h1>
        <p className="mb-4">
          Chez EcoRide, nous prenons votre vie privée au sérieux. Cette politique
          de confidentialité explique quelles informations nous collectons,
          comment nous les utilisons et comment nous les protégeons.
        </p>
      </div>
      <div
        className="flex-1 my-4 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 hover:shadow-md"
      >
        <div className="p-4 mb-2">
          <h2 className="mb-1 text-2xl font-semibold">
            Informations que nous collectons
          </h2>
          <p>Nous collectons les informations suivantes :</p>
          <ul className="list-disc list-inside">
            <li className="mb-1">
              Informations personnelles telles que votre nom, adresse email et
              numéro de téléphone.
            </li>
            <li className="mb-1">
              Informations sur votre utilisation de notre service, telles que les
              trajets que vous réservez ou proposez.
            </li>
            <li className="mb-1">
              Données de localisation pour améliorer nos services de covoiturage.
            </li>
          </ul>
        </div>

        <div className="p-4 mb-4">
          <h2 className="mb-1 text-2xl font-semibold">
            Comment nous utilisons vos informations
          </h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul className="list-disc list-inside">
            <li className="mb-1">
              Fournir et améliorer notre service de covoiturage.
            </li>
            <li className="mb-1">
              Communiquer avec vous concernant votre compte ou vos trajets.
            </li>
            <li className="mb-1">
              Personnaliser votre expérience sur notre site.
            </li>
          </ul>
        </div>

        <div className="p-4 mb-2">
          <h2 className="mb-1 text-2xl font-semibold">
            Comment nous protégeons vos informations
          </h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité pour protéger vos
            informations personnelles contre l'accès non autorisé, la
            modification, la divulgation ou la destruction.
          </p>
        </div>

        <div className="p-4 mb-2">
          <h2 className="mb-1 text-2xl font-semibold">Vos droits</h2>
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
    </div>
  );
};

export default PrivacyPolicy;
