async function loginHandler(e) {
  e.preventDefault();

  const username = document.querySelector('#login-username').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      location.reload();
    }
  }
}

document.querySelector('.login').addEventListener('submit', loginHandler);