const socket = io(); // SOCKET.IO

const envelopesBtn = document.querySelector('#randomize-envelopes-btn');
const parcelBtn = document.querySelector('#randomize-img-btn');

const parcelImg = document.querySelector('#parcel-img');

function randomize(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

if (envelopesBtn) {
    envelopesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Emit the following information
        socket.emit('envelope', {
            current: 'envelope',
            envelope: randomize(0, 3)
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
    if (data.current === 'envelope') {
        console.log("Hello");
    }
    else if (data.current === 'parcel' && parcelImg) {
        parcelImg.src = `/assets/images/parcels/00${data.parcel}.png`;
    }
});