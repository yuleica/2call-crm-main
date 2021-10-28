import { createContext } from 'react';
import socketIO from 'socket.io-client';

const socket = socketIO.connect();
const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
