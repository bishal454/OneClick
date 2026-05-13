// WHY: We need Mongoose to define schemas, create models, and interact with MongoDB collections.
// WHAT: Importing mongoose (for model creation), Document (for typing), and Schema (for schema definition) from mongoose.
import mongoose, { Document, Schema } from "mongoose";

// WHY: We need a TypeScript interface that defines the shape of a User document for type safety across the application.
// WHAT: Exporting the IUser interface that extends Mongoose Document, adding our custom user fields on top of built-in document fields.
export interface IUser extends Document {
    // WHY: Every user has a display name that we get from their Google profile.
    // WHAT: Declaring the name field as a required string property.
    name: string,

    // WHY: The email is the unique identifier for each user, obtained from their Google account.
    // WHAT: Declaring the email field as a required string property.
    email: string,

    // WHY: We store the user's Google profile picture URL to display their avatar in the frontend.
    // WHAT: Declaring the image field as a required string property that holds the profile picture URL.
    image: string,

    // WHY: Users must select a role (customer, rider, seller) after first login to determine their app experience.
    // WHAT: Declaring the role field as a string property (starts as null until the user selects one).
    role: string,
}

// WHY: We need a Mongoose schema to define the structure, validation rules, and data types for user documents in MongoDB.
// WHAT: Creating a new Schema instance typed with IUser, defining each field's type and constraints.
const schema: Schema<IUser> = new Schema({
    // WHY: The name field must be present for every user since we display it in the UI.
    // WHAT: Defining the name field as a required String type in the Mongoose schema.
    name: {
        type: String,
        required: true
    },

    // WHY: The email must be present and unique to prevent duplicate accounts and serve as the user's identifier.
    // WHAT: Defining the email field as a required, unique String type — Mongoose will create a unique index on this field.
    email: {
        type: String,
        required: true,
        unique: true
    },

    // WHY: The profile image URL must be stored so we can render the user's avatar without re-fetching from Google.
    // WHAT: Defining the image field as a required String type in the Mongoose schema.
    image: {
        type: String,
        required: true
    },

    // WHY: The role starts as null because users choose their role after their first login on the SelectRole page.
    // WHAT: Defining the role field as a String type with a default value of null.
    role: {
        type: String,
        default: null,
    },

}
    // WHY: We want Mongoose to automatically track when each user document was created and last updated.
    // WHAT: Enabling the timestamps option which automatically adds createdAt and updatedAt fields to each document.
    , {
        timestamps: true,
    });

// WHY: We need a Mongoose model to perform CRUD operations (find, create, update, delete) on the "user" collection.
// WHAT: Creating and assigning a Mongoose model named "user" using the defined schema, typed with IUser for type safety.
const User = mongoose.model<IUser>("user", schema);

// WHY: Other files (controllers) need to import the User model to query and manipulate user data in the database.
// WHAT: Exporting the User model as the default export so it can be imported in controllers and other files.
export default User;
