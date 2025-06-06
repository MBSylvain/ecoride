<?php
// Set the HTTP response code
http_response_code(500);

// Include header if available
if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/api/includes/header.php')) {
    include_once $_SERVER['DOCUMENT_ROOT'] . '/api/includes/header.php';
}
?>

<div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
    <div class="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-5 sm:p-10">
            <div class="text-center">
                <h1 class="text-9xl font-bold text-red-600">500</h1>
                <h2 class="text-3xl font-semibold text-gray-800 mt-4">Erreur interne du serveur</h2>
                <p class="text-gray-600 mt-4 mb-8">
                    Nous rencontrons des difficultés techniques. Notre équipe a été informée du problème.
                </p>
                
                <div class="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center">
                    <a href="/api/index.php" class="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300">
                        Retour à l'accueil
                    </a>
                    <a href="javascript:window.location.reload()" class="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-300">
                        Actualiser la page
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="mt-8 text-center text-gray-600 text-sm">
        <p>Si le problème persiste, veuillez contacter notre support technique.</p>
        <p class="mt-2">Code d'erreur: 500 - Internal Server Error</p>
    </div>
</div>

<?php
// Log the error
error_log('500 Error Page Displayed: ' . $_SERVER['REQUEST_URI']);

// Include footer if available
if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/api/includes/footer.php')) {
    include_once $_SERVER['DOCUMENT_ROOT'] . '/api/includes/footer.php';
}
?>