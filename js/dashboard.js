document.addEventListener("DOMContentLoaded", async () => {


    await loadProfile();

    await loadStats();

    await loadEntries();

    await loadNotifications();



    const form = document.getElementById("addEntryForm");


    if(form){

        form.addEventListener(
            "submit",
            addEntry
        );

    }



    const refresh =
    document.getElementById("refreshBtn");


    if(refresh){

        refresh.addEventListener(
            "click",
            async()=>{

                await loadStats();
                await loadEntries();
                await loadNotifications();

            }
        );

    }


});





// Charger profil utilisateur

async function loadProfile(){

    try{

        const user = await getMe();


        document.getElementById(
            "profileUsername"
        ).textContent = user.username;


        document.getElementById(
            "profileGrade"
        ).textContent = user.grade;



        document.getElementById(
            "userDisplay"
        ).textContent = user.username;


        document.getElementById(
            "userGreeting"
        ).textContent =
        "Bienvenue " + user.username;


    }catch(error){

        window.location.href="login.html";

    }

}






// Charger statistiques

async function loadStats(){

    try{


        const data =
        await apiGet(
            "/api/entry/totals"
        );



        const totals =
        data.totals;



        document.getElementById(
            "actionsTotal"
        ).textContent =
        totals.actions + " $";



        document.getElementById(
            "braquagesTotal"
        ).textContent =
        totals.braquages + " $";



        document.getElementById(
            "ventesTotal"
        ).textContent =
        totals.ventes + " $";



        document.getElementById(
            "personalGains"
        ).textContent =
        (
            totals.actions +
            totals.braquages +
            totals.ventes
        ) + " $";



    }catch(error){

        showMessage(
            error.message,
            "error"
        );

    }

}






// Ajouter une activité

async function addEntry(e){

    e.preventDefault();


    const data={

        category:
        document.getElementById(
            "entryCategory"
        ).value,


        amount:
        Number(
            document.getElementById(
                "entryAmount"
            ).value
        ),


        subtype:
        document.getElementById(
            "entrySubtype"
        ).value,


        product:
        document.getElementById(
            "entryProduct"
        ).value,


        quantity:
        Number(
            document.getElementById(
                "entryQuantity"
            ).value
        )

    };



    try{


        await apiPost(
            "/api/entry/add",
            data
        );


        showMessage(
            "Activité ajoutée",
            "success"
        );


        e.target.reset();


        await loadStats();

        await loadEntries();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}






// Historique

async function loadEntries(){


    const box =
    document.getElementById(
        "entriesList"
    );


    if(!box)return;



    try{


        const data =
        await apiGet(
            "/api/entry/list"
        );



        box.innerHTML="";



        data.entries.forEach(entry=>{


            box.innerHTML += `

            <div class="entry-card">

            <b>${entry.category}</b>

            <p>
            ${entry.subtype || ""}
            </p>

            <p>
            ${entry.amount} $
            </p>

            </div>

            `;


        });



    }catch(error){

        box.innerHTML =
        "Erreur chargement";

    }


}







// Notifications

async function loadNotifications(){


const box =
document.getElementById(
"notificationsList"
);


if(!box)return;



try{


const data =
await apiGet(
"/api/notifications"
);



box.innerHTML="";



data.notifications.forEach(n=>{


box.innerHTML += `

<div class="notification">

${n.message}

</div>

`;


});



}catch(error){

box.innerHTML =
"Erreur notifications";

}


}