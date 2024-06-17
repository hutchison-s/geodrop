import { Schema, model } from "mongoose"

const userSchema = new Schema(
    {
        firebase: {type: String, required: true},
        email: {type: String, required: true},
        displayName: {type: String, required: true},
        photo: {type: String, required: false}, // Link to photo
        bio: {type: String, required: false},
        drops: {type: [{type: Schema.Types.ObjectId, ref: 'Drop'}], default: new Array()},
        liked: {type: [{type: Schema.Types.ObjectId, ref: 'Drop'}], default: new Array()},
        viewed: {type: [{type: Schema.Types.ObjectId, ref: 'Drop'}], default: new Array()},
        following: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], default: new Array()},
        followers: {type: [{type: Schema.Types.ObjectId, ref: 'User'}], default: new Array()},
        lastLogin: {type: String, default: new Date().toISOString()},
        accountCreated: {type: String, default: new Date().toISOString()}
    }
)

const User = model('User', userSchema, 'users')

export default User