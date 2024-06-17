# GeoDrop API Documentation

## Overview

This API allows for managing users and drops, including creating, updating, deleting, and viewing drops, as well as connecting and disconnecting users.

## Endpoints

### Drops

#### Get All Drops
- **URL:** `/drops`
- **Method:** `GET`
- **Description:** Retrieve all drops.
- **Response:** Array of drop objects.

#### Get One Drop
- **URL:** `/drops/:id`
- **Method:** `GET`
- **Description:** Retrieve a specific drop by ID.
- **Response:** Drop object.

#### Create New Drop
- **URL:** `/drops`
- **Method:** `POST`
- **Description:** Create a new drop and add it to the creator's drop array.
- **Request Body:**
  - `type` (string, required)
  - `data` (string, required)
  - `creator` (string, required)
  - `createdBy` (string, required)
  - `title` (string, required)
  - `location` (string, required)
  - `viewLimit` (number, optional)
  - `tags` (array of strings, optional)
  - `description` (string, optional)
- **Response:** Created drop object.

#### Delete Drop
- **URL:** `/drops/:id`
- **Method:** `DELETE`
- **Description:** Delete a specific drop by ID.
- **Response:** Deleted drop object.

#### Like Drop
- **URL:** `/drops/:id/like/:user`
- **Method:** `POST`
- **Description:** Add a user to the drop's likedBy array and add the drop to the user's liked array.
- **Response:** Updated drop object.

#### Unlike Drop
- **URL:** `/drops/:id/like/:user`
- **Method:** `DELETE`
- **Description:** Remove a user from the drop's likedBy array and remove the drop from the user's liked array.
- **Response:** Updated drop object.

#### View Drop
- **URL:** `/drops/:id/view/:user`
- **Method:** `POST`
- **Description:** Add a user to the drop's viewedBy array and add the drop to the user's viewed array.
- **Response:** Updated drop object.

### Users

#### Confirm User
- **URL:** `/confirm`
- **Method:** `POST`
- **Description:** Confirm if a user exists, if not, create one.
- **Request Body:**
  - `uid` (string, required)
  - `email` (string, required)
- **Response:** User object.

#### Get All Users
- **URL:** `/users`
- **Method:** `GET`
- **Description:** Retrieve all users.
- **Response:** Array of user objects.

#### Get One User
- **URL:** `/users/:id`
- **Method:** `GET`
- **Description:** Retrieve a specific user by ID.
- **Response:** User object.

#### Create New User
- **URL:** `/users`
- **Method:** `POST`
- **Description:** Create a new user.
- **Request Body:**
  - `email` (string, required)
  - `displayName` (string, required)
  - `photo` (string, optional)
  - `bio` (string, optional)
  - `uid` (string, required)
- **Response:** Created user object.

#### Update User Info
- **URL:** `/users/:id`
- **Method:** `PATCH`
- **Description:** Update a user's info (name, email, displayName, bio, or photo).
- **Request Body:**
  - `bio` (string, optional)
  - `photo` (string, optional)
  - `displayName` (string, optional)
- **Response:** Updated user object.

#### Delete User
- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Description:** Delete a specific user by ID.
- **Response:** Deleted user object.

#### Connect Users
- **URL:** `/users/:id/connect/:user`
- **Method:** `POST`
- **Description:** Add user IDs to each other's connection arrays.
- **Response:** Updated user object.

#### Remove User Connection
- **URL:** `/users/:id/disconnect/:user`
- **Method:** `PUT`
- **Description:** Remove user IDs from each other's connection arrays.
- **Response:** Updated user object.

## Error Handling

Each endpoint can return the following error responses:
- `400 Bad Request`: When required fields are missing or invalid data is provided.
- `404 Not Found`: When the requested resource is not found.
- `500 Internal Server Error`: When an internal server error occurs.