// WHY: We need a TypeScript interface to define the shape of a User object for type safety across all components.
// WHAT: Exporting the User interface which describes all the properties a user object contains.
export interface User {
    // WHY: MongoDB assigns a unique _id to every document, and we need it to identify users in API calls.
    // WHAT: Declaring the _id field as a string type (MongoDB ObjectId represented as string).
    _id: string;

    // WHY: We display the user's name in the Navbar, Account page, and other UI components.
    // WHAT: Declaring the name field as a string type to hold the user's display name from Google.
    name: string;

    // WHY: We display the user's email in the Account page and use it as a unique identifier.
    // WHAT: Declaring the email field as a string type to hold the user's email address from Google.
    email: string;

    // WHY: We use the user's profile picture URL to display their avatar in the UI.
    // WHAT: Declaring the image field as a string type to hold the URL of the user's Google profile picture.
    image: string;

    // WHY: The user's role (customer/rider/seller) determines which features and pages they can access.
    // WHAT: Declaring the role field as a string type to hold the user's selected role.
    role: string;

    // WHY: Mongoose's toJSON transform can add a virtual 'id' field alongside '_id' for convenience.
    // WHAT: Declaring the id field as a string type which is the string version of _id added by Mongoose.
    id: string;
};

// WHY: We need a TypeScript interface to define the shape of location data obtained from the browser's Geolocation API.
// WHAT: Exporting the LocationData interface which describes the geographic position and address of the user.
export interface LocationData {
    // WHY: We need the latitude coordinate to identify the user's position for location-based features.
    // WHAT: Declaring the latitude field as a number type to hold the geographic latitude value.
    latitude: number;

    // WHY: We need the longitude coordinate to identify the user's position for location-based features.
    // WHAT: Declaring the longitude field as a number type to hold the geographic longitude value.
    longitude: number;

    // WHY: We need a human-readable address string to display the user's location in the UI.
    // WHAT: Declaring the formattedAddress field as a string type to hold the reverse-geocoded address.
    formattedAddress: string;
}

// WHY: We need a TypeScript interface for the React Context so all consuming components know what data is available.
// WHAT: Exporting the AppContextType interface which defines all the values and setters provided by the AppContext.
export interface AppContextType {
    // WHY: Components need access to the current user object to display user data and make user-specific decisions.
    // WHAT: Declaring the user field as User or null (null when not logged in).
    user: User | null;

    // WHY: Components need to know if the app is still loading user data to show loading states or spinners.
    // WHAT: Declaring the loading field as a boolean that is true while the initial user fetch is in progress.
    loading: boolean;

    // WHY: Components need to know if the user is authenticated to conditionally render content (e.g., Login vs Account).
    // WHAT: Declaring the isAuth field as a boolean that is true when the user is logged in.
    isAuth: boolean;

    // WHY: Components like Login need to update the user state after a successful Google login.
    // WHAT: Declaring the setUser setter function typed as React's state dispatch for User or null.
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

    // WHY: Components may need to update the loading state (e.g., when performing async operations).
    // WHAT: Declaring the setLoading setter function typed as React's state dispatch for boolean.
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;

    // WHY: Components like Login need to update the auth status after successful/failed authentication.
    // WHAT: Declaring the setIsAuth setter function typed as React's state dispatch for boolean.
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;

    // WHY: Components need access to the user's geographic location data for location-based features.
    // WHAT: Declaring the location field as LocationData or null (null when location hasn't been fetched yet).
    location: LocationData | null;

    // WHY: Components need to know if the location is still being fetched to show loading indicators.
    // WHAT: Declaring the loadingLocation field as a boolean that is true while geolocation is being determined.
    loadingLocation: boolean;

    // WHY: Components like the Navbar need the city name to display the user's current location.
    // WHAT: Declaring the city field as a string that holds the user's city name from reverse geocoding.
    city: string;
}




export interface IRestaurant {
    _id: string;
    name: string;

    description?: string;
    phone: number;
    images: string;
    ownerId: string;
    isVerified: boolean;

    autoLocation: {
        type: "Point",
        coordinates: [number, number],
        formattedAddress: string;

    }
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface IMenuItem {
    _id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    image?: string;

    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
