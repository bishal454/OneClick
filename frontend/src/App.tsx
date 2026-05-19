import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import PublicRoute from './components/publicRoute'
import ProtectedRoute from './components/protectedRoute'
import Login from './pages/Login'
import SelectRole from './pages/SelectRole';
import Navbar from './components/navbar';
import Account from './pages/Account';
import { UseAppData } from './context/AppContext'
import Restaurant from './pages/Restaurant'
import RestaurantPage from './pages/RestaurantPage'
import Cart from './pages/Cart'
import AddAddressPage from './pages/Address'
import CheckOut from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'


const App = () => {
  const { user } = UseAppData()

  if (user && user.role === "seller") {
    return <Restaurant />;
  }
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/paymentsuccess/:paymentId' element={<PaymentSuccess />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/ordersuccess' element={<OrderSuccess />} />
            <Route path='/address' element={<AddAddressPage />} />
            <Route path='/checkout' element={<CheckOut />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/select-role' element={<SelectRole />} />
            <Route path='/account' element={<Account />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter >
    </>
  );

};


export default App