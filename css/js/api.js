const API_URL = "TON_URL_FIREBASE_FUNCTIONS";

async function apiRequest(endpoint, method = "GET", data = null) {
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(API_URL + endpoint, options);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "Erreur API");
    }

    return result;
}


// Auth
function login(username, pin) {
    return apiRequest("/api/login", "POST", {
        username,
        pin
    });
}

function register(username, pin) {
    return apiRequest("/api/register", "POST", {
        username,
        pin
    });
}

function logout() {
    return apiRequest("/api/logout", "POST");
}


// Utilisateur
function getMe() {
    return apiRequest("/api/me");
}


// Entrées financières
function addEntry(entry) {
    return apiRequest("/api/entry/add", "POST", entry);
}

function getEntries() {
    return apiRequest("/api/entry/list");
}

function getTotals() {
    return apiRequest("/api/entry/totals");
}


// Notifications
function getNotifications() {
    return apiRequest("/api/notifications");
}


// Admin
function getBenefices() {
    return apiRequest("/api/admin/benefices");
}

function getMembers() {
    return apiRequest("/api/admin/members");
}

function setGrade(username, grade) {
    return apiRequest("/api/admin/setGrade", "POST", {
        username,
        grade
    });
}

function resetPin(username, newPin) {
    return apiRequest("/api/admin/resetPin", "POST", {
        username,
        newPin
    });
}

function banUser(username, minutes) {
    return apiRequest("/api/admin/ban", "POST", {
        username,
        minutes
    });
}