let ws;

window.addEventListener('DOMContentLoaded', () => {
    ws = new WebSocket(`ws://localhost:3000/ws`);
    ws.addEventListener('open', () => onConnected());
    ws.addEventListener('message', (arg) => onMessageReceived(arg));
});

function onConnected() {
    console.info('WS Connection Opened.');
    const params = getParams();

    ws.send(
        JSON.stringify({
            event: 'join',
            room: params.room
        })
    );
}

function onMessageReceived(msg) {
    console.info('Message Received', JSON.parse(msg.data));
}

function getParams() {
    const p = window.location.search.substr(1);
    const tokens = p.split(/[=&]+/);
    let result = {};
    for (let i = 1; i < tokens.length; i += 2)
        result[decodeURIComponent(tokens[i - 1])] = decodeURIComponent(tokens[i]);
    return result;
}