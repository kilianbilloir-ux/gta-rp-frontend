document.addEventListener("DOMContentLoaded", async () => {

    try {

        const user = await getMe();


        const userDisplay =
        document.getElementById("userDisplay");


        if(userDisplay){

            userDisplay.textContent =
            user.username;

        }



        await loadStats("all");



    } catch(error) {


        window.location.href =
        "login.html";


    }



    const periodButtons =
    document.querySelectorAll(
        ".period-btn"
    );



    periodButtons.forEach(button=>{


        button.addEventListener(
            "click",
            ()=>{


                document
                .querySelectorAll(".period-btn")
                .forEach(btn=>
                    btn.classList.remove("active")
                );



                button.classList.add("active");



                loadStats(
                    button.dataset.period
                );


            }
        );


    });



});





// ============================
// Statistiques principales
// ============================

async function loadStats(period="week"){


    try{


        const data =
        await apiGet(
            "/api/stats?period=" + period
        );



        updateElement(
            "totalBenefits",
            data.totalBenefits + " $"
        );


        updateElement(
            "transactionsCount",
            data.transactionsCount
        );


        updateElement(
            "activeMembers",
            data.activeMembers
        );


        updateElement(
            "avgPerActivity",
            data.average + " $"
        );



        await loadTopActivities(period);

        await loadTopMembers(period);

        await loadDistribution(period);

        await loadTransactions(period);

        await loadGainsChart(period);



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





function updateElement(id,value){


    const element =
    document.getElementById(id);


    if(element){

        element.textContent =
        value;

    }


}






// ============================
// Top activités
// ============================

async function loadTopActivities(period){


    const box =
    document.getElementById(
        "topActivities"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/stats/topActivities?period=" + period
        );



        box.innerHTML="";



        if(
            !data.activities ||
            data.activities.length===0
        ){

            box.innerHTML =
            "<p>Aucune activité.</p>";

            return;

        }



        data.activities.forEach(activity=>{


            box.innerHTML += `


            <div class="activity-card">


                <h3>
                ${activity.category}
                </h3>


                <p>
                Gains :
                <b>
                ${activity.amount} $
                </b>
                </p>


                <p>
                Nombre :
                ${activity.count}
                </p>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur chargement.</p>";

    }


}







// ============================
// Top membres
// ============================

async function loadTopMembers(period){


    const box =
    document.getElementById(
        "topMembers"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/stats/topMembers?period=" + period
        );



        box.innerHTML="";



        (data.members || [])
        .forEach((member,index)=>{


            box.innerHTML += `


            <div class="rank-card">


                <span>
                #${index+1}
                </span>


                <b>
                ${member.username}
                </b>


                <span>
                ${member.total} $
                </span>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur classement.</p>";

    }


}







// ============================
// Distribution
// ============================

async function loadDistribution(period){


    const box =
    document.getElementById(
        "typeDistribution"
    );


    if(!box)return;



    try{


        const data =
        await apiGet(
            "/api/stats/distribution?period=" + period
        );


        box.innerHTML="";



        (data.types || [])
        .forEach(type=>{


            box.innerHTML += `


            <div class="distribution-item">


            <span>
            ${type.name}
            </span>


            <b>
            ${type.total} $
            </b>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur.</p>";

    }


}







// ============================
// Transactions
// ============================

async function loadTransactions(period){


    const box =
    document.getElementById(
        "transactionsTable"
    );


    if(!box)return;



    try{


        const data =
        await apiGet(
            "/api/stats/transactions?period=" + period
        );



        box.innerHTML="";



        (data.transactions || [])
        .forEach(t=>{


            box.innerHTML += `


            <div class="transaction-card">


            <h3>
            ${t.category}
            </h3>


            <p>
            Montant :
            <b>
            ${t.amount} $
            </b>
            </p>


            <p>
            Par :
            ${t.username}
            </p>


            <small>
            ${formatDateTime(t.date)}
            </small>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur transactions.</p>";

    }


}







// ============================
// Graphique gains
// ============================

async function loadGainsChart(period){


    const box =
    document.getElementById(
        "gainsChart"
    );


    if(!box)return;



    try{


        const data =
        await apiGet(
            "/api/stats/chart?period=" + period
        );



        box.innerHTML="";



        (data.values || [])
        .forEach(item=>{


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


            <b>
            ${item.amount} $
            </b>


            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Erreur graphique.</p>";

    }


}






// ============================
// Export CSV
// ============================

const exportBtn =
document.getElementById(
    "exportBtn"
);



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
"Date,Utilisateur,Categorie,Montant\n";



(data.transactions || [])
.forEach(t=>{


csv +=
`${t.date},${t.username},${t.category},${t.amount}\n`;


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


link.href=url;


link.download =
"statistiques-gta-rp.csv";


link.click();



URL.revokeObjectURL(url);



}catch(error){


showMessage(
"Erreur export",
"error"
);


}



});

}







// ============================
// Déconnexion
// ============================

const logoutBtn =
document.getElementById(
"logoutBtn"
);



if(logoutBtn){


logoutBtn.addEventListener(
"click",
async()=>{


await logout();


window.location.href =
"login.html";


});

}