document.addEventListener("DOMContentLoaded", async () => {

    try {

        const user = await getMe();

        document.getElementById("userDisplay").textContent =
            user.username;

        await loadStats("all");

    } catch(error) {

        window.location.href = "login.html";

    }


    // Boutons période

    const periodButtons =
        document.querySelectorAll(".period-btn");


    periodButtons.forEach(button => {

        button.addEventListener("click", () => {


            document
            .querySelectorAll(".period-btn")
            .forEach(btn =>
                btn.classList.remove("active")
            );


            button.classList.add("active");


            loadStats(
                button.dataset.period
            );


        });

    });


});
// ============================
// Chargement du top des activités
// ============================

async function loadTopActivities(period = "week") {

    const box = document.getElementById("topActivities");

    if(!box) return;

    try {

        const data = await apiGet(
            "/api/stats/topActivities?period=" + period
        );


        box.innerHTML = "";


        if(!data.activities || data.activities.length === 0){

            box.innerHTML =
            "<p>Aucune activité enregistrée.</p>";

            return;
        }


        data.activities.forEach(activity => {

            box.innerHTML += `

            <div class="activity-card">

                <h3>
                    ${activity.type}
                </h3>

                <p>
                    Gains :
                    <b>${activity.amount} $</b>
                </p>

                <p>
                    Nombre :
                    ${activity.count}
                </p>

            </div>

            `;

        });


    } catch(error){

        box.innerHTML =
        "<p>Erreur de chargement.</p>";

    }

}



// ============================
// Chargement du classement membres
// ============================

async function loadTopMembers(period = "week") {


    const box =
    document.getElementById("topMembers");


    if(!box) return;


    try {


        const data =
        await apiGet(
            "/api/stats/topMembers?period=" + period
        );


        box.innerHTML = "";


        data.members.forEach((member,index)=>{


            box.innerHTML += `


            <div class="rank-card">


                <span class="rank">
                    #${index + 1}
                </span>


                <span class="rank-name">
                    ${member.username}
                </span>


                <span class="rank-money">
                    ${member.total} $
                </span>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger le classement.</p>";


    }


}



// ============================
// Chargement distribution activité
// ============================

async function loadDistribution(period="week"){


    const box =
    document.getElementById("typeDistribution");


    if(!box) return;


    try{


        const data =
        await apiGet(
            "/api/stats/distribution?period=" + period
        );


        box.innerHTML="";


        data.types.forEach(type=>{


            box.innerHTML += `


            <div class="distribution-item">


                <span>
                    ${type.name}
                </span>


                <strong>
                    ${type.total} $
                </strong>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur.</p>";


    }


}
// ============================
// Chargement des statistiques principales
// ============================

async function loadStats(period = "week") {

    try {


        const data =
        await apiGet(
            "/api/stats?period=" + period
        );



        // Bénéfices totaux

        document.getElementById(
            "totalBenefits"
        ).textContent =
        data.totalBenefits + " $";



        // Nombre de transactions

        document.getElementById(
            "transactionsCount"
        ).textContent =
        data.transactionsCount;



        // Membres actifs

        document.getElementById(
            "activeMembers"
        ).textContent =
        data.activeMembers;



        // Moyenne

        document.getElementById(
            "avgPerActivity"
        ).textContent =
        data.average + " $";



        await loadTopActivities(period);

        await loadTopMembers(period);

        await loadDistribution(period);

        await loadTransactions(period);


    } catch(error) {


        showMessage(
            error.message,
            "error"
        );


    }

}




// ============================
// Tableau des transactions
// ============================

async function loadTransactions(period="week"){


    const box =
    document.getElementById(
        "transactionsTable"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/stats/transactions?period=" + period
        );



        box.innerHTML = "";



        if(!data.transactions ||
           data.transactions.length === 0){


            box.innerHTML =
            "<p>Aucune transaction.</p>";


            return;

        }



        data.transactions.forEach(transaction=>{


            box.innerHTML += `


            <div class="transaction-card">


                <h3>
                    ${transaction.category}
                </h3>


                <p>
                    Type :
                    ${transaction.type}
                </p>


                <p>
                    Montant :
                    <b>
                    ${transaction.amount} $
                    </b>
                </p>


                <p>
                    Par :
                    ${transaction.username}
                </p>


                <p>
                    ${formatDateTime(transaction.date)}
                </p>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger les transactions.</p>";


    }


}




// ============================
// Déconnexion
// ============================

const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){


    logoutBtn.addEventListener(
        "click",
        async()=>{


            await logout();

            window.location.href =
            "login.html";


        }
    );

}

// ============================
// Graphique évolution des gains
// ============================

async function loadGainsChart(period="week"){


    const box =
    document.getElementById(
        "gainsChart"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/stats/chart?period=" + period
        );



        box.innerHTML = "";



        if(!data.values ||
           data.values.length === 0){


            box.innerHTML =
            "<p>Aucune donnée disponible.</p>";

            return;

        }



        data.values.forEach(item=>{


            box.innerHTML += `


            <div class="chart-bar">


                <span>
                    ${item.date}
                </span>


                <div class="bar">

                    <div 
                    class="bar-fill"
                    style="width:${item.percent}%">

                    </div>

                </div>


                <strong>
                    ${item.amount} $
                </strong>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur graphique.</p>";


    }


}



// ============================
// Export des transactions
// ============================

const exportBtn =
document.getElementById("exportBtn");


if(exportBtn){


    exportBtn.addEventListener(
        "click",
        async()=>{


            try{


                const data =
                await apiGet(
                    "/api/stats/export"
                );



                let csv =
                "Date,Utilisateur,Catégorie,Type,Montant\n";



                data.transactions.forEach(t=>{


                    csv +=
                    `${t.date},${t.username},${t.category},${t.type},${t.amount}\n`;


                });



                const blob =
                new Blob(
                    [csv],
                    {
                        type:"text/csv"
                    }
                );



                const url =
                URL.createObjectURL(blob);



                const link =
                document.createElement("a");


                link.href = url;

                link.download =
                "gta-rp-statistiques.csv";


                link.click();



                URL.revokeObjectURL(url);



            }catch(error){


                showMessage(
                    "Erreur export",
                    "error"
                );


            }


        }
    );


}



// Charger le graphique au démarrage

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadGainsChart("week");

});