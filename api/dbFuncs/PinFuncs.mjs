import Pin from "../schemas/Pin.js";
import User from "../schemas/User.js";

// CREATE PIN

export async function createPin(pin) {
    const newPin = await Pin.create(pin);
    if (!newPin) {
        throw new Error("Database error when creating pin")
    }
    const creator = await addPinToCreator(pin);
    return newPin;

}

async function addPinToCreator(pin) {
    const updatedUser = await User.findByIdAndUpdate(
        pin.creator,
        { $push: {pins: pin._id}},
        { new: true }     
    )
    
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
}


// DELETE PIN

export async function deletePin(id) {
    await deletePinReferences(id)
    const deletedPin = await Pin.findByIdAndDelete(id)
    if (!deletedPin) {
        throw new Error('Pin not found.');
    }
    return deletedPin;
}

export async function deletePinReferences(id) {
    const pin = await Pin.findById(id);
    const creatorId = pin.creator;

    const updatedCreator = await User.findByIdAndUpdate(
        creatorId, 
        {$pull: {pins: id}},
        {new: true}
    )
    if (!updatedCreator) {
        throw new Error('Error removing pin from user profile.');
    }
    await User.updateMany({viewed: id}, {$pull: {viewed: id}})
    await User.updateMany({liked: id}, {$pull: {liked: id}})
}

// LIKES

export async function likePin(pinId, userId) {
    const updatedPin = await Pin.findByIdAndUpdate(
        pinId,
        { $push: {likedBy: userId}},
        {new: true}
    )
    if (!updatedPin) {
        throw new Error("Pin not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: {liked: pinId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedPin;
}

export async function unlikePin(pinId, userId) {
    const updatedPin = await Pin.findByIdAndUpdate(
        pinId,
        { $pull: {likedBy: userId}},
        {new: true}
    )
    if (!updatedPin) {
        throw new Error("Pin not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: {liked: pinId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedPin;
}

// VIEWS

export async function viewPin(pinId, userId) {
    const updatedPin = await Pin.findByIdAndUpdate(
        pinId,
        { $push: {viewedBy: userId}},
        {new: true}
    )
    if (!updatedPin) {
        throw new Error("Pin not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: {viewed: pinId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }

    const returnPin = await pinLimiter(updatedPin);
    return returnPin;  
}

async function pinLimiter(pin) {
    const {viewLimit} = pin;
    const id = pin._id;
    if (viewLimit) {
        const newLimit = viewLimit - 1
        if (newLimit > 0) {
            const updatedPin = await Pin.findByIdAndUpdate(id, {viewLimit: {viewLimit: newLimit}});
            if (!updatedPin) {
                throw new Error("Pin not found");
            }
            return updatedPin;
        } else {
            const deletedPin = await deletePin(id)
            return deletedPin;
        }
    } else {
        return pin;
    }
}

export async function removePinView(pinId, userId) {
    const updatedPin = await Pin.findByIdAndUpdate(pinId, {$pull: {viewedBy: userId}}, {new: true});
    return updatedPin;
}