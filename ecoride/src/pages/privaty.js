import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl p-8 mx-auto mb-8 font-sans bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-center text-primary-100">
        Politique de confidentialité
      </h1>
      <p className="mb-8 text-base leading-relaxed text-center text-gray-700">
        Chez EcoRide, nous prenons votre vie privée au sérieux. Cette politique de
        confidentialité explique quelles informations nous collectons, comment nous
        les utilisons et comment nous les protégeons.
      </p>
      <div className="p-6 mb-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
        <h2 className="mb-2 text-xl font-semibold text-primary-100">
          Informations que nous collectons
        </h2>
        <ul className="pl-6 text-gray-700 list-disc">
          <li>
            Informations personnelles telles que votre nom, adresse email et numéro
            de téléphone.
          </li>
          <li>
            Informations sur votre utilisation de notre service, telles que les
            trajets que vous réservez ou proposez.
          </li>
          <li>
            Données de localisation pour améliorer nos services de covoiturage.
          </li>
        </ul>
      </div>
      <div className="p-6 mb-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
        <h2 className="mb-2 text-xl font-semibold text-primary-100">
          Comment nous utilisons vos informations
        </h2>
        <ul className="pl-6 text-gray-700 list-disc">
          <li>
            Fournir et améliorer notre service de covoiturage.
          </li>
          <li>
            Communiquer avec vous concernant votre compte ou vos trajets.
          </li>
          <li>
            Personnaliser votre expérience sur notre site.
          </li>
        </ul>
      </div>
      <div className="p-6 mb-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
        <h2 className="mb-2 text-xl font-semibold text-primary-100">
          Comment nous protégeons vos informations
        </h2>
        <p className="text-gray-700">
          Nous mettons en œuvre des mesures de sécurité pour protéger vos
          informations personnelles contre l'accès non autorisé, la modification,
          la divulgation ou la destruction.
        </p>
      </div>
      <div className="p-6 mb-6 border border-gray-100 rounded-lg shadow bg-customGrey-100">
        <h2 className="mb-2 text-xl font-semibold text-primary-100">Vos droits</h2>
        <p className="text-gray-700">
          Vous avez le droit d'accéder à vos informations personnelles, de les
          corriger ou de les supprimer. Pour exercer ces droits, veuillez nous
          contacter à l'adresse suivante :{" "}
          <a
            href="mailto:privacy@ecoride.com"
            className="font-semibold break-all text-customGreen2-100 hover:underline"
          >
            privacy@ecoride.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
