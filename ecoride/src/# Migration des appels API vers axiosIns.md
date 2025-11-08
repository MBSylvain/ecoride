# Migration des appels API vers axiosInstance

Ce tableau présente la correspondance entre les anciens appels API (en local) et la nouvelle forme à utiliser avec l’instance Axios centralisée (`axiosInstance`) pointant vers l’URL Railway :  
`https://api-ecride-production.up.railway.app/api/Controllers/`

---

| Fichier / Action                                      | Ancienne requête                                                                                   | Nouvelle requête avec axiosInstance                      |
|-------------------------------------------------------|----------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| **AdminAvis.js**                                      | axios.get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php")                | axiosInstance.get("Administrateur/AvisAdminController.php") |
|                                                       | axios.post("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", data)         | axiosInstance.post("Administrateur/AvisAdminController.php", data) |
|                                                       | axios.put("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", data)          | axiosInstance.put("Administrateur/AvisAdminController.php", data) |
|                                                       | axios.delete("http://localhost/api/ControllersAdministrateur/AvisAdminController.php?id=...")      | axiosInstance.delete("Administrateur/AvisAdminController.php?id=...") |
| **GestionAvis.js**                                    | axios.get("http://localhost/api/ControllersAdministrateur/AvisAdminController.php")                | axiosInstance.get("Administrateur/AvisAdminController.php") |
|                                                       | axios.put("http://localhost/api/ControllersAdministrateur/AvisAdminController.php", data)          | axiosInstance.put("Administrateur/AvisAdminController.php", data) |
| **TrajetsProblemes.js**                               | axios.get("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php")         | axiosInstance.get("Administrateur/SignalementAdminController.php") |
|                                                       | axios.get("http://localhost/api/Controllers/TrajetController.php?trajet_id=...")                  | axiosInstance.get("TrajetController.php?trajet_id=...")   |
|                                                       | axios.get("http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=...")         | axiosInstance.get("UtilisateurController.php?utilisateur_id=...") |
|                                                       | axios.get("http://localhost/api/Controllers/VoitureController.php?voiture_id=...")                | axiosInstance.get("VoitureController.php?voiture_id=...") |
| **ListeUtilisateurs.js**                              | axios.get("http://localhost/api/ControllersAdministrateur/UtilisateurAdminController.php")         | axiosInstance.get("Administrateur/UtilisateurAdminController.php") |
| **StatistiquesAvis.js**                               | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=avis")               | axiosInstance.get("StatistiqueController.php?action=avis") |
| **StatistiquesCredits.js**                            | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=credits")            | axiosInstance.get("StatistiqueController.php?action=credits") |
| **StatistiquesEmployes.js**                           | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=employes")           | axiosInstance.get("StatistiqueController.php?action=employes") |
| **StatistiquesReservations.js**                       | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=reservations")       | axiosInstance.get("StatistiqueController.php?action=reservations") |
| **StatistiquesTrajets.js**                            | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=trajets")            | axiosInstance.get("StatistiqueController.php?action=trajets") |
| **StatistiquesUtilisateurs.js**                       | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=utilisateurs")       | axiosInstance.get("StatistiqueController.php?action=utilisateurs") |
| **StatistiquesVoitures.js**                           | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=voitures")           | axiosInstance.get("StatistiqueController.php?action=voitures") |
| **Statistiques.js**                                   | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=vue_admin")          | axiosInstance.get("StatistiqueController.php?action=vue_admin") |
|                                                       | axios.get("http://localhost/api/Controllers/StatistiqueController.php?action=covoiturages_par_jour") | axiosInstance.get("StatistiqueController.php?action=covoiturages_par_jour") |
| **ReservationUser.js / Reservations.js**              | axios.get("http://localhost/api/Controllers/ReservationController.php?utilisateur_id=...")        | axiosInstance.get("ReservationController.php?utilisateur_id=...") |
| **CreerSignalement.js**                               | axios.post("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", data)  | axiosInstance.post("Administrateur/SignalementAdminController.php", data) |
| **TaitementSignalement.js**                           | axios.get("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php")         | axiosInstance.get("Administrateur/SignalementAdminController.php") |
|                                                       | axios.put("http://localhost/api/ControllersAdministrateur/SignalementAdminController.php", data)   | axiosInstance.put("Administrateur/SignalementAdminController.php", data) |
| **CreateTrajetModal.js / features/CreateTrajetModal.js** | axios.get("http://localhost/api/Controllers/VoitureController.php?utilisateur_id=...")            | axiosInstance.get("VoitureController.php?utilisateur_id=...") |
|                                                       | axios.post("http://localhost/api/Controllers/TrajetController.php", data)                         | axiosInstance.post("TrajetController.php", data)           |
| **EditTrajetModal.js**                                | axios.put("http://localhost/api/Controllers/TrajetController.php", data)                          | axiosInstance.put("TrajetController.php", data)            |
| **TrajetUser.js / VisualiserTrajets.js / features/Trajetinfo.js** | axios.get("http://localhost/api/Controllers/TrajetController.php?utilisateur_id=...")             | axiosInstance.get("TrajetController.php?utilisateur_id=...") |
|                                                       | axios.delete("http://localhost/api/Controllers/TrajetController.php?trajet_id=...")               | axiosInstance.delete("TrajetController.php?trajet_id=...") |
|                                                       | axios.get("http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=...")         | axiosInstance.get("UtilisateurController.php?utilisateur_id=...") |
|                                                       | axios.get("http://localhost/api/Controllers/ReservationController.php?trajet_id=...")             | axiosInstance.get("ReservationController.php?trajet_id=...") |
| **HistoriqueOperations.js**                           | axios.get("http://localhost/api/Controllers/CreditController.php?utilisateur_id=...")             | axiosInstance.get("CreditController.php?utilisateur_id=...") |
| **PreferencesConducteur.js**                          | axios.get("http://localhost/api/Controllers/PreferenceConducteurController.php?utilisateur_id=...") | axiosInstance.get("PreferenceConducteurController.php?utilisateur_id=...") |
|                                                       | axios.delete("http://localhost/api/Controllers/PreferenceConducteurController.php?preference_id=...") | axiosInstance.delete("PreferenceConducteurController.php?preference_id=...") |
| **Userinfo.js**                                       | axios.get("http://localhost/api/Controllers/UtilisateurController.php?utilisateur_id=...")         | axiosInstance.get("UtilisateurController.php?utilisateur_id=...") |
| **VoitureUser.js / features/Carinfo.js**              | axios.get("http://localhost/api/Controllers/VoitureController.php?utilisateur_id=...")            | axiosInstance.get("VoitureController.php?utilisateur_id=...") |
| **logout.js**                                         | axios.post("http://localhost/api/Controllers/checkAuth.php", data)                                | axiosInstance.post("checkAuth.php", data)                  |
| **SearchPage.js**                                     | axios.get("http://localhost/api/Controllers/TrajetController.php?...")                            | axiosInstance.get("TrajetController.php?...")              |
| **dashreservation.js**                                | axios.get("http://localhost/api/Controllers/CheckAuth.php")                                       | axiosInstance.get("CheckAuth.php")                         |
|                                                       | axios.get("http://localhost/ecoride-apie/Controllers/ReservationController.php?reservation_id=...&utilisateur_id=...") | axiosInstance.get("ReservationController.php?reservation_id=...&utilisateur_id=...") |
| **register.js**                                       | axios.post("http://localhost/api/Controllers/UtilisateurController.php", data)                    | axiosInstance.post("UtilisateurController.php", data)      |
| **Validations.js**                                    | axios.get("http://localhost/api/Controllers/ReservationController.php?action=to_validate")         | axiosInstance.get("ReservationController.php?action=to_validate") |
|                                                       | axios.post("http://localhost/api/Controllers/ReservationController.php", data)                    | axiosInstance.post("ReservationController.php", data)      |
| **AjouterAvisModal.js / VisualiserAvis.js**           | axios.post("http://localhost/api/Controllers/AvisController.php", data)                           | axiosInstance.post("AvisController.php", data)             |
|                                                       | axios.get("http://localhost/api/Controllers/AvisController.php?trajet_id=...")                    | axiosInstance.get("AvisController.php?trajet_id=...")      |
|                                                       | axios.delete("http://localhost/api/Controllers/ReservationController.php?reservation_id=...")      | axiosInstance.delete("ReservationController.php?reservation_id=...") |

---

**Utilisation :**
Dans chaque fichier, importe l’instance centralisée :

```javascript
import axiosInstance from "../api/axiosInstance";
```

et utilise-la pour tous tes appels API.

---