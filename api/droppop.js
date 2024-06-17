import axios from 'axios'
const drops = [
  {
    type: 'text',
    data: 'A river flows so wide,\nWith secrets it does hide.\nFish swim in delight,\nBirds take flight,\nNature’s endless tide.',
    title: 'Nature',
    location: { lat: '40.758', lng: '-96.641' },
    creator: '66708159672369e2fc11a6e5'
  },
  {
    type: 'image',
    data: 'https://picsum.photos/600/800',
    title: 'Golden Sunset',
    location: { lat: '40.745', lng: '-96.657' },
    creator: '66708159672369e2fc11a6f4'
  },
  {
    type: 'image',
    data: 'https://picsum.photos/600/800',
    title: 'Ocean Breeze',
    location: { lat: '40.739', lng: '-96.629' },
    creator: '66708159672369e2fc11a6ea'
  },
  {
    type: 'text',
    data: 'In the city’s bustling core,\nPeople rush and seek for more.\nBut the sun sets bright,\nBrings them back to light,\nNature’s peace they can’t ignore.',
    title: 'Society',
    location: { lat: '40.733', lng: '-96.639' },
    creator: '66708159672369e2fc11a6e9'
  },
  {
    type: 'image',
    data: 'https://picsum.photos/600/800',
    title: 'Rainy Day',
    location: { lat: '40.731', lng: '-96.663' },
    creator: '66708159672369e2fc11a6ed'
  },
  {
    type: 'text',
    data: 'A river flows so wide,\nWith secrets it does hide.\nFish swim in delight,\nBirds take flight,\nNature’s endless tide.',
    title: 'Nature',
    location: { lat: '40.748', lng: '-96.659' },
    creator: '66708159672369e2fc11a6f1'
  },
  {
    type: 'text',
    data: 'In the springtime dawn,\nCherry blossoms fill the air,\nBeauty all around.',
    title: 'Nature',
    location: { lat: '40.752', lng: '-96.654' },
    creator: '66708159672369e2fc11a6f0'
  },
  {
    type: 'image',
    data: 'https://picsum.photos/600/800',
    title: 'City Lights',
    location: { lat: '40.753', lng: '-96.649' },
    creator: '66708159672369e2fc11a6e3'
  },
  {
    type: 'image',
    data: 'https://picsum.photos/600/800',
    title: 'Starry Night',
    location: { lat: '40.751', lng: '-96.664' },
    creator: '66708159672369e2fc11a6e5'
  },
  {
    type: 'text',
    data: 'Silent autumn night,\nLeaves whisper in the cool breeze,\nNature’s gentle breath.',
    title: 'Nature',
    location: { lat: '40.732', lng: '-96.633' },
    creator: '66708159672369e2fc11a6f2'
  }
]


async function populate() {
    let i = 1;
    for (const drop of drops) {
        const res = await axios.post('http://localhost:5000/drops', drop);    
        if (res.status === 201) {
            console.log("dropped successfully ", i);
            i++;
        }
    }   
}

populate();
