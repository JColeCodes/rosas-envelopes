// Function to add new envelope
async function addTextHandler(e) {
    e.preventDefault();
  
    const envelope_text = document.querySelector('#add-text').value.trim();
  
    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                envelope_text
            }),
            headers: { 'Content-Type': 'application/json' }
        });
  
        if (response.ok) {
            location.reload();
        }
    }
}

document.querySelector('.add-envelope').addEventListener('submit', addTextHandler);

// Disable add button when 3 envelopes already exist
const submitButton = document.querySelector(".add-envelope button");
if (parseInt(submitButton.dataset.envelopes) >= 3) {
    submitButton.disabled = true;
}