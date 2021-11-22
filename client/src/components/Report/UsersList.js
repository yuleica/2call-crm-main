import React from 'react';

const UsersList = ({list}) => {
    return (
            <div>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>NOMBRE Y APELLIDO</th>
                            <th>EXTENSIÓN</th>
                            <th>FECHA DE LOGIN</th>
                            <th>FECHA DE LOGOUT</th>
                            <th>TIPO DE PAUSA</th>
                            <th>INICIO PAUSA</th>
                            <th>FIN PAUSA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map( list => 
                            <tr key={list._id}>
                                <td>{list.firstName,
                                    list.lastName}</td>
                                <td>{list.ext}</td>
                                <td>{list.login}</td>
                                <td>{list.logout}</td>
                                <td>{list.pauseType}</td>
                                <td>{list.start}</td>
                                <td>{list.end}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>

    );
};

export default  UsersList;
