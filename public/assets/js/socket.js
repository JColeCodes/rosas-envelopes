const socket = io(); // SOCKET.IO

const envelopesBtn = document.querySelector('#randomize-envelopes-btn');
const parcelBtn = document.querySelector('#randomize-img-btn');
const clearParcelBtn = document.querySelector('#clear-img-btn');
const clearEnvelopeBtn = document.querySelector('#clear-envelope-btn');

const envelopeContent = document.querySelector('#envelope-content');
const envelopesView = document.querySelector('#envelope-view');
const parcelImg = document.querySelector('#parcel-img');

const envelopeLetters = ['A', 'B', 'C'];
const letterFonts = ['patrick-hand', 'averia-serif', 'sedgwick-ave'];
let letterColors = [];

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

            for (let i = 0; i < letterFonts.length; i++) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = letterFonts[i];
                letterFonts[i] = letterFonts[j];
                letterFonts[j] = temp;
            }
            
            letterColors = [];

            for (let i = 0; i < envelopesList.length; i++) {
                let randomColor = randomize(70, 290);

                // Prevents colors from being too similar... janky
                if (i === 1) {
                    while (randomColor <= (letterColors[0] + 40) && randomColor >= (letterColors[0] - 40)) {
                        randomColor = randomize(70, 290);
                    }
                } else if (i === 2) {
                    while ((randomColor <= (letterColors[0] + 40) && randomColor >= (letterColors[0] - 40)) || (randomColor <= (letterColors[1] + 40) && randomColor >= (letterColors[1] - 40))) {
                        randomColor = randomize(70, 290);
                    }
                }

                letterColors.push(randomColor);
            }
        }
        
        // Emit the following information
        socket.emit('envelope', {
            current: 'envelope',
            envelopesList,
            letterFonts,
            letterColors
        });
    });
}

if (parcelBtn) {
    parcelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Emit the following information
        socket.emit('envelope', {
            current: 'parcel',
            parcel: randomize(1, 8)
        });
    });
}

if (clearParcelBtn) {
    clearParcelBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Emit the following information
        socket.emit('envelope', {
            current: 'clearParcel'
        });
    });
}

if (clearEnvelopeBtn) {
    clearEnvelopeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Emit the following information
        socket.emit('envelope', {
            current: 'clearEnvelope'
        });
    });
}

// Socket on taking in the information from the emit
socket.on('envelope', (data) => {
    if (data.current === 'envelope' && envelopesView) {
        envelopeContent.innerHTML = '';
        envelopesView.innerHTML = '';

        data.envelopesList.forEach((envelope, i) => {

            var envelopeFlip = document.createElement('div');
            var envelopeWrap = document.createElement('div');
            var envelopeFront = document.createElement('div');
            var envelopeBack = document.createElement('div');
            var hueRotate = `hue-rotate(${data.letterColors[i]}deg)`;

            envelopeFlip.classList.add('envelope', 'flip', data.letterFonts[i]);
            envelopeWrap.classList.add('envelope-wrap');
            envelopeBack.classList.add('envelope-style', 'envelope-back');
            envelopeFront.classList.add('envelope-style', 'envelope-front');
            envelopeFlip.style.filter = hueRotate;
            envelopeFlip.setAttribute('id', `env-${i}`);

            envelopeBack.textContent = envelopeLetters[i];

            var envelopeText = document.createElement('div');
            envelopeText.classList.add('envelope-cont', data.letterFonts[i]);
            envelopeText.style.filter = hueRotate;

            if (envelope.includes('FILENAME=')) {
                var envelopeImg = document.createElement('img');
                envelopeImg.classList.add('envelope-img');
                envelopeImg.setAttribute('src', `./assets/images/uploads/${envelope.split('FILENAME=').slice(-1, envelope.length)}`);
                envelopeImg.style.filter = `hue-rotate(-${data.letterColors[i]}deg)`;

                envelopeText.appendChild(envelopeImg);
            } else {
                envelopeText.textContent = envelope;
            }

            envelopesView.appendChild(envelopeFlip);
            envelopeContent.appendChild(envelopeText);

            envelopeFlip.appendChild(envelopeWrap);
            envelopeWrap.appendChild(envelopeFront);
            envelopeWrap.appendChild(envelopeBack);
        });

        const allEnvelopes = document.querySelectorAll('.envelope');

        allEnvelopes.forEach((envelopeObj, i) => {
            envelopeObj.addEventListener('click', (e) => {
                e.preventDefault();
        
                // Emit the following information
                socket.emit('envelope', {
                    current: 'clickEnvelope',
                    envelopeNum: i
                });
            })
        });
        
    }
    else if (data.current === "clickEnvelope" && envelopesView) {
        const currentEnv = document.querySelector(`#env-${data.envelopeNum}`);
        
        if (currentEnv.classList.contains('flip')) {
            currentEnv.classList.remove('flip');
        } else {
            currentEnv.classList.add('flip');
        }

        const allEnvelopeCont = document.querySelectorAll('.envelope-cont');

        setTimeout(function() {
            if (allEnvelopeCont[data.envelopeNum].classList.contains('show-content')) {
                allEnvelopeCont[data.envelopeNum].classList.remove('show-content');
            } else {
                allEnvelopeCont[data.envelopeNum].classList.add('show-content');
            }
        }, 300);
        
    }
    else if (data.current === 'clearEnvelope' && envelopesView) {
        if (document.querySelector('.show-content')) {
            document.querySelector('.show-content').classList.remove('show-content');
        }
        const allEnv = document.querySelectorAll('.envelope');
        setTimeout(function() {
            allEnv.forEach(env => {
                env.classList.add('flip');
            })
        }, 300);
    }
    else if (data.current === 'parcel' && parcelImg) {
        parcelImg.classList.remove("show-img");
        setTimeout(function() {
            parcelImg.classList.add("show-img");

        parcelImg.src = `/assets/images/parcels/00${data.parcel}.png`;
        }, 400);
    }
    else if (data.current === 'clearParcel' && parcelImg) {
        parcelImg.classList.remove("show-img");
        setTimeout(function() {
            parcelImg.classList.remove("show-img");
        }, 400);
    }
});