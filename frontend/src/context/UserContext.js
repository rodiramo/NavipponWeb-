// src/context/UserContext.js
import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../services/index/users';

const Context = React.createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJWT] = useState(() => window.sessionStorage.getItem('jwt'));

  useEffect(() => {
    if (!jwt) return setUser(null);
    getUserProfile({ token: jwt }).then(setUser).catch(() => setUser(null));
  }, [jwt]);

  return (
    <Context.Provider value={{ user, jwt, setUser, setJWT }}>
      {children}
    </Context.Provider>
  );
}

export default Context;