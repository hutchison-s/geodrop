import dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import Pin from './schemas/Pin.js';
import User from './schemas/User.js';
import { createPin, deletePin, likePin, unlikePin, viewPin } from './dbFuncs/PinFuncs.mjs';
import { createUser, updateUser, removeConnection, deleteUser, connectUsers } from './dbFuncs/UserFuncs.mjs';


// Initialization
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI

connect(mongoURI)
    .then(()=>{
        console.log('Connected to MongoDB')
    }).catch((err)=>{
        console.log('Error connecting to MongoDB', err.message);
    });


// Middleware
app.use(json());
app.use(urlencoded({extended: true}))
// app.use(cors({
//     origin: ['https://listenhere.netlify.app', 'http://localhost:5173']
//   }))
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/ping', (req, res)=>{
    const newPing = new Date().toTimeString()
    console.log("pinged at", newPing)
    return res.end('ping')
})

function sendUpdate(update) {
    fetch('http://localhost:8000/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(process.env.INTERSERVERAUTH)}`
        },
        body: JSON.stringify(update)
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}

/* ----------------------------------------------------------
------------------  SUMMARY OF METHODS  ---------------------
---------------------------------------------------------- */

/*

GET /pins                       get all pins
POST /pins                      create pin / add pin to user.pins
GET /pins/:id                   get one pin
DELETE /pins/:id                delete one pin
POST /pins/:id/like/:user       add user to pin.likedBy / add pin to user.liked
DELETE /pins/:id/like/:user     remove user from pin.likedBy / remove pin from user.liked
POST /pins/:id/view/:user       add user to pin.viewedBy / add pin to user.viewed

POST /confirm                   confirm user exists, if not create one
GET /users                      get all users
POST /users                     create user
GET /users/:id                  get one user
PATCH /users/:id                update one user's info (displayName, bio, or photo)
DELETE /users/:id               delete one user
POST /users/:id/connect/:user   add user ids to each other's connection arrays
PUT /users/:id/disconnect/:user remove user ids from each other's connection arrays

*/


/* ----------------------------------------------------------
-----------------------  PINS  ------------------------------
---------------------------------------------------------- */

// Get All Pins
app.get('/pins', async (req, res) => {
    try {
        const pins = await Pin.find();
        return res.send(pins);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Get One Pin
app.get('/pins/:id', async (req, res) => {
    const { id } = req.params
    try {
        const pin = await Pin.findById(id);
        if (!pin) {
            return res.status(404).send({error: "Pin not found"})
        }
        return res.send(pin);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Create New Pin and add to creator's pin array
app.post('/pins', async (req, res) => {
    const {type, data, creator, title, location, viewLimit, tags, description} = req.body;

    if (!location || !title || !creator || !data || !type) {
        return res.status(400).send({error: `Required values missing. Received ${location, title, creator, data, type}`})
    }
    const pinObject = {type, data, creator, title, location, viewLimit, tags, description}
    try {
        const newPin = await createPin(pinObject)
        sendUpdate({type: 'newPin', data: newPin})
        return res.status(201).send(newPin)
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
})

// Delete Pin
app.delete('/pins/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPin = await deletePin(id)
        sendUpdate({type: 'deletePin', data: deletedPin})
        return res.send(deletedPin);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
});

/* ----------------------------------------------------------
-----------------------  USERS  -----------------------------
---------------------------------------------------------- */

app.post('/users/populate', async (req, res)=>{
    const {users} = req.body;
    console.log(users);
    User.insertMany(users)
        .then(data => {
            console.log(data.length+" users added");
            res.send({success: true})
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send({message: err.message})
        })

})

// Authorize by email

app.post('/confirm', async (req, res) => {
    const { uid, email } = req.body
    console.log("Attempting to retrieve profile for", email);
    if (!uid || !email) {
        return res.status(400).send({error: "Missing information necessary to verify user account."})
    }
    try {
        const user = await User.findOne({firebase: uid, email: email});
        if (!user) {
            return res.status(404).send({error: "User not found"})
        }
        console.log("User found. Sending profile info for", user.displayName);
        return res.send(user);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Get All Users
app.get('/users', async (req, res) => {
    console.log("Retrieving all users...");
    try {
        const users = await User.find();
        return res.send(users);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Get One User
app.get('/users/:id', async (req, res) => {
    const { id } = req.params
    console.log("Retrieving user with id: ", id);
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({error: "User not found"})
        }
        return res.send(user);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Create New User
app.post('/users', async (req, res) => {
    const {email, displayName, photo, bio, uid} = req.body;
    console.log("Creating new user: ", displayName);
    if (!email || !displayName || !uid) {
        return res.status(400).send({error: `Missing required fields from request body. Received ${email, displayName, uid}`})
    }
    try {
        const userObject = {firebase: uid, email, displayName, photo, bio}
        const newUser = await createUser(userObject);
        // sendUpdate({type: 'newuser', data: newUser})
        return res.status(201).send(newUser)
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
})

// Update User Info
app.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const {bio, photo, displayName} = req.body;
    const updateObject = {bio, photo, displayName};
    try {
        const updatedUser = await updateUser(id, updateObject);
        sendUpdate({type: 'updateUser', data: updatedUser})
        return res.send(updatedUser);
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
  });
  
 // Delete User
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await deleteUser(id);
      sendUpdate({type: 'deleteUser', data: deletedUser})
      return res.send(deletedUser);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  });
  

/* ----------------------------------------------------------
-----------------------  PIN ACTIONS  -----------------------
---------------------------------------------------------- */

// Like pin
app.post('/pins/:id/like/:user', async (req, res) => {
    const { id, user } = req.params;
    try {
        const updatedPin = await likePin(id, user)
        sendUpdate({type: 'updatePin', data: updatedPin})
        return res.send(updatedPin);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Unlike pin
app.delete('/pins/:id/like/:user', async (req, res) => {
    const { id, user } = req.params;
    try {
        const updatedPin = await unlikePin(id, user)
        sendUpdate({type: 'updatePin', data: updatedPin})
        return res.send(updatedPin);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// View pin
app.post('/pins/:id/view/:user', async (req, res) => {
    const { id, user } = req.params
    try {
        const updatedPin = await viewPin(id, user);
        sendUpdate({type: 'updatePin', data: updatedPin})
        return res.send(updatedPin);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

/* ----------------------------------------------------------
-----------------------  USER ACTIONS  ----------------------
---------------------------------------------------------- */

// Connect users
app.post('/users/:id/connect/:user', async (req, res) => {
    const { id, user } = req.params
    try {
        const updatedUser = await connectUsers(id, user);
        sendUpdate({type: 'updateUser', data: updatedUser});
        return res.send(updatedUser);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})

// Remove user connection

app.put('/users/:id/disconnect/:user', async (req, res) => {
    const { id, user } = req.params
    try {
        const updatedUser = await removeConnection(id, user)
        sendUpdate({type: 'updateUser', data: updatedUser});
        return res.send(updatedUser);
    } catch (err) {
        return res.status(500).send({error: err.message})
    }
})


// Keep server active on Render ---- DEPRECATED

// const seconds = ()=>Math.floor(Date.now()/1000)
// let started = seconds()

// const caffeine = setInterval(()=>{
//     const now = seconds()
//     const elapsed = now - started
//     if (elapsed !== 0 && elapsed % 600 == 0) {
//         axios.get('https://listen-here-api.onrender.com/ping')
//         .then(res => {
//             console.log(res.data)
//             started = now
//         })
//         .catch(err => {
//             console.log('Error making ping request:', err)
//         })
//     }
    
// }, 600000)