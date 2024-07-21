import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "../lib/api-client.js";
import { GET_USER_INFO } from "../utils/constants.js";
import Loader from "./components/ui/loader";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserInfo(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [setUserInfo]);

  const getUserData = async () => {
    try {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }

      return response.data.userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };
  
  return (
    <>
      {loading ? (
        <div className="h-screen w-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <AuthRoute>
                  <Auth />
                </AuthRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
