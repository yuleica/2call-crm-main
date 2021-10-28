import { useState, useEffect, createContext } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(() =>
    window.sessionStorage.getItem('token')
  );

  useEffect(() => {
    if (token) {
      const decodedToken = jwt.decode(token);
      setUser({
        id: decodedToken.id,
        name: `${decodedToken.name.firstName} ${decodedToken.name.lastName}`,
        email: decodedToken.email,
        ext: decodedToken.ext,
        role: decodedToken.role,
        sessionId: decodedToken.sessionId,
      });
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
