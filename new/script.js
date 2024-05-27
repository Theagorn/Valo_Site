const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const lobbyContainer = document.getElementById('lobby-container');
const lobbyTitle = document.getElementById('lobby-title');
const hostNameElement = document.getElementById('host-name');
const playersElement = document.getElementById('players');
const inviteButton = document.getElementById('invite-friends');

let isHost = false;
let localUsername;
let peerConnections = {};

function startLogin() {
    loginContainer.classList.remove('hidden');
    lobbyContainer.classList.add('hidden');
}

function startLobby(hostUsername) {
    lobbyTitle.innerText = `Salon de ${hostUsername}`;
    hostNameElement.innerText = `${hostUsername} (Hôte)`;
    loginContainer.classList.add('hidden');
    lobbyContainer.classList.remove('hidden');
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localUsername = username;

    const urlParams = new URLSearchParams(window.location.search);
    const host = urlParams.get('host');

    if (host) {
        isHost = false;
        connectToHost(host, username);
    } else {
        isHost = true;
        startLobby(username);
    }
});

inviteButton.addEventListener('click', function() {
    const inviteLink = `${window.location.origin}?host=${localUsername}`;
    prompt('Copiez ce lien pour inviter des amis:', inviteLink);
});

function connectToHost(host, username) {
    startLobby(host);
    addPlayer(username);
    setupPeerConnection(username);
    sendOfferToHost(username);
}

function addPlayer(username) {
    const playerElement = document.createElement('p');
    playerElement.innerText = username;
    playersElement.appendChild(playerElement);
}

// WebRTC setup
function setupPeerConnection(username) {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            sendToServer({
                type: 'ice-candidate',
                candidate: event.candidate,
                username: localUsername
            });
        }
    };

    peerConnection.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        receiveChannel.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'new-player') {
                addPlayer(message.username);
            }
        };
    };

    const dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = () => {
        dataChannel.send(JSON.stringify({ type: 'new-player', username: localUsername }));
    };

    peerConnections[username] = { peerConnection, dataChannel };
}

function sendOfferToHost(username) {
    const peerConnection = peerConnections[username].peerConnection;

    peerConnection.createOffer()
        .then((offer) => {
            return peerConnection.setLocalDescription(offer);
        })
        .then(() => {
            sendToServer({
                type: 'offer',
                offer: peerConnection.localDescription,
                username: localUsername
            });
        });
}

function sendToServer(message) {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
        ws.send(JSON.stringify(message));
    };
}

startLogin();
