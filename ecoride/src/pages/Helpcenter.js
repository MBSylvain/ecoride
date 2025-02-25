import React from "react";

const HelpCenter = () => {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Centre d'aide</h1>
      <p className="mb-6">
        Bienvenue au centre d'aide d'EcoRide. Trouvez des réponses à vos
        questions et obtenez de l'aide pour utiliser notre service de
        covoiturage.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Questions fréquentes</h2>
        <ul className="list-disc list-inside">
          <li className="mb-2">
            <strong>Comment puis-je m'inscrire?</strong>
            <p>
              Pour vous inscrire, cliquez sur le bouton "S'inscrire" en haut à
              droite de la page d'accueil et suivez les instructions.
            </p>
          </li>
          <li className="mb-2">
            <strong>Comment trouver un trajet?</strong>
            <p>
              Utilisez la barre de recherche sur la page d'accueil pour entrer
              votre point de départ et votre destination, puis cliquez sur
              "Rechercher".
            </p>
          </li>
          <li className="mb-2">
            <strong>Comment contacter un conducteur?</strong>
            <p>
              Une fois que vous avez trouvé un trajet, cliquez sur le profil du
              conducteur pour voir ses coordonnées et le contacter directement.
            </p>
          </li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Support technique</h2>
        <p>
          Si vous rencontrez des problèmes techniques, veuillez contacter notre
          support technique à l'adresse suivante :{" "}
          <a href="mailto:support@ecoride.com" className="text-blue-500">
            support@ecoride.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Autres questions</h2>
        <p>
          Pour toute autre question, veuillez remplir le formulaire de contact
          sur notre page{" "}
          <a href="/contact-us" className="text-blue-500">
            Contactez-nous
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
