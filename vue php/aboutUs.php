<?php
// Inclure l'en-tête et la barre de navigation
include_once '../includes/header.php';
include_once '../includes/navbar.php';

// Fonction pour créer des cartes informatives
function createCard($icon, $title, $subtitle, $description) {
    switch($icon) {
        case 'FaCar': $iconClass = 'fas fa-car'; break;
        case 'FaSeedling': $iconClass = 'fas fa-seedling'; break;
        case 'FaCloud': $iconClass = 'fas fa-cloud'; break;
        case 'FaEuroSign': $iconClass = 'fas fa-euro-sign'; break;
        case 'FaMapMarkedAlt': $iconClass = 'fas fa-map-marked-alt'; break;
        case 'FaGlobe': $iconClass = 'fas fa-globe'; break;
        case 'FaUsers': $iconClass = 'fas fa-users'; break;
        case 'FaLeaf': $iconClass = 'fas fa-leaf'; break;
        default: $iconClass = 'fas fa-info-circle';
    }
    
    return '<div class="p-6 text-center bg-white rounded-lg shadow-md">
        <i class="' . $iconClass . ' text-3xl mb-4 text-green-500"></i>
        <h2 class="mb-2 text-xl font-bold">' . htmlspecialchars($title) . '</h2>
        <h3 class="mb-4 text-lg">' . htmlspecialchars($subtitle) . '</h3>
        <p class="text-base">' . htmlspecialchars($description) . '</p>
    </div>';
}
?>

<div class="font-sans leading-relaxed text-gray-800 bg-gray-100">
    <div class="p-8 mx-auto max-w-7xl">
        <!-- En-tête de la page -->
        <div class="mb-12 text-center">
            <h1 class="mb-4 text-3xl font-bold text-forest">À propos d'EcoRide</h1>
            <p class="text-xl">Découvrez notre histoire, notre équipe et notre vision pour un avenir plus vert</p>
        </div>
        
        <!-- Premier bloc -->
        <div class="w-full p-8 mb-8 bg-white rounded-lg shadow-md">
            <div class="flex flex-col items-center md:flex-row">
                <div class="flex flex-col items-center mb-6 md:w-1/3 md:mb-0">
                    <img src="../Assets/logo/logoecov.png" alt="Logo EcoRide" class="w-32 h-24 mb-4" />
                    <p class="text-xl font-bold text-primary-100">10 ans d'expérience</p>
                    <p class="text-lg">Plus de 500 trajets par jour</p>
                </div>
                <div class="flex flex-wrap justify-center md:w-2/3 md:justify-start">
                    <!-- Cartes d'information -->
                    <div class="w-full p-4 md:w-1/2 lg:w-1/3">
                        <?php echo createCard('FaCar', 'Mobilité Partagée', 'Transports plus intelligents', 'Nous proposons une alternative économique et écologique aux déplacements quotidiens.'); ?>
                    </div>
                    <div class="w-full p-4 md:w-1/2 lg:w-1/3">
                        <?php echo createCard('FaSeedling', 'Réduction CO2', 'Impact environnemental', 'Chaque trajet partagé réduit les émissions de carbone et contribue à un monde plus propre.'); ?>
                    </div>
                    <div class="w-full p-4 md:w-1/2 lg:w-1/3">
                        <?php echo createCard('FaEuroSign', 'Économies', 'Réduction des coûts', 'Nos utilisateurs économisent en moyenne 2000€ par an sur leurs frais de transport.'); ?>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Notre histoire -->
        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-6 text-2xl font-semibold text-green-700">Notre Histoire</h2>
            <div class="flex flex-col items-center md:flex-row">
                <div class="mb-6 md:w-1/2 md:mb-0 md:pr-8">
                    <p class="mb-4">
                        Fondée en 2013 par un groupe d'ingénieurs passionnés par la mobilité durable, EcoRide est née d'une 
                        vision simple : rendre les déplacements plus écologiques et plus économiques.
                    </p>
                    <p class="mb-4">
                        Ce qui a commencé comme une petite startup dans un garage s'est transformé en une entreprise
                        innovante présente dans plus de 50 villes en France et en Europe.
                    </p>
                    <p>
                        Aujourd'hui, notre plateforme connecte des milliers de conducteurs et de passagers chaque jour,
                        contribuant à réduire significativement l'empreinte carbone liée aux transports.
                    </p>
                </div>
                <div class="md:w-1/2">
                    <img src="../Assets/image/map.jpg" alt="Histoire d'EcoRide" class="w-full rounded-lg shadow-md" />
                </div>
            </div>
        </section>
        
        <!-- Notre équipe -->
        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-6 text-2xl font-semibold text-Green-90">Notre Équipe</h2>
            <p class="mb-6">
                Chez EcoRide, nous sommes fiers de notre équipe diversifiée et passionnée. Des ingénieurs aux spécialistes
                du service client, chaque membre partage notre vision d'une mobilité plus durable.
            </p>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div class="p-4 text-center rounded-lg shadow bg-gray-50">
                    <img src="../Assets/image/femme1.jpg" alt="Sophie Martin" class="object-cover w-32 h-32 mx-auto mb-4 rounded-full" />
                    <h3 class="font-bold">Sophie Martin</h3>
                    <p class="text-green-600">Fondatrice & CEO</p>
                </div>
                <div class="p-4 text-center rounded-lg shadow bg-gray-50">
                    <img src="../Assets/image/home1.jpg" alt="Thomas Dubois" class="object-cover w-32 h-32 mx-auto mb-4 rounded-full" />
                    <h3 class="font-bold">Thomas Dubois</h3>
                    <p class="text-green-600">Directeur Technique</p>
                </div>
                <div class="p-4 text-center rounded-lg shadow bg-gray-50">
                    <img src="../Assets/image/femme2.jpg" alt="Emma Legrand" class="object-cover w-32 h-32 mx-auto mb-4 rounded-full" />
                    <h3 class="font-bold">Emma Legrand</h3>
                    <p class="text-green-600">Responsable Marketing</p>
                </div>
            </div>
        </section>
        
        <!-- Nos valeurs -->
        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-6 text-2xl font-semibold text-Green-90">Nos Valeurs</h2>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div class="flex items-start">
                    <div class="mr-4 text-Green-80">
                        <i class="text-3xl fas fa-leaf"></i>
                    </div>
                    <div>
                        <h3 class="mb-2 font-bold text-grey-100">Respect de l'environnement</h3>
                        <p>
                            Notre priorité est de réduire l'impact environnemental des transports. Chaque décision
                            que nous prenons est guidée par notre engagement envers un avenir plus durable.
                        </p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="mr-4 text-Green-90">
                        <i class="text-3xl fas fa-users"></i>
                    </div>
                    <div>
                        <h3 class="mb-2 font-bold">Communauté</h3>
                        <p>
                            Nous croyons en la force de la communauté. EcoRide n'est pas seulement une plateforme,
                            c'est un réseau de personnes partageant les mêmes valeurs.
                        </p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="mr-4 text-Green-90">
                        <i class="text-3xl fas fa-lock"></i>
                    </div>
                    <div>
                        <h3 class="mb-2 font-bold">Sécurité et confiance</h3>
                        <p>
                            La sécurité de nos utilisateurs est primordiale. Nous mettons en place des systèmes
                            de vérification rigoureux pour créer un environnement de confiance.
                        </p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="mr-4 text-Green-90">
                        <i class="text-3xl fas fa-lightbulb"></i>
                    </div>
                    <div>
                        <h3 class="mb-2 font-bold">Innovation</h3>
                        <p>
                            Nous sommes constamment à la recherche de nouvelles façons d'améliorer notre service
                            et de rendre la mobilité partagée plus accessible à tous.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Contact -->
        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-6 text-2xl font-semibold text-Grey-100">Contactez-nous</h2>
            <div class="flex flex-col md:flex-row">
                <div class="mb-6 md:w-1/2 md:mb-0 md:pr-8">
                    <p class="mb-4">
                        Vous avez des questions ou des suggestions ? Notre équipe est à votre écoute.
                        N'hésitez pas à nous contacter.
                    </p>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <i class="mr-2 text-Green-90 fas fa-map-marker-alt"></i>
                            <span>123 Avenue de la Mobilité, 75000 Paris</span>
                        </li>
                        <li class="flex items-center">
                            <i class="mr-2 text-Green-90 fas fa-phone"></i>
                            <span>+33 1 23 45 67 89</span>
                        </li>
                        <li class="flex items-center">
                            <i class="mr-2 text-Green-90 fas fa-envelope"></i>
                            <span>contact@ecoride.fr</span>
                        </li>
                    </ul>
                    <div class="flex mt-4 space-x-4">
                        <a href="#" class="text-Green-90 hover:text-green-700">
                            <i class="text-xl fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="text-Green-90 hover:text-green-700">
                            <i class="text-xl fab fa-twitter"></i>
                        </a>
                        <a href="#" class="text-green-500 hover:text-green-700">
                            <i class="text-xl fab fa-instagram"></i>
                        </a>
                        <a href="#" class="text-green-500 hover:text-green-700">
                            <i class="text-xl fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <form>
                        <div class="mb-4">
                            <label for="name" class="block mb-2 text-gray-700">Nom</label>
                            <input type="text" id="name" class="w-full p-2 border border-gray-300 rounded" required>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="block mb-2 text-gray-700">Email</label>
                            <input type="email" id="email" class="w-full p-2 border border-gray-300 rounded" required>
                        </div>
                        <div class="mb-4">
                            <label for="message" class="block mb-2 text-gray-700">Message</label>
                            <textarea id="message" rows="4" class="w-full p-2 border border-gray-300 rounded" required></textarea>
                        </div>
                        <button type="submit" class="px-4 py-2 text-white rounded bg-primary-100 hover:bg-pink-100">Envoyer</button>
                    </form>
                </div>
            </div>
        </section>
    </div>
</div>

<?php
// Inclure le pied de page
include_once '../includes/footer.php';
?>