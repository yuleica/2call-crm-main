const ENDPOINT = 'http://localhost:3001/api';

export default function logout(token) {
  return fetch(`/api/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error('Response is NOT ok');
    return res.json();
  });
}
