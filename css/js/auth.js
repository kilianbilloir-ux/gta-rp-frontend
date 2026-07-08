// Vérifie si l'utilisateur est connecté
async function checkAuth() {
    try {
        const user = await getMe();

        return user;

    } catch (error) {
        window.location.href = "login.html";
        return null;
    }
}


// Vérifie si l'utilisateur est administrateur
async function checkAdmin() {
    try {
        const user = await getMe();

        if (!user.isAdmin) {
            window.location.href = "dashboard.html";
            return false;
        }

        return true;

    } catch (error) {
        window.location.href = "login.html";
        return false;
    }
}


// Connexion
async function handleLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value;

    const pin =
        document.getElementById("pin").value;


    try {

        const result = await login(username, pin);


        if (result.ok) {

            if (result.isAdmin) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "dashboard.html";
            }

        }

    } catch(error) {

        alert(error.message);

    }
}


// Inscription
async function handleRegister(event) {

    event.preventDefault();


    const username =
        document.getElementById("username").value;

    const pin =
        document.getElementById("pin").value;


    try {

        const result =
            await register(username, pin);


        if(result.ok) {

            alert("Compte créé avec succès");

            window.location.href =
                "login.html";
        }


    } catch(error) {

        alert(error.message);

    }

}


// Déconnexion
async function handleLogout() {

    try {

        await logout();

        window.location.href =
            "login.html";

    } catch(error) {

        console.error(error);

    }

}