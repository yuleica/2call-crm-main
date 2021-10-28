import { useContext } from 'react';

import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';
import loginService from '../services/login';
import logoutService from '../services/logout';

import SocketContext from '../context/SocketContext';

const useAuth = () => {
  const { token, setToken, user, setUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const login = ({ email, password }) => {
    loginService({ email, password })
      .then((token) => {
        window.sessionStorage.setItem('token', token);
        setToken(token);
      })
      .catch((err) => {
        window.sessionStorage.removeItem('token');
        setUser({});
        toast.error('Nombre de usuario y/o contraseña invalidos.');
        console.log(err);
      });
  };

  const logout = () => {
    logoutService(token)
      .then(() => {
        socket.emit('leave', `SIP/${user.ext}`);
        window.sessionStorage.removeItem('token');
        setUser({});
        setToken(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    isLogged: Boolean(token),
    login,
    logout,
    user,
  };
};

export default useAuth;
