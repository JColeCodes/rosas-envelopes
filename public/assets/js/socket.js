const socket = io(); // SOCKET.IO

const envelopesBtn = document.querySelector('#randomize-envelopes-btn');
const parcelBtn = document.querySelector('#randomize-img-btn');

const envelopesView = document.querySelector('#envelope-view');
const parcelImg = document.querySelector('#parcel-img');

const envelopeLetters = ['A', 'B', 'C'];

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

if (envelopesBtn) {
    envelopesBtn.addEventListener('click', async function envelopesGet(e){
        e.preventDefault();

        const envelopesList = [];

        const response = await fetch('/api/envelopes', {
            method: 'GET'
        });
    
        if (response.ok) {
            const fetchedList = await response.json();
            fetchedList.forEach(item => {
                envelopesList.push(item.envelope_text);
            });

            for (let i = 0; i < envelopesList.length; i++) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = envelopesList[i];
                envelopesList[i] = envelopesList[j];
                envelopesList[j] = temp;
            }

        }
        
        // Emit the following information
        socket.emit('envelope', {
            current: 'envelope',
            envelopesList
        });
    });
}

if (parcelBtn) {
    document.querySelector('#randomize-img-btn').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Emit the following information
        socket.emit('envelope', {
            current: 'parcel',
            parcel: randomize(1, 6)
        });
    });
}
  
// Socket on taking in the information from the emit
socket.on('envelope', (data) => {
    if (data.current === 'envelope' && envelopesView) {
        envelopesView.innerHTML = '';

        data.envelopesList.forEach((envelope, i) => {
            var envelopeFlip = document.createElement('div');
            var envelopeWrap = document.createElement('div');
            var envelopeText = document.createElement('div');
            var envelopeBack = document.createElement('div');

            envelopeFlip.classList.add('envelope-flip');
            envelopeWrap.classList.add('envelope-wrap');
            envelopeText.classList.add('envelope-style', 'envelope-text');
            envelopeBack.classList.add('envelope-style', 'envelope-back');

            envelopeText.textContent = envelope;
            envelopeBack.textContent = envelopeLetters[i];

            envelopesView.appendChild(envelopeFlip);

            envelopeFlip.appendChild(envelopeWrap);
            envelopeWrap.appendChild(envelopeText);
            envelopeWrap.appendChild(envelopeBack);
        });
    }
    else if (data.current === 'parcel' && parcelImg) {
        parcelImg.src = `/assets/images/parcels/00${data.parcel}.png`;
    }
});