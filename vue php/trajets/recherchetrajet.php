<?php
include_once '../includes/sessionlogin.php';
include_once '../includes/header.php';
include_once '../includes/navbar.php';

// Define background image variables
$backgroundImage = "../Assets/image/mini-cooper.jpg"; // Replace with actual path
$backgroundImage2 = "../Assets/image/map.jpg"; // Replace with actual path
$backgroundImage3 = "../Assets/image/cheminbois.jpg"; // Replace with actual path

?>

<div class="flex flex-col items-center justify-center bg-gray-100">
    <div
        class="w-full h-80 p-8 bg-cover bg-center mb-8"
        style="background-image: url('<?php echo $backgroundImage; ?>');"
    >
        <div class="w-full h-34 bg-white bg-opacity-75 p-8 rounded-lg shadow-md mx-auto">
            <h1 class="text-2xl font-bold mb-4">Rechercher des annonces</h1>
            <div class="flex flex-col h-50 md:flex-row md:space-x-4">
                <input
                    type="text"
                    placeholder="Départ"
                    class="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
                />
                <input
                    type="text"
                    placeholder="Arrivée"
                    class="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
                />
                <input
                    type="date"
                    class="mb-4 md:mb-0 p-3 w-full border border-gray-300 rounded-lg"
                />
                <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full md:w-auto">
                    Rechercher
                </button>
            </div>
        </div>
    </div>

    <!-- Bloc d'annonces -->
    <div
        class="w-full p-8 h-screen bg-cover mb-8"
        style="background-image: url('<?php echo $backgroundImage2; ?>');"
    >
        <div class="flex flex-col h-full md:flex-row flex-wrap -mx-4">
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
                    <h2 class="text-xl font-bold mb-2">Annonce 1</h2>
                    <p class="text-lg">Description de l'annonce 1.</p>
                </div>
            </div>
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
                    <h2 class="text-xl font-bold mb-2">Annonce 2</h2>
                    <p class="text-lg">Description de l'annonce 2.</p>
                </div>
            </div>
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Annonce 3</h2>
                    <p class="text-lg">Description de l'annonce 3.</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bloc meilleurs destinations -->
    <div
        class="w-full h-80 p-8 bg-cover bg-center mb-8"
        style="background-image: url('<?php echo $backgroundImage3; ?>');"
    >
        <div class="flex flex-col md:flex-row flex-wrap -mx-4">
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
                    <h2 class="text-xl font-bold mb-2">Annonce 1</h2>
                    <p class="text-lg">Description de l'annonce 1.</p>
                </div>
            </div>
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg mb-4">
                    <h2 class="text-xl font-bold mb-2">Annonce 2</h2>
                    <p class="text-lg">Description de l'annonce 2.</p>
                </div>
            </div>
            <div class="w-full md:w-1/3 p-4">
                <div class="bg-white bg-opacity-75 p-6 rounded-lg">
                    <h2 class="text-xl font-bold mb-2">Annonce 3</h2>
                    <p class="text-lg">Description de l'annonce 3.</p>
                </div>
            </div>
        </div>
    </div>
</div>