import Pin from "../schemas/Pin.js";
import User from "../schemas/User.js";
import { deletePin } from "./PinFuncs.mjs";

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
    const { pins, connections } = user;
    const id = user._id;
    const promises = [];
  
    // Remove user id from 'likedBy' in all pins user liked
    promises.push(Pin.updateMany({ likedBy: id }, { $pull: { likedBy: id } }));
    // Remove user id from 'viewedby' in all pins user viewed
    promises.push(Pin.updateMany({ viewedBy: id }, { $pull: { viewedBy: id } }));
    // Delete each pin user created and its references in other users liked and viewed lists
    pins.forEach((pin) => {
      promises.push(deletePin(pin));
    });
    // Remove all connections between user and other users
    connections.forEach((conn) => {
      promises.push(removeConnection(conn, id));
    });
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

export async function connectUsers(other, user) {
  const user1 = await User.findByIdAndUpdate(
    other,
    { $push: { connections: user } },
    { new: true }
  );
  if (!user1) {
    throw new Error("User not found");
  }
  const user2 = await User.findByIdAndUpdate(
    user,
    { $push: { connections: other } },
    { new: true }
  );

  if (!user2) {
    throw new Error("User not found");
  }

  return user2;
}

export async function removeConnection(other, user) {
  const user1 = await User.findByIdAndUpdate(
    other,
    { $pull: { connections: user } },
    { new: true }
  );
  if (!user1) {
    throw new Error("User not found");
  }
  const user2 = await User.findByIdAndUpdate(
    user,
    { $pull: { connections: other } },
    { new: true }
  );

  if (!user2) {
    throw new Error("User not found");
  }

  return user2;
}
