import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = [];
    if (!formData.name) errs.push("Le nom est requis");
    if (!formData.email) errs.push("L'email est requis");
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.push("Format d'email invalide");
    if (!formData.message) errs.push("Le message est requis");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors([]);
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Ici, tu peux envoyer les données à ton backend si besoin
    setTimeout(() => {
      setSuccess("Votre message a été envoyé avec succès !");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl p-8 mx-auto mb-8 font-sans bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-center text-primary-100">Contactez-nous</h1>
      <div className="mb-8 text-center">
        <p className="mb-4 text-base leading-relaxed text-gray-700">
          Nous serions ravis de vous entendre ! Si vous avez des questions, des suggestions ou des préoccupations, n'hésitez pas à nous contacter.
        </p>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold text-primary-100">Informations de contact</h2>
          <p className="text-base text-gray-700">Email : <span className="font-semibold text-customGreen2-100">support@ecoride.com</span></p>
          <p className="text-base text-gray-700">Téléphone : <span className="font-semibold text-customGreen2-100">+33 1 23 45 67 89</span></p>
          <p className="text-base text-gray-700">Adresse : <span className="font-semibold text-customGreen2-100">123 Rue de l'Écologie, 75001 Paris, France</span></p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">Formulaire de contact</h2>
        {success && (
          <div className="w-full max-w-lg p-4 mb-4 text-white rounded-md shadow bg-customGreen2-100">
            {success}
          </div>
        )}
        {errors.length > 0 && (
          <div className="w-full max-w-lg p-4 mb-4 text-white bg-red-500 rounded-md shadow">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}
        <form
          className="w-full max-w-lg p-6 mb-4 bg-white border border-gray-100 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Nom</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-primary-100">Message</label>
            <textarea
              name="message"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGreen2-100"
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white transition-all duration-200 rounded-md shadow-md bg-primary-100 hover:bg-customGreen2-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
