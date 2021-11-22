import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import useAuth from '../../hooks/useAuth';
import {Link} from 'react-router-dom';


const MyNavbar = () => {
  const { isLogged, logout } = useAuth();

  const hoy = new Date();
  console.log(hoy);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <div className="container">
          <Navbar.Brand href="/">
            <img src="line-logo.png" width="48px" alt="2call logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {isLogged && (<Link style={{textAlign: 'center', paddingRight:'7px'}} to="/Report">Reporte</Link>)}
            {isLogged && (
              <Button
                className="md-auto "
                variant="outline-success"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default MyNavbar;

