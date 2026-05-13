// WHY: We need React Router to enable client-side navigation between different pages without full page reloads.
// WHAT: Importing BrowserRouter (provides URL-based routing), Routes (container for route definitions), and Route (individual route definition) from react-router-dom.
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// WHY: We need the Home page component to render when the user navigates to the root "/" path.
// WHAT: Importing the Home page component from the pages directory.
import Home from './pages/Home'

// WHY: We need a toast notification system to display success/error messages to the user (e.g., "Logged Successfully").
// WHAT: Importing the Toaster component from react-hot-toast which renders toast notifications on the screen.
import { Toaster } from 'react-hot-toast'

// WHY: We need a PublicRoute wrapper that redirects authenticated users away from pages like Login.
// WHAT: Importing the PublicRoute component which only allows unauthenticated users to access its child routes.
import PublicRoute from './components/publicRoute'

// WHY: We need a ProtectedRoute wrapper that redirects unauthenticated users to the login page.
// WHAT: Importing the ProtectedRoute component which only allows authenticated users to access its child routes.
import ProtectedRoute from './components/protectedRoute'

// WHY: We need the Login page component to render the Google OAuth login UI.
// WHAT: Importing the Login page component from the pages directory.
import Login from './pages/Login'

// WHY: We need the SelectRole page where new users choose their role (customer, rider, seller) after first login.
// WHAT: Importing the SelectRole page component from the pages directory.
import SelectRole from './pages/SelectRole';

// WHY: We need the Navbar component to display the top navigation bar on every page of the application.
// WHAT: Importing the Navbar component from the components directory.
import Navbar from './components/navbar';

// WHY: We need the Account page component where users can view their profile and log out.
// WHAT: Importing the Account page component from the pages directory.
import Account from './pages/Account';


// WHY: We need a root component that defines the entire application structure, routing, and layout.
// WHAT: Defining the App functional component that returns the complete app layout with routing.
const App = () => {
  // WHY: The component must return JSX that defines the visual structure and routing of the application.
  // WHAT: Returning a React Fragment containing the router, routes, and global components.
  return (
    // WHY: React Fragment (<></>) allows us to return multiple elements without adding an extra DOM node.
    // WHAT: Wrapping the entire app content in a Fragment to avoid an unnecessary wrapper div in the DOM.
    <>
      {/* WHY: BrowserRouter enables HTML5 history-based routing for clean URLs (e.g., /login instead of #/login). */}
      {/* WHAT: Wrapping all routes and navigation components inside BrowserRouter to enable client-side routing. */}
      <BrowserRouter>
        {/* WHY: The Navbar should appear on every page, so it's placed outside of Routes but inside BrowserRouter. */}
        {/* WHAT: Rendering the Navbar component at the top of every page for consistent navigation. */}
        <Navbar />
        {/* WHY: Routes component acts as a container that matches the current URL to the appropriate Route. */}
        {/* WHAT: Defining the Routes container which will render only the first matching Route's element. */}
        <Routes>
          {/* WHY: Login should only be accessible to unauthenticated users; authenticated users should be redirected to home. */}
          {/* WHAT: Wrapping the login route inside PublicRoute which redirects authenticated users to "/". */}
          <Route element={<PublicRoute />}>
            {/* WHY: Users need a /login URL path to access the Google OAuth login page. */}
            {/* WHAT: Defining the /login route that renders the Login page component. */}
            <Route path='/login' element={<Login />} />
          </Route>
          {/* WHY: Home, SelectRole, and Account pages should only be accessible to authenticated users. */}
          {/* WHAT: Wrapping protected pages inside ProtectedRoute which redirects unauthenticated users to /login. */}
          <Route element={<ProtectedRoute />}>
            {/* WHY: Authenticated users need a home page at the root "/" URL as their main landing page. */}
            {/* WHAT: Defining the "/" route that renders the Home page component. */}
            <Route path='/' element={<Home />} />
            {/* WHY: New users without a role need a page to select their role before accessing the full app. */}
            {/* WHAT: Defining the /select-role route that renders the SelectRole page component. */}
            <Route path='/select-role' element={<SelectRole />} />
            {/* WHY: Users need an account page to view their profile, access orders/addresses, and log out. */}
            {/* WHAT: Defining the /account route that renders the Account page component. */}
            <Route path='/account' element={<Account />} />
          </Route>
        </Routes>
        {/* WHY: The Toaster component needs to be present in the DOM to render toast notifications triggered anywhere in the app. */}
        {/* WHAT: Rendering the Toaster component from react-hot-toast to display success/error toast messages globally. */}
        <Toaster />
      </BrowserRouter >
    </>
  );

};


// WHY: The main.tsx file needs to import this component to render it as the root of the application.
// WHAT: Exporting the App component as the default export for use in main.tsx.
export default App