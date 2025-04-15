let socket;
let reconnectAttempts = 0;
const reconnectInterval = 3000; // Wait time (in ms) between reconnection attempts
const pingInterval = 5000; // Interval to send ping messages (in ms)
let pingIntervalId = null; // Store the interval ID for ping messages

function connectWebSocket() {
    socket = new WebSocket(`ws://${location.host}`);

    socket.onopen = () => {
        console.log("WebSocket connection established.");

        // Get the token from cookies
        const token = getCookie("STEXCORE_LIVE_SERVER_TOKEN");

        // Send the handshake event with the token
        if (token) {
            socket.send(JSON.stringify({
                "@stexcore": {
                    "live-server": {
                        event: "handshake",
                        data: token,
                    },
                },
            }));
        } else {
            console.error("No STEXCORE_LIVE_SERVER_TOKEN found in cookies.");
        }

        // Start sending ping messages
        startPinging();
    };

    socket.onmessage = (event) => {
        if (event.data.includes("@stexcore") && event.data.includes("live-server")) {
            const ev = JSON.parse(event.data)["@stexcore"]["live-server"];

            switch (ev.event) {
                case "refresh":
                    console.log("Refreshing!");
                    location.reload(); // Refresh the page
                    break;

                case "updated":
                    console.log("Refreshing!");
                    location.reload(); // Refresh the page
                    break;

                case "pong":
                    break;

                default:
                    console.error("Unknown event", ev);
            }
        }
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed.");
        stopPinging(); // Stop sending ping messages when the connection is closed
        handleReconnect(); // Attempt to reconnect on closure
    };
}

function handleReconnect() {
    console.log(`Attempting to reconnect...`);
    setTimeout(connectWebSocket, reconnectInterval); // Retry connection after a delay
}

// Start sending ping messages periodically
function startPinging() {
    if (!pingIntervalId) { // Ensure only one ping interval is active
        pingIntervalId = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    "@stexcore": {
                        "live-server": {
                            event: "ping",
                            data: "Ping from client",
                        },
                    },
                }));
            }
        }, pingInterval);
    }
}

// Stop sending ping messages
function stopPinging() {
    if (pingIntervalId) {
        clearInterval(pingIntervalId);
        pingIntervalId = null; // Reset the interval ID
        console.log("Ping interval stopped.");
    }
}

// Helper function to get the value of a specific cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Establish the initial WebSocket connection
connectWebSocket();
