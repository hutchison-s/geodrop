import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        firebase: {type: String, required: true},
        email: {type: String, required: true},
        displayName: {type: String, required: true},
        photo: {type: String, required: false}, // Link to photo
        bio: {type: String, required: false},
        pins: {type: [Schema.Types.ObjectId], default: new Array()},
        liked: {type: [Schema.Types.ObjectId], default: new Array()},
        viewed: {type: [Schema.Types.ObjectId], default: new Array()},
        connections: {type: [Schema.Types.ObjectId], default: new Array()},
        lastLogin: {type: String, default: new Date().toISOString()}
    }
)

const User = model('User', userSchema, 'users')

export default User