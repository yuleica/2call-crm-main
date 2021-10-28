const ENDPOINT = 'http://localhost:3001/api';

export default function login({ email, password }) {
  return fetch(`/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('Response is NOT ok');
      return res.json();
    })
    .then((res) => {
      const { token } = res;
      return token;
    });
}
