document.addEventListener("DOMContentLoaded", async () => {


    try {


        const user = await getMe();


        document.getElementById(
            "userDisplay"
        ).textContent =
            user.username;



        await loadMembers();



    } catch(error) {


        window.location.href =
        "login.html";


    }



    const search =
    document.getElementById(
        "memberSearch"
    );


    if(search){


        search.addEventListener(
            "input",
            filterMembers
        );


    }



});




// Stockage temporaire des membres

let membersData = [];




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
            "/api/members"
        );



        membersData =
        data.members;



        displayMembers(
            membersData
        );



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger les membres.</p>";


    }


}
// ============================
// Afficher les membres
// ============================

function displayMembers(members){


    const box =
    document.getElementById(
        "membersList"
    );


    if(!box) return;



    box.innerHTML = "";



    if(!members ||
       members.length === 0){


        box.innerHTML =
        "<p>Aucun membre trouvé.</p>";


        return;

    }



    members.forEach(member=>{


        box.innerHTML += `


        <div class="member-card">


            <div class="member-avatar">
                👤
            </div>



            <div class="member-info">


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



                <p>

                    Gains :
                    <b>
                    ${member.total || 0} $
                    </b>

                </p>



            </div>


        </div>


        `;


    });



}






// ============================
// Recherche membre
// ============================

function filterMembers(){


    const search =
    document.getElementById(
        "memberSearch"
    ).value.toLowerCase();



    const filtered =
    membersData.filter(member=>{


        return member.username
        .toLowerCase()
        .includes(search);


    });



    displayMembers(
        filtered
    );


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


        }
    );


}