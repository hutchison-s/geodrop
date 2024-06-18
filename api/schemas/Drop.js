import { Schema, model } from "mongoose"

const positionSchema = new Schema({
    lat: {type: Number, required: true}, 
    lng: {type: Number, required: true}
})

const dropSchema = new Schema(
    {
        // Required
        type: {type: String, enum: ['audio', 'video', 'image', 'text'], required: true},
        data: {type: String, required: true},
        path: {type: String},
        location: {type: positionSchema, required: true}, 
        title: {type: String, required: true},
        creatorInfo: {
            _id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
            displayName: {type: String, required: true},
            photo: {type: String, required: false}
        },

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

const Drop = model('Drop', dropSchema, 'drops')

export default Drop