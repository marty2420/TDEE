import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { TdeeProvider } from "./context/TdeeContext.tsx"; // ✅ Import TdeeProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  return (
    <AuthProvider>
      <TdeeProvider>
        <Router>
          <Layout>
            {/* ToastContainer outside Routes to stay persistent across pages */}
            <ToastContainer position="top-center" autoClose={3000} />

            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/login"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Login />
                  </motion.div>
                }
              />
              <Route
                path="/signup"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Signup />
                  </motion.div>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </TdeeProvider>
    </AuthProvider>
  );
}
