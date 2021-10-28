import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <>
      <div className="container">
        <h1>Pagina no encontrada</h1>
        <Link className="btn btn-info" to="/">
          Ir Al inicio
        </Link>
      </div>
    </>
  );
};

export default Page404;
