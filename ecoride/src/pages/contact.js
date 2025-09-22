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
    <div className="flex flex-col gap-10 p-4 font-sans lg:flex-row lg:gap-40 md:p-8 lg:p-10">
      <div className="flex flex-col items-center w-full mb-8 text-center lg:w-1/3 lg:mb-0">
        <h1 className="mb-4 text-2xl font-bold md:text-3xl">Contactez-nous</h1>
        <p className="mb-6 text-base md:text-lg">
          Nous serions ravis de vous entendre! Si vous avez des questions, des
          suggestions ou des préoccupations, n'hésitez pas à nous contacter.
        </p>
        <div className="mb-8">
          <h2 className="mb-2 text-xl font-semibold md:text-2xl">Informations de contact</h2>
          <p className="text-sm md:text-base">Email: support@ecoride.com</p>
          <p className="text-sm md:text-base">Téléphone: +33 1 23 45 67 89</p>
          <p className="text-sm md:text-base">Adresse: 123 Rue de l'Écologie, 75001 Paris, France</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <h2 className="mb-4 text-xl font-semibold md:text-2xl">Formulaire de contact</h2>
        {success && (
          <div className="w-full max-w-lg p-4 mb-4 text-green-700 bg-green-100 rounded">{success}</div>
        )}
        {errors.length > 0 && (
          <div className="w-full max-w-lg p-4 mb-4 text-red-700 bg-red-100 rounded">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}
        <form
          className="w-full max-w-lg p-4 mb-4 bg-white border border-gray-300 rounded-lg shadow-2xl md:p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block mb-2 text-sm md:text-base">Nom:</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 text-sm border border-gray-300 rounded md:text-base"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm md:text-base">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 text-sm border border-gray-300 rounded md:text-base"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm md:text-base">Message:</label>
            <textarea
              name="message"
              required
              className="w-full p-2 text-sm border border-gray-300 rounded md:text-base"
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 md:w-auto"
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
