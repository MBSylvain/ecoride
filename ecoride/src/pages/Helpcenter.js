import React from "react";

const FAQCard = ({ question, answer }) => (
  <div className="p-4 transition-all bg-white border border-transparent rounded-lg shadow-md hover:border-blue-500">
    <h3 className="text-lg font-medium text-gray-800">{question}</h3>
    <p className="mt-2 text-gray-600">{answer}</p>
  </div>
);

const HelpCenter = () => {
  return (
    <div className="min-h-screen p-8 font-sans bg-gray-50">
      <header className="mb-10">
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">Centre d'aide</h1>
        <p className="text-lg text-gray-700">
          Bienvenue au centre d'aide d'EcoRide. Trouvez des réponses à vos questions et obtenez de l'aide pour utiliser notre service de covoiturage.
        </p>
      </header>

      <section className="mb-12 w-30">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Questions fréquentes</h2>
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-1/2 md:w-1/3">
            <FAQCard
              question="Comment puis-je m'inscrire?"
              answer="Pour vous inscrire, cliquez sur le bouton 'S'inscrire' en haut à droite de la page d'accueil et suivez les instructions."
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3">
            <FAQCard
              question="Comment trouver un trajet?"
              answer="Utilisez la barre de recherche sur la page d'accueil pour entrer votre point de départ et votre destination, puis cliquez sur 'Rechercher'."
            />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3">
            <FAQCard
              question="Comment contacter un conducteur?"
              answer="Une fois que vous avez trouvé un trajet, cliquez sur le profil du conducteur pour voir ses coordonnées et le contacter directement."
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Support technique</h2>
        <p className="text-gray-700">
          Si vous rencontrez des problèmes techniques, veuillez contacter notre support technique à l'adresse suivante :{" "}
          <a href="mailto:support@ecoride.com" className="text-blue-600 hover:underline">
            support@ecoride.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Autres questions</h2>
        <p className="text-gray-700">
          Pour toute autre question, veuillez remplir le formulaire de contact sur notre page{" "}
          <a href="/contact-us" className="text-blue-600 hover:underline">
            Contactez-nous
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default HelpCenter;