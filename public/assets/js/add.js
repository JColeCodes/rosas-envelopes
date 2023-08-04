// Function to add new envelope
async function addTextHandler(e) {
    e.preventDefault();
  
    const envelope_text = document.querySelector('#add-text').value.trim();
  
    if (envelope_text) {
        const response = await fetch('/api/envelopes/add', {
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

// Function to delete envelope
async function deleteTextHandler(id, content) {
    if (id) {
        if (content.includes('FILENAME=')) {
            const envelope_text = content.split('FILENAME=').slice(-1, content.length)[0];
            const response = await fetch(`/api/envelopes/remove/${id}`, {
                method: 'DELETE',
                body: JSON.stringify({
                    envelope_text
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                location.reload();
            }
        } else {
            const response = await fetch(`/api/envelopes/remove/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                location.reload();
            }
        }
    }
}
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(){ deleteTextHandler(btn.dataset.id, btn.dataset.content) });
});

// Disable add button when 3 envelopes already exist
const submitButton = document.querySelector(".add-envelope button");
const uploadButton = document.querySelector(".add-img button");
if (parseInt(submitButton.dataset.envelopes) >= 3) {
    submitButton.disabled = true;
    uploadButton.disabled = true;
}