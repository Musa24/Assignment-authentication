// Dependencies
const crypto = require('crypto');

// Container
const helpers = {};

//HASHING A PASSWORD
helpers.hash = function (str) {
  if (str.length > 0) {
    const hash = crypto
      .createHmac('sha256', 'secret')
      .update(str)
      .digest('hex');
    return hash;
  }
};

// CREATING A TOKEN
//Create a string of a randow alphanumeriv character of a given length
helpers.createRandomString = function (stringLength) {
  if (stringLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstvuwxyz0123456789';
    // start final string
    let str = '';
    for (let i = 0; i < stringLength; i++) {
      // Get a random character from the possibleCharacter string
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      str += randomCharacter;
    }
    return str;
  }
};

module.exports = helpers;
