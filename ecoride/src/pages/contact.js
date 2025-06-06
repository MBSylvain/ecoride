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
        {success && (
          <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>
        )}
        {errors.length > 0 && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nom:</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Message:</label>
            <textarea
              name="message"
              required
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
