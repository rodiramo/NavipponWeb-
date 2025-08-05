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
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      window.localStorage.getItem("jwt") ||
      window.sessionStorage.getItem("jwt");

    if (token) {
      setJWT(token);
      getUserProfile({ token })
        .then(setUser)
        .catch(() => setUser(null));
    }
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
        window.sessionStorage.removeItem("jwt");
        setState({ loading: false, error: true });
        console.error(error);
      }
    },
    [setJWT, setUser, navigate]
  );

  const logout = useCallback(() => {
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
    login,
    signup,
    logout,
  };
}
