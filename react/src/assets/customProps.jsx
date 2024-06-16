import {string, oneOf, number, arrayOf, shape} from 'prop-types';

export const DropProp = shape({
    type: oneOf(['audio', 'video', 'image', 'text']).isRequired,
    data: string.isRequired,
    location: shape({
        lat: number,
        lng: number
    }).isRequired, 
    title: string.isRequired,
    creator: string.isRequired,
    creatorInfo: shape({
        displayName: string.isRequired,
        photo: string.isRequired
    }).isRequired,
    timestamp: string.isRequired,
    description: string.isRequired,
    tags: arrayOf(string),
    likedBy: arrayOf(string),
    viewedBy: arrayOf(string),
    viewLimit: number,
}).isRequired