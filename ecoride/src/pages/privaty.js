import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container flex flex-col gap-4 p-4 mx-auto font-sans md:flex-row md:p-6">
      <div className="flex items-center justify-center flex-1 mb-4 text-center md:text-left">
        <div>
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">Politique de confidentialité</h1>
          <p className="mb-4 text-base md:text-lg">
            Chez EcoRide, nous prenons votre vie privée au sérieux. Cette politique
            de confidentialité explique quelles informations nous collectons,
            comment nous les utilisons et comment nous les protégeons.
          </p>
        </div>
      </div>
      <div
        className="flex-1 my-2 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm md:my-4 hover:border-blue-400 hover:shadow-md"
      >
        <div className="p-3 mb-2 md:p-4">
          <h2 className="mb-1 text-xl font-semibold md:text-2xl">
            Informations que nous collectons
          </h2>
          <p className="text-sm md:text-base">Nous collectons les informations suivantes :</p>
          <ul className="list-disc list-inside">
            <li className="mb-1 text-sm md:text-base">
              Informations personnelles telles que votre nom, adresse email et
              numéro de téléphone.
            </li>
            <li className="mb-1 text-sm md:text-base">
              Informations sur votre utilisation de notre service, telles que les
              trajets que vous réservez ou proposez.
            </li>
            <li className="mb-1 text-sm md:text-base">
              Données de localisation pour améliorer nos services de covoiturage.
            </li>
          </ul>
        </div>

        <div className="p-3 mb-4 md:p-4">
          <h2 className="mb-1 text-xl font-semibold md:text-2xl">
            Comment nous utilisons vos informations
          </h2>
          <p className="text-sm md:text-base">Nous utilisons vos informations pour :</p>
          <ul className="list-disc list-inside">
            <li className="mb-1 text-sm md:text-base">
              Fournir et améliorer notre service de covoiturage.
            </li>
            <li className="mb-1 text-sm md:text-base">
              Communiquer avec vous concernant votre compte ou vos trajets.
            </li>
            <li className="mb-1 text-sm md:text-base">
              Personnaliser votre expérience sur notre site.
            </li>
          </ul>
        </div>

        <div className="p-3 mb-2 md:p-4">
          <h2 className="mb-1 text-xl font-semibold md:text-2xl">
            Comment nous protégeons vos informations
          </h2>
          <p className="text-sm md:text-base">
            Nous mettons en œuvre des mesures de sécurité pour protéger vos
            informations personnelles contre l'accès non autorisé, la
            modification, la divulgation ou la destruction.
          </p>
        </div>

        <div className="p-3 mb-2 md:p-4">
          <h2 className="mb-1 text-xl font-semibold md:text-2xl">Vos droits</h2>
          <p className="text-sm md:text-base">
            Vous avez le droit d'accéder à vos informations personnelles, de les
            corriger ou de les supprimer. Pour exercer ces droits, veuillez nous
            contacter à l'adresse suivante :{" "}
            <a href="mailto:privacy@ecoride.com" className="text-blue-500 break-all">
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
