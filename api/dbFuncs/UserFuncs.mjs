import Drop from "../schemas/Drop.js";
import User from "../schemas/User.js";
import { deleteDrop } from "./DropFuncs.mjs";

// CREATE

export async function createUser(user) {
  const newUser = await User.create(user);
  if (!newUser) {
    throw new Error("Error creating user");
  }
  return newUser;
}

// DELETE

export async function deleteUser(id) {
    const user = await User.findById(id);
    await cascadeUserDelete(user);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("User not found.");
    }
    return deletedUser;
  }
  
  async function cascadeUserDelete(user) {
    const { drops, followers, following } = user;
    const id = user._id;
    const promises = [];
  
    // Remove user id from 'likedBy' in all drops user liked
    promises.push(Drop.updateMany({ likedBy: id }, { $pull: { likedBy: id } }));
    // Remove user id from 'viewedby' in all drops user viewed
    promises.push(Drop.updateMany({ viewedBy: id }, { $pull: { viewedBy: id } }));
    // Delete each drop user created and its references in other users liked and viewed lists
    drops.forEach((drop) => {
      promises.push(deleteDrop(drop));
    });
    // Unfollow all users
    following.forEach((user) => {
      promises.push(unfollowUser(user, id));
    });
    // Remove user from all other following lists
    followers.forEach((user)=>{
      promises.push(unfollowUser(id, user))
    })

    // Await resolution of all promises
    const results = await Promise.all(promises);
  
    return results;
  }

// UPDATE

export async function updateUser(id, updateObject) {
  const updatedUser = await User.findByIdAndUpdate(id, updateObject, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error("User not found.");
  }
  return updatedUser;
}

// CONNECTIONS

export async function followUser(other, user) {
  const user1 = await User.findByIdAndUpdate(
    other,
    { $push: { followers: user } },
    { new: true }
  );
  if (!user1) {
    throw new Error("User not found");
  }
  const user2 = await User.findByIdAndUpdate(
    user,
    { $push: { following: other } },
    { new: true }
  );

  if (!user2) {
    throw new Error("User not found");
  }

  return user2;
}

export async function unfollowUser(other, user) {
  const user1 = await User.findByIdAndUpdate(
    other,
    { $pull: { followers: user } },
    { new: true }
  );
  if (!user1) {
    throw new Error("User not found");
  }
  const user2 = await User.findByIdAndUpdate(
    user,
    { $pull: { following: other } },
    { new: true }
  );

  if (!user2) {
    throw new Error("User not found");
  }

  return user2;
}
