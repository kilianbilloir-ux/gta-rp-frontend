document.addEventListener("DOMContentLoaded", async () => {


    try {


        // Vérification connexion

        const user = await getMe();


        document.getElementById(
            "userDisplay"
        ).textContent =
            user.username;



        document.getElementById(
            "profileUsername"
        ).textContent =
            user.username;



        document.getElementById(
            "profileGrade"
        ).textContent =
            user.grade || "Membre";



        document.getElementById(
            "userGreeting"
        ).textContent =
            "Bienvenue " + user.username;



        // Chargement des données

        await loadDashboardStats();

        await loadActivities();



    } catch(error) {


        window.location.href =
        "login.html";


    }



    // Formulaire ajout activité

    const form =
    document.getElementById(
        "addEntryForm"
    );


    if(form){


        form.addEventListener(
            "submit",
            addActivity
        );


    }



    // Bouton actualiser

    const refresh =
    document.getElementById(
        "refreshBtn"
    );


    if(refresh){


        refresh.addEventListener(
            "click",
            loadActivities
        );


    }



});
// ============================
// Charger les statistiques
// ============================

async function loadDashboardStats(){

    try{


        const data =
        await apiGet(
            "/api/dashboard/stats"
        );



        document.getElementById(
            "personalGains"
        ).textContent =
            data.personalGains + " $";



        document.getElementById(
            "actionsTotal"
        ).textContent =
            data.actions + " $";



        document.getElementById(
            "braquagesTotal"
        ).textContent =
            data.braquages + " $";



        document.getElementById(
            "ventesTotal"
        ).textContent =
            data.ventes + " $";



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }

}





// ============================
// Ajouter une activité
// ============================

async function addActivity(e){

    e.preventDefault();



    const category =
    document.getElementById(
        "entryCategory"
    ).value;



    const amount =
    document.getElementById(
        "entryAmount"
    ).value;



    const subtype =
    document.getElementById(
        "entrySubtype"
    ).value;



    const product =
    document.getElementById(
        "entryProduct"
    ).value;



    const quantity =
    document.getElementById(
        "entryQuantity"
    ).value;



    if(!category || !amount){

        showMessage(
            "Remplis les champs obligatoires",
            "error"
        );

        return;

    }



    try{


        await apiPost(
            "/api/activity/add",
            {

                category,
                amount:Number(amount),
                subtype,
                product,
                quantity:Number(quantity)

            }
        );



        showMessage(
            "Activité ajoutée avec succès",
            "success"
        );



        document.getElementById(
            "addEntryForm"
        ).reset();



        await loadDashboardStats();

        await loadActivities();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}
// ============================
// Charger l'historique des activités
// ============================

async function loadActivities(){


    const box =
    document.getElementById(
        "entriesList"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/activity/list"
        );



        box.innerHTML = "";



        if(!data.activities ||
           data.activities.length === 0){


            box.innerHTML =
            "<p>Aucune activité enregistrée.</p>";


            return;

        }



        data.activities.forEach(activity=>{


            box.innerHTML += `


            <div class="activity-entry">


                <h3>
                    ${activity.category}
                </h3>



                <p>
                    Type :
                    ${activity.subtype || "Non précisé"}
                </p>



                <p>
                    Montant :
                    <b>
                    ${activity.amount} $
                    </b>
                </p>



                ${
                    activity.product
                    ?
                    `
                    <p>
                    Produit :
                    ${activity.product}
                    </p>
                    `
                    :
                    ""
                }



                <p>
                    Quantité :
                    ${activity.quantity || 1}
                </p>



                <small>

                    ${formatDateTime(activity.date)}

                </small>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger l'historique.</p>";


    }


}




// ============================
// Déconnexion
// ============================

const logoutButton =
document.getElementById(
    "logoutBtn"
);



if(logoutButton){


    logoutButton.addEventListener(
        "click",
        async()=>{


            try{


                await logout();



                window.location.href =
                "login.html";


            }catch(error){


                showMessage(
                    error.message,
                    "error"
                );


            }


        }
    );


}