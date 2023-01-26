const listDiv = document.querySelector('.users');

console.log("Hello");

fetch('/api/users')
  .then(res => res.json())
  .then(res => console.log(res));