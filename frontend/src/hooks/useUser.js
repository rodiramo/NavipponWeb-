import { useCallback, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Context from "../context/UserContext";
import {
  login as loginService,
  signup as signupService,
  getUserProfile,
} from "../services/index/users";

export default function useUser() {
  const { user, jwt, setUser, setJWT } = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      console.log("🔵 useUser: Initializing user...");

      const token =
        window.localStorage.getItem("jwt") ||
        window.sessionStorage.getItem("jwt");

      if (token) {
        console.log("🔵 useUser: Token found, validating...");
        setJWT(token);

        try {
          const userProfile = await getUserProfile({ token });
          console.log("🔵 useUser: User profile retrieved successfully");
          setUser(userProfile);
        } catch (error) {
          console.error("🔴 useUser: getUserProfile failed:", error);
          console.log("🔴 useUser: Clearing invalid token and user data");

          // Clear invalid tokens but DON'T redirect
          window.localStorage.removeItem("jwt");
          window.sessionStorage.removeItem("jwt");
          setJWT(null);
          setUser(null);

          // Only log the error, don't redirect from here
          console.log("🔴 useUser: Token was invalid, user should login again");
        }
      } else {
        console.log("🔵 useUser: No token found");
        setUser(null);
        setJWT(null);
      }

      setIsInitializing(false);
      console.log("🔵 useUser: Initialization complete");
    };

    initializeUser();
  }, [setUser, setJWT]);

  const login = useCallback(
    async ({ email, password, rememberMe }) => {
      console.log("🔵 Login process started");
      setState({ loading: true, error: false });
      try {
        console.log("🔵 Calling login service...");
        const { token } = await loginService({ email, password });
        console.log("🔵 Login service successful, got token:", !!token);

        if (rememberMe) {
          window.localStorage.setItem("jwt", token);
          console.log("🔵 Token saved to localStorage");
        } else {
          window.sessionStorage.setItem("jwt", token);
          console.log("🔵 Token saved to sessionStorage");
        }

        setJWT(token);
        console.log("🔵 JWT set in context");

        const userProfile = await getUserProfile({ token });
        console.log("🔵 User profile retrieved:", !!userProfile);

        setUser(userProfile);
        setState({ loading: false, error: false });

        console.log("🔵 About to navigate to home page");
        console.log(
          "🔵 Current location before navigate:",
          window.location.href
        );

        navigate("/");

        console.log("🔵 Navigate called");
        setTimeout(() => {
          console.log("🔵 Location after navigate:", window.location.href);
        }, 100);
      } catch (error) {
        console.error("🔴 Login error:", error);
        window.sessionStorage.removeItem("jwt");
        window.localStorage.removeItem("jwt");
        setJWT(null);
        setUser(null);
        setState({ loading: false, error: true });
      }
    },
    [setJWT, setUser, navigate]
  );

  const signup = useCallback(
    async ({ name, email, password }) => {
      setState({ loading: true, error: false });
      try {
        const { token } = await signupService({ name, email, password });
        window.sessionStorage.setItem("jwt", token);
        setJWT(token);
        const userProfile = await getUserProfile({ token });
        setUser(userProfile);
        setState({ loading: false, error: false });

        navigate("/user/dashboard");
      } catch (error) {
        console.error("🔴 Signup error:", error);
        window.sessionStorage.removeItem("jwt");
        window.localStorage.removeItem("jwt");
        setJWT(null);
        setUser(null);
        setState({ loading: false, error: true });
      }
    },
    [setJWT, setUser, navigate]
  );

  const logout = useCallback(() => {
    console.log("🔵 Logging out user");
    window.sessionStorage.removeItem("jwt");
    window.localStorage.removeItem("jwt");
    setJWT(null);
    setUser(null);
    navigate("/");
  }, [setJWT, setUser, navigate]);

  return {
    user,
    jwt,
    isLogged: Boolean(jwt),
    isLoginLoading: state.loading,
    hasLoginError: state.error,
    isInitializing, // NEW: Expose initialization state
    login,
    signup,
    logout,
  };
}
