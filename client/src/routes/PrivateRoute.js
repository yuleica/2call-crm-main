import { Route, Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { isLogged } = useAuth();
  return (
    <Route
      {...rest}
      render={(routeProps) =>
        Boolean(isLogged) ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/login'} />
        )
      }
    />
  );
};

export default PrivateRoute;
