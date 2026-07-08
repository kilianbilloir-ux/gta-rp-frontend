document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Connexion
    if (loginForm) {

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const pin = document.getElementById("pin").value;

            try {

                const response = await apiRequest("/api/login", "POST", {
                    username,
                    pin
                });

                if (response.ok) {
                    window.location.href = "dashboard.html";
                }

            } catch (error) {
                showMessage(error.message, "error");
            }

        });
    }


    // Inscription
    if (registerForm) {

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();


            const username =
                document.getElementById("username").value;

            const pin =
                document.getElementById("pin").value;

            const confirmPin =
                document.getElementById("confirmPin").value;


            if (pin !== confirmPin) {
                showMessage(
                    "Les PIN ne correspondent pas",
                    "error"
                );
                return;
            }


            try {

                const response = await apiRequest(
                    "/api/register",
                    "POST",
                    {
                        username,
                        pin
                    }
                );


                if (response.ok) {

                    showMessage(
                        "Compte créé avec succès",
                        "success"
                    );


                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);

                }


            } catch(error) {

                showMessage(
                    error.message,
                    "error"
                );

            }

        });

    }

// Déconnexion

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click", async ()=>{

        try{

            await logout();

            window.location.href = "login.html";

        }catch(error){

            showMessage(
                error.message,
                "error"
            );

        }

    });

}});


// Affichage des messages
function showMessage(message, type){

    const box = document.getElementById("messageBox");

    if(!box) return;


    box.textContent = message;

    box.className =
        "message-box " + type;

}