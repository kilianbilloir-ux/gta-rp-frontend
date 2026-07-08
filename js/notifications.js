document.addEventListener("DOMContentLoaded", async () => {


    try{


        const user = await getMe();


        document.getElementById(
            "userDisplay"
        ).textContent =
            user.username;



        await loadNotifications();



    }catch(error){


        window.location.href =
        "login.html";


    }



    const refreshBtn =
    document.getElementById(
        "refreshNotificationsBtn"
    );


    if(refreshBtn){


        refreshBtn.addEventListener(
            "click",
            loadNotifications
        );


    }



    const markBtn =
    document.getElementById(
        "markAllReadBtn"
    );


    if(markBtn){


        markBtn.addEventListener(
            "click",
            markAllRead
        );


    }



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


});





// ============================
// Charger les notifications
// ============================

async function loadNotifications(){


    const box =
    document.getElementById(
        "notificationsList"
    );



    if(!box) return;



    try{


        const data =
        await apiGet(
            "/api/notifications"
        );



        box.innerHTML = "";



        if(!data.notifications ||
           data.notifications.length === 0){


            box.innerHTML =
            "<p>Aucune notification.</p>";


            return;

        }



        data.notifications.forEach(notification=>{


            box.innerHTML += `


            <div class="notification-card">


                <h3>
                    ${notification.title}
                </h3>



                <p>
                    ${notification.message}
                </p>



                <small>
                    ${formatDateTime(notification.date)}
                </small>



            </div>


            `;


        });



    }catch(error){


        box.innerHTML =
        "<p>Impossible de charger les notifications.</p>";



        showMessage(
            error.message,
            "error"
        );


    }


}





// ============================
// Marquer toutes les notifications comme lues
// ============================

async function markAllRead(){


    try{


        await apiPost(
            "/api/notifications/readAll",
            {}
        );



        showMessage(
            "Toutes les notifications sont lues",
            "success"
        );



        loadNotifications();



    }catch(error){


        showMessage(
            error.message,
            "error"
        );


    }


}