// URL de ton API Firebase Functions
const API_URL = "https://TON-PROJET.cloudfunctions.net/api";


// Fonction générale pour communiquer avec le serveur
async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    };


    if (data) {
        options.body = JSON.stringify(data);
    }


    const response = await fetch(
        API_URL + endpoint,
        options
    );


    const result = await response.json()
        .catch(() => ({
            error: "Erreur serveur"
        }));


    if (!response.ok) {
        throw new Error(
            result.error || "Une erreur est survenue"
        );
    }


    return result;
}


// Vérifier l'utilisateur connecté
async function getMe(){

    return await apiRequest(
        "/api/me",
        "GET"
    );

}


// Déconnexion
async function logout(){

    return await apiRequest(
        "/api/logout",
        "POST"
    );

}
// Requête GET simplifiée
async function apiGet(endpoint){

    return await apiRequest(
        endpoint,
        "GET"
    );

}


// Requête POST simplifiée
async function apiPost(endpoint, data){

    return await apiRequest(
        endpoint,
        "POST",
        data
    );

}