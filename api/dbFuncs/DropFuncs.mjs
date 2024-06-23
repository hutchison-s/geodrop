import Drop from "../schemas/Drop.js";
import User from "../schemas/User.js";

// CREATE DROP

export async function createDrop(drop) {
    const creatorDoc = await User.findById(drop.creator);
    const modifiedDrop = {
        ...drop,
        creator: undefined,
        creatorInfo: {
            _id: creatorDoc._id,
            displayName: creatorDoc.displayName,
            photo: creatorDoc.photo,
        }
    }
    const newDrop = await Drop.create(modifiedDrop);
    if (!newDrop) {
        throw new Error("Database error when creating drop")
    }
    await addDropToCreator(newDrop);
    return newDrop;

}

async function addDropToCreator(drop) {
    const updatedUser = await User.findByIdAndUpdate(
        drop.creatorInfo._id,
        { $push: {drops: drop._id}},
        { new: true }     
    )
    
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
}


// DELETE DROP

export async function deleteDrop(id) {
    await deleteDropReferences(id)
    const deletedDrop = await Drop.findByIdAndDelete(id)
    if (!deletedDrop) {
        throw new Error('Drop not found.');
    }
    return deletedDrop;
}

export async function deleteDropReferences(id) {
    const drop = await Drop.findById(id);
    const creatorId = drop.creatorInfo._id;

    const updatedCreator = await User.findByIdAndUpdate(
        creatorId, 
        {$pull: {drops: id}},
        {new: true}
    )
    if (!updatedCreator) {
        throw new Error('Error removing drop from user profile.');
    }
    await User.updateMany({viewed: id}, {$pull: {viewed: id}})
    await User.updateMany({liked: id}, {$pull: {liked: id}})
}

// LIKES

export async function likeDrop(dropId, userId) {
    const dropTarget = await Drop.findById(dropId);
    if (dropTarget.likedBy.includes(userId)) {
        throw new Error("Drop already liked")
    }
    const updatedDrop = await Drop.findByIdAndUpdate(
        dropId,
        { $push: {likedBy: userId}},
        {new: true}
    )
    if (!updatedDrop) {
        throw new Error("Drop not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: {liked: dropId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedDrop;
}

export async function unlikeDrop(dropId, userId) {
    const dropTarget = await Drop.findById(dropId);
    if (!dropTarget.likedBy.includes(userId)) {
        throw new Error("Cannot unlike because user has not liked the drop yet.")
    }
    const updatedDrop = await Drop.findByIdAndUpdate(
        dropId,
        { $pull: {likedBy: userId}},
        {new: true}
    )
    if (!updatedDrop) {
        throw new Error("Drop not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: {liked: dropId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedDrop;
}

// VIEWS

export async function viewDrop(dropId, userId) {
    const dropTarget = await Drop.findById(dropId);
    if (dropTarget.viewedBy.includes(userId)) {
        throw new Error("Drop already viewed")
    }
    const updatedDrop = await Drop.findByIdAndUpdate(
        dropId,
        { $push: {viewedBy: userId}},
        {new: true}
    )
    if (!updatedDrop) {
        throw new Error("Drop not found");
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: {viewed: dropId} },
        { new: true }
      );
  
    if (!updatedUser) {
        throw new Error('User not found');
    }
    const returnDrop = await dropLimiter(updatedDrop);
    return returnDrop;  
}

async function dropLimiter(drop) {
    const {viewLimit} = drop;
    const id = drop._id;
    if (viewLimit) {
        const newLimit = viewLimit - 1
        if (newLimit > 0) {
            const updatedDrop = await Drop.findByIdAndUpdate(id, {viewLimit: {viewLimit: newLimit}});
            if (!updatedDrop) {
                throw new Error("Drop not found");
            }
            return updatedDrop;
        } else {
            const deletedDrop = await deleteDrop(id)
            return deletedDrop;
        }
    } else {
        return drop;
    }
}

export async function removeDropView(dropId, userId) {
    const updatedDrop = await Drop.findByIdAndUpdate(dropId, {$pull: {viewedBy: userId}}, {new: true});
    return updatedDrop;
}