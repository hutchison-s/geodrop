import { Schema, model } from "mongoose"

const positionSchema = new Schema({
    lat: {type: Number, required: true}, 
    lng: {type: Number, required: true}
})

const pinSchema = new Schema(
    {
        // Required
        type: {type: String, enum: ['audio', 'video', 'image', 'text'], required: true},
        data: {type: String, required: true},
        location: {type: positionSchema, required: true}, 
        title: {type: String, required: true},
        creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},

        // Default values on creation
        timestamp: {type: String, default: new Date().toISOString()},
        description: {type: String, default: 'Indescribable...'},
        tags: {type: [String], default: new Array()},
        likedBy: {type: [Schema.Types.ObjectId], default: new Array()},
        viewedBy: {type: [Schema.Types.ObjectId], default: new Array()},

        // Optional, maybe undefined
        viewLimit: {type: Number, required: false},
        
    }
)

const Pin = model('Pin', pinSchema, 'pins')

export default Pin