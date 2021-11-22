import { useEffect, useContext, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SocketContext from '../../context/SocketContext';
import useAuth from '../../hooks/useAuth';
import UsersList from './UsersList';

const Report = () => {
  const { socket } = useContext(SocketContext);
  const { user, logout } = useAuth();
  
  useEffect(() => {
    user?.ext && socket.emit('join', `SIP/${user.ext}`);
    user?.ext && socket.emit('checkExtState', user.ext);
  }, [user, socket]);


const [list, setList] = useState([]);

useEffect(() => {
  getData()
  
}, []);


  const getData = async () => {
    try {
      const req = '/Report'
      const res = await fetch(req)
      .then(res => res.json() )
      .then(res => setList(res) ) 
        
      if (!res.ok) {
          toast.error(res.error)}

    } catch (err) {
        toast.error(err)        
    }
};


  return (
    <Fragment>
      <div className="py-3">
        <div className="container">
          <div className="row justify-content-center justify-content-between px-3">
                {user.name} | {user.ext}
                <Link style={{textAlign: 'center', paddingRight:'7px'}} to="/">Volver</Link>
          </div>

          <div>
            <h2 style={{textAlign: 'center'}}>Reporte de Estados. Usuarios CRM</h2>
              <UsersList list={list} />
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );

};

export default Report;