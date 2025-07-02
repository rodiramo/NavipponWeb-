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
      setState({ loading: true, error: false });
      try {
        const { token } = await loginService({ email, password });

        if (rememberMe) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.sessionStorage.setItem("jwt", token);
        }

        setJWT(token);
        const userProfile = await getUserProfile({ token });
        setUser(userProfile);
        setState({ loading: false, error: false });
      } catch (error) {
        window.sessionStorage.removeItem("jwt");
        window.localStorage.removeItem("jwt");
        setState({ loading: false, error: true });
        console.error(error);
      }
    },
    [setJWT, setUser] // Remove 'navigate' from dependencies
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
    navigate("/"); // Redirect to home immediately
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
