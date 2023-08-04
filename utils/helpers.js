module.exports = {
    display_content: (envelope_text) => {
        let newEnvelope;
        if (envelope_text.includes('FILENAME=')) {
            newEnvelope = `<img src='./assets/images/uploads/${envelope_text.split('FILENAME=').slice(-1, envelope_text.length)}' class='envelope-img' alt='Image submission' />`;
        } else {
            newEnvelope = envelope_text;
        }
        return newEnvelope;
    }
  };