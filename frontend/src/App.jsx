import React from "react";
import { Routes, Route } from "react-router-dom"; // ✅ Remove BrowserRouter here
import AuthProvider from "./context/AuthContext";
import Navbar from "./pages/Navbar";
import CreatePost from "./pages/CreatePost";
import ListPost from "./pages/ListPost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditPost from "./pages/EditPost";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListPost />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
