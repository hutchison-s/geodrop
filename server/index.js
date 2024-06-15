import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
// const helmet = require('helmet');
// const morgan = require('morgan');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(json());
app.use(urlencoded({extended: true}))
app.use(cors())
// app.use(helmet());
// app.use(morgan('combined'));


app.get('/ping', (req, res)=>{
    const newPing = new Date().toTimeString()
    console.log("pinged at", newPing)
    return res.end('ping')
})

let clients = [];

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);
  
    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
});

function sendUpdate(type, data) {
    clients.forEach(client => {
        client.res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
    });
}

app.post('/notify', (req, res) => {
    console.log("Received notification from Vercel:", req.body.type, req.body.data);
    const { type, data } = req.body;
    const auth = atob(req.headers['authorization'].substring(6));
    if (auth !== process.env.INTERSERVERAUTH) {
        return res.status(401).send({message: "You do not have access to this endpoint."})
    }
    sendUpdate(type, data);
    res.send({ success: true });
});
  
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});