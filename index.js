const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');
const http = require('http');

const bare = createBareServer('/bare/');
const app = express();

// הגשת תיקיית ה-HTML שבה יישב העיצוב שלך
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer();

// ניתוב חכם: אם הבקשה מיועדת לפרוקסי, ה-Bare Server יטפל בה
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
