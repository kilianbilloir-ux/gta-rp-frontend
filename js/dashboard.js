document.addEventListener("DOMContentLoaded", async () => {

    try {

        const user = await getMe();


        const userDisplay =
        document.getElementById("userDisplay");

        if(userDisplay){
            userDisplay.textContent =
            user.username;
        }


        const profileUsername =
        document.getElementById("profileUsername");

        if(profileUsername){
            profileUsername.textContent =
            user.username;
        }


        const profileGrade =
        document.getElementById("profileGrade");

        if(profileGrade){
            profileGrade.textContent =
            user.grade || "Membre";
        }


        const greeting =
        document.getElementById("userGreeting");

        if(greeting){
            greeting.textContent =
            "Bienvenue " + user.username;
        }


        await loadDashboardStats();
        await loadActivities();


    } catch(error) {

        window.location.href =
        "login.html";

    }



    const form =
    document.getElementById("addEntryForm");


    if(form){

        form.addEventListener(
            "submit",
            addActivity
        );

    }



    const refresh =
    document.getElementById("refreshBtn");


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



        const personalGains =
        document.getElementById("personalGains");

        if(personalGains){

            personalGains.textContent =
            data.personalGains + " $";

        }



        const actionsTotal =
        document.getElementById("actionsTotal");

        if(actionsTotal){

            actionsTotal.textContent =
            data.actions + " $";

        }



        const braquagesTotal =
        document.getElementById("braquagesTotal");

        if(braquagesTotal){

            braquagesTotal.textContent =
            data.braquages + " $";

        }



        const ventesTotal =
        document.getElementById("ventesTotal");

        if(ventesTotal){

            ventesTotal.textContent =
            data.ventes + " $";

        }


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
    )
    ?
    document.getElementById(
        "entrySubtype"
    ).value
    :
    "";



    const product =
    document.getElementById(
        "entryProduct"
    )
    ?
    document.getElementById(
        "entryProduct"
    ).value
    :
    "";



    const quantity =
    document.getElementById(
        "entryQuantity"
    )
    ?
    document.getElementById(
        "entryQuantity"
    ).value
    :
    1;



    if(!category || !amount){

        showMessage(
            "Choisis une activité et un montant",
            "error"
        );

        return;

    }



    const money =
    Number(amount);



    if(money <= 0){

        showMessage(
            "Le montant doit être supérieur à 0",
            "error"
        );

        return;

    }



    // Limite braquage

    if(
        category === "braquage"
        &&
        money > 120000
    ){

        showMessage(
            "Un braquage ne peut pas dépasser 120000 $",
            "error"
        );

        return;

    }





    try{


        await apiPost(
            "/api/activity/add",
            {

                category,

                amount: money,

                subtype,

                product,

                quantity:
                Number(quantity) || 1

            }
        );



        showMessage(
            "Activité ajoutée avec succès",
            "success"
        );



        const form =
        document.getElementById(
            "addEntryForm"
        );


        if(form){

            form.reset();

        }



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
// Charger l'historique
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



        if(
            !data.activities ||
            data.activities.length === 0
        ){

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