<?php
// Inclure l'en-tête et la barre de navigation
include_once '../includes/layouts/header.php';
include_once '../includes/layouts/Navbar.php';
?>

<div class="mt-4 font-sans leading-relaxed bg-gray-100 text-grey-90">
    <div class="p-8 mx-auto max-w-7xl ">
        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-4 text-2xl font-semibold text-center text-gray-90">Bienvenue chez EcoRide</h2>
            <p class="mb-4">
                EcoRide est une entreprise innovante dédiée à la mobilité durable et au covoiturage écologique.
                Fondée en 2020, notre mission est de réduire l'empreinte carbone des déplacements quotidiens
                tout en créant une communauté engagée pour l'environnement.
            </p>

            <div class="my-8 text-center ">
                <img src="Assets/image/avett-brothers.jpg" alt="L'équipe EcoRide" class="block mx-auto rounded-lg shadow-md w-50 md:w-xs xl:w-25" />
                <p class="mt-2 italic">Notre équipe passionnée par la mobilité verte</p>
            </div>
        </section>

        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-4 text-xl font-semibold text-primary-100">Notre Mission</h2>
            <p class="mb-4">
                Chez EcoRide, nous croyons que chaque trajet partagé est un pas vers un monde plus propre.
                Notre plateforme connecte des conducteurs avec des passagers ayant des trajets similaires,
                réduisant ainsi le nombre de véhicules sur les routes.
            </p>
            <p class="mb-2">
                Nos objectifs :
            </p>
            <ul class="pl-6 mb-4 list-disc">
                <li>Réduire les émissions de CO2 liées aux transports</li>
                <li>Diminuer la congestion routière dans les zones urbaines</li>
                <li>Rendre le covoiturage accessible à tous</li>
                <li>Créer une communauté engagée pour l'environnement</li>
            </ul>

            <div class="my-8 text-center">
                <img src="Assets/image/road-besttravel.jpg" alt="Covoiturage en action" class="block mx-auto rounded-lg shadow-md xs:w-1/3 md:w-1/2" />
                <p class="mt-2 italic">Le covoiturage : une solution économique et écologique</p>
            </div>
        </section>

        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-4 text-xl font-semibold text-primary-100">Pourquoi choisir EcoRide ?</h2>

            <h3 class="mb-2 font-medium text-customGreen-90">Écologique</h3>
            <p class="mb-4">
                En partageant votre véhicule ou en rejoignant un trajet, vous contribuez directement à la
                réduction des émissions de gaz à effet de serre. Chaque année, nos utilisateurs économisent
                collectivement plus de 10 000 tonnes de CO2.
            </p>

            <h3 class="mb-2 font-medium text-green-600">Économique</h3>
            <p class="mb-4">
                Le covoiturage permet de partager les frais de carburant, de péage et de stationnement.
                Nos utilisateurs économisent en moyenne 2000€ par an sur leurs déplacements quotidiens.
            </p>

            <h3 class="mb-2 font-medium text-green-600">Convivial</h3>
            <p class="mb-4">
                Rejoignez une communauté de personnes partageant les mêmes valeurs et faites de nouvelles
                rencontres enrichissantes. Le covoiturage, c'est aussi une aventure humaine !
            </p>

            <div class="my-8 text-center">
                <img src="Assets/image/ampoulevert.jpg" alt="Interface de l'application EcoRide" class="w-16 mx-auto rounded-lg shadow-md" />
                <p class="mt-2 italic">Impact positif sur l'environnement</p>
            </div>
        </section>

        <section class="p-8 mb-12 bg-white rounded-lg shadow-md">
            <h2 class="mb-4 text-xl font-semibold text-primary-100">Comment ça marche ?</h2>
            <ol class="pl-6 mb-4 list-decimal">
                <li>Inscrivez-vous gratuitement sur notre plateforme</li>
                <li>Publiez votre trajet ou recherchez un covoiturage disponible</li>
                <li>Contactez votre covoitureur et organisez votre déplacement</li>
                <li>Voyagez ensemble et partagez les frais</li>
                <li>Évaluez votre expérience pour aider la communauté</li>
            </ol>

            <div class="my-8 text-center">
                <img src="Assets/image/ampoulevert.jpg" alt="Interface de l'application EcoRide" class="w-16 mx-auto rounded-lg shadow-md" />
                <p class="mt-2 italic">Notre application intuitive et facile d'utilisation</p>
            </div>

            <a href="../vues/auth/enregistrement.php" class="inline-block bg-primary-100 text-white py-2.5 px-5 rounded-md font-bold mt-4 hover:bg-pink-100 border-2 border-primary-100">Rejoindre EcoRide maintenant</a>
        </section>
    </div>
</div>

<?php
include_once '../includes/layouts/footer.php';
?>
</body>

</html>