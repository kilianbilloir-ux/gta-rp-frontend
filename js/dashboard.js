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
    document.getElementById(
        "addEntryForm"
    );


    if(form){

        form.addEventListener(
            "submit",
            addActivity
        );

    }



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
// Charger statistiques
// ============================

async function loadDashboardStats(){


    try{


        const data =
        await apiGet(
            "/api/dashboard/stats"
        );



        updateValue(
            "personalGains",
            data.personalGains + " $"
        );


        updateValue(
            "actionsTotal",
            data.actions + " $"
        );


        updateValue(
            "braquagesTotal",
            data.braquages + " $"
        );


        updateValue(
            "ventesTotal",
            data.ventes + " $"
        );



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}




function updateValue(id,value){


    const element =
    document.getElementById(id);


    if(element){

        element.textContent =
        value;

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




    // Limite braquage 120 000$

    if(
        category.toLowerCase() === "braquage"
        &&
        money > 120000
    ){


        showMessage(
            "Un braquage est limité à 120000 $",
            "error"
        );


        return;

    }





    try{


        await apiPost(
            "/api/activity/add",
            {

                category,

                amount: money

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
// Historique activités
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



        box.innerHTML="";



        if(
            !data.activities ||
            data.activities.length===0
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
                Montant :
                <b>
                ${activity.amount} $
                </b>
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


            await logout();


            window.location.href =
            "login.html";


        }
    );


}