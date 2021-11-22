import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Page404 from './components/Page404';
import Report from './components/Report';

// Context
import { AuthContextProvider } from './context/AuthContext';
import { SocketContextProvider } from './context/SocketContext';

// Private Route
import PrivateRoute from './routes/PrivateRoute';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
          />
          <Navbar />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/Report" component={Report} />
            <Route exact path="/login" component={Login} />
            <Route component={Page404} />
          </Switch>
        </Router>
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default App;
