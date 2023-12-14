// Import React hooks and components
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import './App.css'; 
import MakeABooking from './pages/booking/MakeABooking';
import ClassDetail from './pages/booking/ClassDetail';
import MyBookings from './pages/booked/MyBookings';
import MyProfile from './pages/profile/MyProfile';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import NotFound from './pages/NotFound';
import Sidebar from "./components/layout/Sidebar";
import AddClass from "./pages/admin/AddClass";
import EditMembers from './pages/admin/EditMembers';
import EditTimetables from './pages/admin/EditTimetables';

//? APOLLO CLIENT
// Import Apollo Client and related dependencies
// ApolloClient - Used to connect to the GraphQL server 
// InMemoryCache - Used to cache GraphQL data
// ApolloProvider - Used to provide access to the Apollo Client
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});


function App() {
  const [user, setUser] = useState(null); 

  //Saves user to State and Session Storage
  const handleLogin = (user) => {
    setUser(user); // Set user to state
    saveTokenToSessionStorage(user); // Save user to session storage
  };

  //Clears user from State and Session Storage
  const handleLogout = () => {
    client.clearStore(); // Clear Apollo Client cache
    sessionStorage.removeItem("user"); // Clear session storage
    setUser(null);  // Clear user from state
  };

  //Saves user to Session Storage
  function saveTokenToSessionStorage(user) {
    sessionStorage.setItem("user", JSON.stringify(user)); // Save user to session storage as a string
  }

    //Gets user from Session Storage
    const getUserFromSessionStorage = () => {
      try {
        const userString = sessionStorage.getItem("user"); // Get user from session storage
        const user = JSON.parse(userString); // Parse user to JSON
        return user;
      } catch (error) {
        sessionStorage.setItem("user", ""); // Clear session storage
        return null;
      }
    };
  
    //Protected Route
    // If user is not logged in, redirect to login page
    // Component - Component to render
    // ...rest - Other props
    function ProtectedRoute({ component: Component, ...rest }) {
      const user = getUserFromSessionStorage(); // Get user from session storage
      // If user is not logged in, redirect to login page
      if (!user) {
        return <Navigate to="/login" replace />; // Redirect to login page
      }
      return <Component {...rest} user={user} />; // Render protected component
    }
  
    //Check if user is logged in on page load
    useEffect(() => {
      const user = getUserFromSessionStorage();
      if (user) {
        setUser(user);
      }
    }, []);

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <div className="App">
          { user && <Sidebar user={user} onLogout={handleLogout}/>}
          <Container className="app-content">
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
              <Route path="/signup" element={<Signup onLogin={handleLogin}/>}/>
              <Route path="/" element={<ProtectedRoute component={MakeABooking} />} />
              <Route path="/my-bookings" element={<ProtectedRoute component={MyBookings} />} />
              <Route path="/edit-timetables" element={<ProtectedRoute component={EditTimetables} user={user}/>} />
              <Route path="/add-class" element={<ProtectedRoute component={AddClass} user={user}/>} />
              <Route path="/edit-members" element={<ProtectedRoute component={EditMembers} user={user} />} />
              <Route path="/class-detail/:day/:courseName/:timetableId" element={<ProtectedRoute component={ClassDetail} />} />
              <Route path="/my-profile" element={<ProtectedRoute component={MyProfile} />} />
            </Routes>
          </Container>
        </div> 
      </ApolloProvider>
    </BrowserRouter>
  )
}

export default App