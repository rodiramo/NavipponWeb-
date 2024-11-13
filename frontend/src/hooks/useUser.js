// src/hooks/useUser.js
import { useCallback, useContext, useState } from 'react';
import Context from '../context/UserContext';
import { login as loginService, signup as signupService, getUserProfile } from '../services/index/users';

export default function useUser() {
  const { user, jwt, setUser, setJWT } = useContext(Context);
  const [state, setState] = useState({ loading: false, error: false });

  const login = useCallback(async ({ email, password }) => {
    setState({ loading: true, error: false });
    try {
      const { token } = await loginService({ email, password });
      window.sessionStorage.setItem('jwt', token);
      setJWT(token);
      const userProfile = await getUserProfile({ token });
      setUser(userProfile);
      setState({ loading: false, error: false });
    } catch (error) {
      window.sessionStorage.removeItem('jwt');
      setState({ loading: false, error: true });
      console.error(error);
    }
  }, [setJWT, setUser]);

  const signup = useCallback(async ({ name, email, password }) => {
    setState({ loading: true, error: false });
    try {
      const { token } = await signupService({ name, email, password });
      window.sessionStorage.setItem('jwt', token);
      setJWT(token);
      const userProfile = await getUserProfile({ token });
      setUser(userProfile);
      setState({ loading: false, error: false });
    } catch (error) {
      window.sessionStorage.removeItem('jwt');
      setState({ loading: false, error: true });
      console.error(error);
    }
  }, [setJWT, setUser]);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem('jwt');
    setJWT(null);
    setUser(null);
  }, [setJWT, setUser]);

  return {
    user,
    jwt,
    isLogged: Boolean(jwt),
    isLoginLoading: state.loading,
    hasLoginError: state.error,
    login,
    signup,
    logout
  };
}