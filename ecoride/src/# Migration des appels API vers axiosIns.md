Voici un tableau listant les principaux appels API de ton projet, avec la nouvelle version utilisant l’URL publique :
https://api-ecride-production.up.railway.app/Controllers/

Fichier / Action	Ancienne requête (local)	Nouvelle requête (prod)
Userinfo.js	axios.get("http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=...")	axiosInstance.get("UtilisateurController.php?utilisateur_id=...")
VoitureUser.js / Carinfo.js	axios.get("http://localhost/api/Controllers/VoitureController.php?utilisateur_id=...")	axiosInstance.get("VoitureController.php?utilisateur_id=...")
TrajetUser.js / VisualiserTrajets.js / Trajetinfo.js	axios.get("http://localhost/api/Controllers/TrajetController.php?utilisateur_id=...")	axiosInstance.get("TrajetController.php?utilisateur_id=...")
TrajetUser.js / VisualiserTrajets.js / Trajetinfo.js	axios.delete("http://localhost/api/Controllers/TrajetController.php?trajet_id=...")	axiosInstance.delete("TrajetController.php?trajet_id=...")
CreateTrajetModal.js / CreateTrajetModal.js	axios.get("http://localhost/api/Controllers/VoitureController.php?utilisateur_id=...")	axiosInstance.get("VoitureController.php?utilisateur_id=...")
CreateTrajetModal.js / CreateTrajetModal.js	axios.post("http://localhost/api/Controllers/TrajetController.php", data)	axiosInstance.post("TrajetController.php", data)
EditTrajetModal.js	axios.put("http://localhost/api/Controllers/TrajetController.php", data)	axiosInstance.put("TrajetController.php", data)
Reservations.js / ReservationUser.js	axios.get("http://localhost/api/Controllers/ReservationController.php?utilisateur_id=...")	axiosInstance.get("ReservationController.php?utilisateur_id=...")
Reservations.js / ReservationUser.js	axios.get("http://localhost/api/Controllers/ReservationController.php?trajet_id=...")	axiosInstance.get("ReservationController.php?trajet_id=...")
Reservations.js / ReservationUser.js	axios.post("http://localhost/api/Controllers/ReservationController.php", data)	axiosInstance.post("ReservationController.php", data)
Reservations.js / ReservationUser.js	axios.delete("http://localhost/api/Controllers/ReservationController.php?reservation_id=...")	axiosInstance.delete("ReservationController.php?reservation_id=...")
AjouterAvisModal.js / VisualiserAvis.js	axios.post("http://localhost/api/Controllers/AvisController.php", data)	axiosInstance.post("AvisController.php", data)
AjouterAvisModal.js / VisualiserAvis.js	axios.get("http://localhost/api/Controllers/AvisController.php?trajet_id=...")	axiosInstance.get("AvisController.php?trajet_id=...")
HistoriqueOperations.js	axios.get("http://localhost/api/Controllers/CreditController.php?utilisateur_id=...")	axiosInstance.get("CreditController.php?utilisateur_id=...")
PreferencesConducteur.js	axios.get("http://localhost/api/Controllers/PreferenceConducteurController.php?utilisateur_id=...")	axiosInstance.get("PreferenceConducteurController.php?utilisateur_id=...")
PreferencesConducteur.js	axios.delete("http://localhost/api/Controllers/PreferenceConducteurController.php?preference_id=...")	axiosInstance.delete("PreferenceConducteurController.php?preference_id=...")
logout.js / Header.js	axios.post("http://localhost/api/Controllers/checkAuth.php", data)	axiosInstance.post("checkAuth.php", data)
register.js	axios.post("http://localhost/api/Controllers/UtilisateurController.php", data)	axiosInstance.post("UtilisateurController.php", data)
SearchPage.js	axios.get("http://localhost/api/Controllers/TrajetController.php?...")	axiosInstance.get("TrajetController.php?...")
Validations.js	axios.get("http://localhost/api/Controllers/ReservationController.php?action=to_validate")	axiosInstance.get("ReservationController.php?action=to_validate")
Statistiques.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=vue_admin")	axiosInstance.get("StatistiqueController.php?action=vue_admin")
StatistiquesTrajets.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=trajets")	axiosInstance.get("StatistiqueController.php?action=trajets")
StatistiquesCredits.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=credits")	axiosInstance.get("StatistiqueController.php?action=credits")
StatistiquesAvis.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=avis")	axiosInstance.get("StatistiqueController.php?action=avis")
StatistiquesVoitures.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=voitures")	axiosInstance.get("StatistiqueController.php?action=voitures")
StatistiquesEmployes.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=employes")	axiosInstance.get("StatistiqueController.php?action=employes")
StatistiquesReservations.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=reservations")	axiosInstance.get("StatistiqueController.php?action=reservations")
StatistiquesUtilisateurs.js	axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=utilisateurs")	axiosInstance.get("StatistiqueController.php?action=utilisateurs")
AdminAvis.js / GestionAvis.js	axios.get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php")	axiosInstance.get("Administrateur/AvisAdminController.php")
AdminAvis.js / GestionAvis.js	axios.post("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", data)	axiosInstance.post("Administrateur/AvisAdminController.php", data)
AdminAvis.js / GestionAvis.js	axios.put("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", data)	axiosInstance.put("Administrateur/AvisAdminController.php", data)
AdminAvis.js / GestionAvis.js	axios.delete("http://localhost/api/ControllersAdministrateur/AvisAdminController.php?id=...")	axiosInstance.delete("Administrateur/AvisAdminController.php?id=...")
TrajetsProblemes.js	axios.get("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php")	axiosInstance.get("Administrateur/SignalementAdminController.php")
TrajetsProblemes.js	axios.get("http://localhost/api/Controllers/TrajetController.php?trajet_id=...")	axiosInstance.get("TrajetController.php?trajet_id=...")
TrajetsProblemes.js	axios.get("http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=...")	axiosInstance.get("UtilisateurController.php?utilisateur_id=...")
CreerSignalement.js	axios.post("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", data)	axiosInstance.post("Administrateur/SignalementAdminController.php", data)
TaitementSignalement.js	axios.get("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php")	axiosInstance.get("Administrateur/SignalementAdminController.php")
TaitementSignalement.js	axios.put("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", data)	axiosInstance.put("Administrateur/SignalementAdminController.php", data)
Remarque :

Pour chaque appel, la nouvelle version utilise l’instance axios configurée avec la baseURL :
https://api-ecride-production.up.railway.app/Controllers/
Adapte les paramètres (?utilisateur_id=..., etc.) selon le besoin de chaque appel.
Pour la liste complète et à jour, consulte # Migration des appels API vers axiosIns.md.

GPT-4.1 • 0x