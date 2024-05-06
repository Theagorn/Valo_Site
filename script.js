// Initialisation de la base de données SQLite
var db = new SQL.Database();

// Création d'une table pour stocker les utilisateurs du lobby
var createTableQuery = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT)";
db.run(createTableQuery);

// Fonction pour ajouter un utilisateur au lobby
function addUserToLobby(username) {
    var addUserQuery = "INSERT INTO users (username) VALUES (?)";
    db.run(addUserQuery, [username]);
}

// Fonction pour retirer un utilisateur du lobby
function removeUserFromLobby(username) {
    var removeUserQuery = "DELETE FROM users WHERE username = ?";
    db.run(removeUserQuery, [username]);
}

// Exemple d'utilisation des fonctions pour ajouter et retirer un utilisateur
addUserToLobby("Hôte");

// Détection de la déconnexion de l'hôte
window.addEventListener("beforeunload", function(event) {
    // Retirer l'hôte du lobby lorsque la page se ferme
    removeUserFromLobby("Hôte");
});

// Fonction pour afficher les utilisateurs actuellement dans le lobby
function getUsersInLobby() {
    var getUsersQuery = "SELECT * FROM users";
    var results = db.exec(getUsersQuery);
    var users = results[0].values;
    console.log("Utilisateurs dans le lobby : ", users);
}

// Exemple d'utilisation de la fonction pour afficher les utilisateurs dans le lobby
getUsersInLobby();

// Fonction pour obtenir le nombre d'utilisateurs dans le lobby depuis la base de données SQLite
function getUsersCountFromDatabase() {
    var getUsersCountQuery = "SELECT COUNT(*) AS count FROM users";
    var results = db.exec(getUsersCountQuery);
    var count = results[0].values[0][0];
    return count;
}



// // Counter for the number of players
// let playerCount = 0;

// // Event listener for the "Start Game" button
// document.getElementById('startGameBtn').addEventListener('click', function() {
//     alert('La partie démarre !');
//     // Add your logic to start the game here
// });

// // Function to add a player to the player list
// function addPlayer(name) {
//     const playerList = document.getElementById('playerList');
//     const listItem = document.createElement('li');
//     listItem.textContent = name;
//     playerList.appendChild(listItem);
//     playerCount++;

//     // Enable the "Start Game" button if 5 players have joined
//     if (playerCount === 5) {
//         document.getElementById('startGameBtn').disabled = false;
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     // Function to get URL parameter by name
//     function getParameterByName(name, url) {
//         if (!url) url = window.location.href;
//         name = name.replace(/[\[\]]/g, '\\$&');
//         const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//             results = regex.exec(url);
//         if (!results) return null;
//         if (!results[2]) return '';
//         return decodeURIComponent(results[2].replace(/\+/g, ' '));
//     }

//     const playerName = getParameterByName('name');
    
//     // Remove any existing players
//     const playerList = document.getElementById('playerList');
//     while (playerList.firstChild) {
//         playerList.removeChild(playerList.firstChild);
//     }

//     // Add the player to the lobby
//     if (playerName) {
//         addPlayer(playerName);
//     }
// });

