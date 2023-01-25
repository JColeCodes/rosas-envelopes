const listDiv = document.querySelector('.users');
const response = null; 

fetch('/graphql', {
  method: 'POST',

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    query: `{
      user {
        username
      }
    }`
  })
})
.then(res => res.json())
.then(res => console.log(res.data.users.username))