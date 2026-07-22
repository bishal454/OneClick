
// WHY: We need the global context hook to access the user's auth status and city name for the navbar display.
// WHAT: Importing the UseAppData custom hook to consume the AppContext values in this component.
import { UseAppData } from "../context/AppContext";

// WHY: We need useLocation to detect the current page URL and useSearchParams to manage URL search queries.
// WHAT: Importing useLocation (returns the current URL info) and useSearchParams (manages URL query parameters) from react-router-dom.
import { useLocation, useSearchParams } from "react-router-dom";

// WHY: We need useState to manage the local search input state in the navbar's search bar.
// WHAT: Importing the useState hook from React to create and manage the search input's local state.
import { useState } from "react";

// WHY: We need the Link component to create navigation links that work with React Router's client-side routing.
// WHAT: Importing the Link component from react-router-dom which renders <a> tags that navigate without page reloads.
import { Link } from "react-router-dom";

// WHY: We need a shopping cart icon to display in the navbar for the cart link.
// WHAT: Importing the CgShoppingCart icon component from the react-icons library (CodingGarden icon set).
import { CgShoppingCart } from "react-icons/cg";

// WHY: We need the useEffect hook to set up a debounced search that updates URL params after a delay.
// WHAT: Importing the useEffect hook from React to run side effects when the search state changes.
import { useEffect } from "react";

// WHY: We need a map pin icon to display next to the user's location and the search bar in the navbar.
// WHAT: Importing the BiMapPin icon component from the react-icons library (BoxIcons set).
import { BiMapPin, BiSearch } from "react-icons/bi";

// WHY: We need a Navbar component that displays navigation links, search bar, and user location across all pages.
// WHAT: Defining the Navbar functional component that renders the top navigation bar of the application.
const Navbar = () => {

    // WHY: We need the user's auth status to show "Account" or "Login" link, and city name for the location display.
    // WHAT: Destructuring isAuth and city from the global context using the UseAppData hook.
    const { isAuth, city, quantity } = UseAppData();

    // WHY: We need the current URL path to conditionally show the search bar only on the home page.
    // WHAT: Calling useLocation() to get the current location object which contains the pathname property.
    const currLocation = useLocation();

    // WHY: We only want to show the search bar and location indicator on the home page, not on login/account pages.
    // WHAT: Checking if the current pathname is exactly "/" to determine if we're on the home page.
    const isHomePage = currLocation.pathname === "/";

    // WHY: We need to read and update URL search parameters so the search query persists in the URL.
    // WHAT: Calling useSearchParams() to get the current search params and a function to update them.
    const [searchParams, setSearchParams] = useSearchParams();

    // WHY: We need a local state for the search input that initializes from the URL's "search" query parameter.
    // WHAT: Initializing the search state with the value of the "search" URL parameter, defaulting to empty string.
    const [search, setSearch] = useState(searchParams.get("search") || "");

    // WHY: We want to debounce the search so the URL doesn't update on every keystroke, reducing unnecessary re-renders.
    // WHAT: Using useEffect to set a 400ms timer before updating URL search params, clearing it on each new keystroke.
    useEffect(() => {
        // WHY: We delay updating the URL params by 400ms so rapid typing doesn't cause excessive URL updates.
        // WHAT: Setting a timeout that will update the search params after 400ms of no typing (debounce pattern).
        const timer = setTimeout(() => {
            // WHY: If there's a search value, we add it to the URL; otherwise, we clear the search params.
            // WHAT: Checking if search is truthy and setting or clearing the URL search parameters accordingly.
            if (search) {
                setSearchParams({ search })
            } else {
                setSearchParams({});
            }
        }, 400)

        // WHY: If the user types again before 400ms, we cancel the previous timer to prevent stale updates.
        // WHAT: Returning a cleanup function that clears the timeout, implementing the debounce pattern.
        return () => clearTimeout(timer)

    }, [search])

    // WHY: The component must return JSX that defines the visual layout of the navigation bar.
    // WHAT: Returning the JSX structure for the navbar with logo, cart, auth links, and conditional search bar.
    return (
        // WHY: The navbar needs a full-width container with a white background and subtle shadow for visual separation.
        // WHAT: Rendering a div with TailwindCSS classes for full width, white background, and a small shadow.
        <div className="w-full bg-white shadow-sm ">
            {/* WHY: We need a centered container with flexbox to align the logo on the left and links on the right. */}
            {/* WHAT: Rendering a flex container with max width, centered alignment, and padding for the main navbar row. */}
            <div className="max-auto flex max-w-7xl itmes-center justify-between px-4 py-3 ">
                {/* WHY: The app name "OneClick" should be a clickable link that navigates to the home page. */}
                {/* WHAT: Rendering a Link component styled as the brand logo with the app's primary color. */}
                <Link
                    to={"/"}
                    className="text-2xl font-bold text-[#E23774] cursor-pointer"
                >
                    OneClick
                </Link>
                {/* WHY: We need a container to group the cart icon and auth link on the right side of the navbar. */}
                {/* WHAT: Rendering a flex container with a gap between the cart and login/account links. */}
                <div className="flex items-center gap-4">
                    {/* WHY: Users need a visible cart link with a badge showing the number of items in their cart. */}
                    {/* WHAT: Rendering a Link to /cart with a shopping cart icon and a badge counter. */}
                    <Link to={"/cart"} className="relative">
                        {/* WHY: The cart icon provides a recognizable visual indicator for the shopping cart feature. */}
                        {/* WHAT: Rendering the CgShoppingCart icon with the app's primary color and a 6x6 size. */}
                        <CgShoppingCart className="h-6 w-6 text-[#E23744]" />
                        {/* WHY: The badge shows the current cart count so users can see how many items they've added. */}
                        {/* WHAT: Rendering a small red circular badge positioned at the top-right corner of the cart icon with a count of 0. */}
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center
             justify-center rounded-full bg-[#E23744] text-xs 
             font-semibold  text-white" >
                            {quantity}
                        </span>
                    </Link>

                    {/* WHY: We show "Account" link if user is logged in, or "Login" link if they're not. */}
                    {/* WHAT: Conditionally rendering either an Account link or Login link based on the isAuth state. */}
                    {
                        isAuth ? (
                            // WHY: Authenticated users should be able to navigate to their account page.
                            // WHAT: Rendering a Link to /account with the app's primary color styling.
                            <Link to="/account" className="font-medium text-[#E23744]">
                                Account
                            </Link>
                        )
                            : (
                                // WHY: Unauthenticated users need a login link to navigate to the login page.
                                // WHAT: Rendering a Link to /login with the app's primary color styling.
                                <Link to="/login" className="font-medium text-[#E23744]">
                                    Login
                                </Link>
                            )}
                </div>
            </div>
            {/*search bar*/}

            {/* WHY: The search bar and location indicator should only appear on the home page, not on other pages. */}
            {/* WHAT: Conditionally rendering the search section only when isHomePage is true. */}
            {isHomePage && (
                // WHY: The search bar section needs a top border to visually separate it from the main navbar row.
                // WHAT: Rendering a div with a top border and padding for the search bar area.
                <div className="border-t px-4 py-3">
                    {/* WHY: The search bar needs a bordered container to group the location indicator and search input. */}
                    {/* WHAT: Rendering a centered flex container with a border and rounded corners for the search bar. */}
                    <div className=" mx-auto flex max-w-7xl items-center  rounded-lg border shodow-sm">
                        {/* WHY: Users need to see their current location next to the search bar for context. */}
                        {/* WHAT: Rendering a section with a map pin icon and the city name, separated by a right border. */}
                        <div className="flex item-center gap-2 px-3 border-r text-gray-700">
                            {/* WHY: The map pin icon visually indicates that this section shows location information. */}
                            {/* WHAT: Rendering the BiMapPin icon in the app's primary red color. */}
                            <BiMapPin className="h-4 w-4 text-[#E23744]" />
                            {/* WHY: Displaying the city name with truncation in case it's too long for the available space. */}
                            {/* WHAT: Rendering the city text in a span with small font size and max width truncation. */}
                            <span className="text-sm truncate max-w-35">{city}</span>
                        </div>
                        {/* WHY: Users need a search input to find restaurants by name or keyword. */}
                        {/* WHAT: Rendering a flex container with a search icon and a text input for the search functionality. */}
                        <div className="flex flex-1 items-center gap-2 px-3">
                            {/* WHY: The search icon provides a visual cue that this is a search input field. */}
                            {/* WHAT: Rendering a BiSearch icon as a search indicator. */}
                            <BiSearch className="h-4 w-4 text-gray-400" />
                            {/* WHY: Users need a text input field to type their search query for finding restaurants. */}
                            {/* WHAT: Rendering a controlled text input that updates the search state on every change and fills the remaining space. */}
                            <input type="text" placeholder="Search for restaurant" value={search}
                                onChange={(e) => setSearch(e.target.value)} className="w-full py-2 text-sm
                                 outline-none "/>
                        </div>
                    </div>
                </div>
            )}
        </div >
    )
}

// WHY: The App.tsx file needs to import this component to render it in the layout above all routes.
// WHAT: Exporting the Navbar component as the default export for use in the main App component.
export default Navbar