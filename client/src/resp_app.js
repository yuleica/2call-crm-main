import { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';

const socket = socketIO('http://localhost:3001');

const App = () => {
  const [inbound, setInbound] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    socket.on('inbound', (data) => {
      // setEvent((events) => [...events, data]);
      setFormData({});
      setInbound(data);
    });
  }, []);

  useEffect(() => {
    socket.on('bridgeEnter', () => {
      console.log('bridgeEnter', inbound);
      setFormData({
        phone: inbound.phone ? inbound.phone : '',
        firstName: inbound.name ? inbound.name.firstName : '',
        lastName: inbound.name ? inbound.name.lastName : '',
      });
    });
  });

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    fetch('/api/contacts', {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(formData), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error('Error:', error))
      .then((response) => console.log('Success:', response));
  };

  const handleActive = async () => {
    socket.emit('activarPausa');
  };

  const handleDesactive = async () => {
    socket.emit('desactivarPausa');
  };

  // console.log('inbound', inbound);
  // console.log('form', formData);

  return (
    <div style={{ display: 'flex' }}>
      <input type="button" value="activar pausa" onClick={handleActive} />
      <input type="button" value="desactivar pausa" onClick={handleDesactive} />
      <div style={{ flex: '1' }}>
        <br />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="phone">fono</label>
            <br />
            <input
              type="text"
              name="phone"
              id="phone"
              value={formData.phone ? formData.phone : ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <br />
          <div>
            <label htmlFor="firstName">nombre</label>
            <br />
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName ? formData.firstName : ''}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <br />
          <div>
            <label htmlFor="lastName">apellido</label>
            <br />
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName ? formData.lastName : ''}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>
          <br />
          <input type="submit" value="guardar" />
        </form>
      </div>
      <div style={{ flex: '1' }}>
        <p>
          <strong>inbound</strong>
        </p>
        {inbound.phone && <p>fono: {inbound.phone}</p>}
        {inbound.name && (
          <p>
            nombre: {inbound.name.firstName} {inbound.name.lastName}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
