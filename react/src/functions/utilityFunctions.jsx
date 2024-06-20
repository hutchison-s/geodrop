// takes current position {lat, lng} and drop location {lat, lng}
// returns distance from position to drop in feet
export function distanceToDrop(position, dropLocation) {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371; // Radius of earth in meters

    const dLat = toRadians(dropLocation.lat - position.lat);
    const dLng = toRadians(dropLocation.lng - position.lng);
    const lat1 = toRadians(position.lat);
    const lat2 = toRadians(dropLocation.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = (R * c) * 3280.8398950131; // Distance in feet

    return distance 
}

export function feetToText(feet) {
    switch (true) {
      case feet < 500:
        return `Only ${Math.round(feet)} feet away!`;
      case feet < 1000:
        return `${Math.round(feet)} feet away`;
      default:
        return `${(feet / 5280).toFixed(1)} miles away`;
    }
  }

  export function readableTimeStamp(timestamp) {
    return new Date(timestamp).toLocaleString()
  }

  export function typeIcon(type) {
    switch (type) {
      case "audio":
        return "fa-solid fa-headphones";
      case "image":
        return "fa-solid fa-camera";
      case "video":
        return "fa-solid fa-video";
      default:
        return "fa-solid fa-file-lines";
    }
  }