document.addEventListener("DOMContentLoaded", async () => {

    try {

        const user = await getMe();


        // Vérification admin

        if(!user.isAdmin){

            window.location.href =
            "dashboard.html";

            return;

        }



        const userDisplay =
        document.getElementById(
            "userDisplay"
        );


        if(userDisplay){

            userDisplay.textContent =
            user.username;

        }



        await loadBenefits();

        await loadMembers();

        await loadLogs();



    }catch(error){


        window.location.href =
        "login.html";


    }




    // Actualiser membres

    const refreshMembers =
    document.getElementById(
        "refreshMembersBtn"
    );


    if(refreshMembers){

        refreshMembers.addEventListener(
            "click",
            loadMembers
        );

    }




    // Actualiser logs

    const refreshLogs =
    document.getElementById(
        "refreshLogsBtn"
    );


    if(refreshLogs){

        refreshLogs.addEventListener(
            "click",
            loadLogs
        );

    }


});




// ============================
// Bénéfices organisation
// ============================

async function loadBenefits(){


    try{


        const data =
        await apiGet(
            "/api/admin/benefices"
        );



        const total =
        document.getElementById(
            "totalBenefits"
        );



        if(total){

            total.textContent =
            data.benefices.total + " $";

        }



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Charger les membres
// ============================

async function loadMembers(){


    const box =
    document.getElementById(
        "membersList"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/admin/members"
        );



        const total =
        document.getElementById(
            "totalMembers"
        );


        if(total){

            total.textContent =
            data.members.length;

        }



        box.innerHTML = "";



        data.members.forEach(member=>{


            box.innerHTML += `


            <div class="member-card">


                <h3>
                    ${member.username}
                </h3>



                <p>
                    Grade :
                    <b>
                    ${member.grade || "Membre"}
                    </b>
                </p>



                <p>
                    ${
                        member.isAdmin
                        ?
                        "👑 Administrateur"
                        :
                        "👤 Membre"
                    }
                </p>



                <button
                class="btn btn-small"
                onclick="changeGrade('${member.username}')">

                Changer le grade

                </button>




                <button
                class="btn btn-small"
                onclick="resetPin('${member.username}')">

                Reset PIN

                </button>




                <button
                class="btn btn-small"
                onclick="banMember('${member.username}')">

                Bannir

                </button>



                ${
                    member.isAdmin
                    ?
                    ""
                    :
                    `
                    <button
                    class="btn btn-danger"
                    onclick="deleteMember('${member.username}')">

                    Supprimer

                    </button>
                    `
                }



            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger les membres.</p>";


    }


}





// ============================
// Modifier grade
// ============================

async function changeGrade(username){


    const grade =
    prompt(
        "Nouveau grade :"
    );


    if(!grade) return;



    try{


        await apiPost(
            "/api/admin/setGrade",
            {
                username,
                grade
            }
        );



        showMessage(
            "Grade modifié",
            "success"
        );



        loadMembers();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Reset PIN
// ============================

async function resetPin(username){


    const newPin =
    prompt(
        "Nouveau PIN (4 chiffres)"
    );



    if(!newPin) return;



    if(!/^[0-9]{4}$/.test(newPin)){


        showMessage(
            "Le PIN doit contenir 4 chiffres",
            "error"
        );


        return;

    }



    try{


        await apiPost(
            "/api/admin/resetPin",
            {
                username,
                newPin
            }
        );



        showMessage(
            "PIN réinitialisé",
            "success"
        );



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Bannir membre
// ============================

async function banMember(username){


    const minutes =
    prompt(
        "Durée du bannissement en minutes :"
    );



    if(!minutes) return;



    try{


        await apiPost(
            "/api/admin/ban",
            {
                username,
                minutes:Number(minutes)
            }
        );



        showMessage(
            username + " a été banni",
            "success"
        );



        loadMembers();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Supprimer membre
// ============================

async function deleteMember(username){


    const confirmDelete =
    confirm(
        "Supprimer définitivement " +
        username +
        " ?"
    );



    if(!confirmDelete) return;



    try{


        await apiPost(
            "/api/admin/deleteMember",
            {
                username
            }
        );



        showMessage(
            "Membre supprimé",
            "success"
        );



        loadMembers();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Charger les logs
// ============================

async function loadLogs(){


    const box =
    document.getElementById(
        "logsList"
    );


    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/admin/logs"
        );



        box.innerHTML = "";



        if(!data.logs ||
           data.logs.length === 0){


            box.innerHTML =
            "<p>Aucun log disponible.</p>";


            return;

        }




        data.logs.forEach(log=>{


            box.innerHTML += `


            <div class="log-card">


                <h3>
                    ${log.action}
                </h3>


                <p>
                    Utilisateur :
                    <b>${log.actor}</b>
                </p>


                <p>
                    Date :
                    ${
                    new Date(log.ts)
                    .toLocaleString("fr-FR")
                    }
                </p>


                <pre>
${JSON.stringify(
    log.details,
    null,
    2
)}
                </pre>


            </div>


            `;


        });



        const count =
        document.getElementById(
            "activitiesCount"
        );


        if(count){

            count.textContent =
            data.logs.length;

        }



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger les logs.</p>";


    }


}





// ============================
// Gestion onglets admin
// ============================

const tabs =
document.querySelectorAll(
    ".tab-btn"
);



tabs.forEach(tab=>{


    tab.addEventListener(
        "click",
        ()=>{


            document
            .querySelectorAll(".tab-btn")
            .forEach(btn=>
                btn.classList.remove("active")
            );



            document
            .querySelectorAll(".tab-content")
            .forEach(content=>
                content.classList.remove("active")
            );



            tab.classList.add(
                "active"
            );



            const target =
            tab.dataset.tab;



            const section =
            document.getElementById(
                target
            );


            if(section){

                section.classList.add(
                    "active"
                );

            }


        }
    );


});