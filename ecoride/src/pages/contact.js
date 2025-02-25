import React from "react";

const ContactUs = () => {
  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Contactez-nous</h1>
      <p className="mb-6">
        Nous serions ravis de vous entendre! Si vous avez des questions, des
        suggestions ou des préoccupations, n'hésitez pas à nous contacter.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Informations de contact</h2>
        <p>Email: support@ecoride.com</p>
        <p>Téléphone: +33 1 23 45 67 89</p>
        <p>Adresse: 123 Rue de l'Écologie, 75001 Paris, France</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Formulaire de contact</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Nom:</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Message:</label>
            <textarea
              name="message"
              required
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
