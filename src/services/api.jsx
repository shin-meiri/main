// src/services/api.js
export const login = async (username, password) => {
  const response = await fetch('/api/user.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login gagal');
  }

  return response.json(); // Harap user.php mengembalikan JSON
};