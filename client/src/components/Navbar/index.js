import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import useAuth from '../../hooks/useAuth';

const MyNavbar = () => {
  const { isLogged, logout } = useAuth();

  return (
    <>
      <Navbar bg="light" expand="lg">
        <div className="container">
          <Navbar.Brand href="/">
            <img src="line-logo.png" width="48px" alt="2call logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {isLogged && (
              <Button
                className="ml-auto "
                variant="outline-success"
                onClick={logout}
              >
                Salir
              </Button>
            )}
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  );
};

export default MyNavbar;
