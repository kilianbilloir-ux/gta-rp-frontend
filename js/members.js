document.addEventListener("DOMContentLoaded", async () => {

    try {

        // Vérifie l'utilisateur connecté
        const user = await getMe();

        document.getElementById("userDisplay").textContent =
            user.username;

        // Charge les membres
        await loadMembers();

    } catch (error) {

        window.location.href = "login.html";
        return;

    }

    // Bouton Actualiser
    const refreshBtn =
        document.getElementById("refreshMembersBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            loadMembers
        );

    }

});
// ============================
// Chargement des membres
// ============================

async function loadMembers() {

    const box =
        document.getElementById("membersList");

    if (!box) return;

    try {

        const data =
            await apiGet("/api/admin/members");

        box.innerHTML = "";

        let admins = 0;
        let banned = 0;

        document.getElementById("totalMembers").textContent =
            data.members.length;

        data.members.forEach(member => {

            if (member.isAdmin) admins++;

            if (member.banned) banned++;

            box.innerHTML += `

            <div class="member-card">

                <h3>${member.username}</h3>

                <p>
                    Grade :
                    <b>${member.grade}</b>
                </p>

                <p>
                    ${member.isAdmin ? "👑 Administrateur" : "👤 Membre"}
                </p>

                <p>
                    ${member.banned ? "🚫 Banni" : "✅ Actif"}
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

            </div>

            `;

        });

        document.getElementById("totalAdmins").textContent =
            admins;

        document.getElementById("totalBanned").textContent =
            banned;

    } catch (error) {

        box.innerHTML =
            "<p>Impossible de charger les membres.</p>";

        showMessage(
            error.message,
            "error"
        );

    }

}
// ============================
// Changer le grade
// ============================

async function changeGrade(username){

    const grade = prompt(
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
            "Grade modifié avec succès.",
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
// Réinitialiser le PIN
// ============================

async function resetPin(username){

    const newPin = prompt(
        "Nouveau PIN (4 chiffres) :"
    );

    if(!newPin) return;

    if(!/^[0-9]{4}$/.test(newPin)){

        showMessage(
            "Le PIN doit contenir exactement 4 chiffres.",
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
            "PIN réinitialisé.",
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
// Bannir un membre
// ============================

async function banMember(username){

    const minutes = prompt(
        "Durée du bannissement (minutes) :"
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
            username + " a été banni.",
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
// Supprimer un membre
// ============================

async function deleteMember(username){

    if(!confirm(
        "Supprimer définitivement " +
        username +
        " ?"
    )) return;

    try{

        await apiPost(
            "/api/admin/deleteMember",
            {
                username
            }
        );

        showMessage(
            "Membre supprimé.",
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