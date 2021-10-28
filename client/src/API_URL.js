const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'http://192.168.10.249:3001/';

export default API_URL;
