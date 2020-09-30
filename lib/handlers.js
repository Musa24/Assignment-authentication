const lib = require('./data');

// CONFI REDIS
const redis = require('redis');
// redis client
const client = redis.createClient(6379);

// This is where we are going to procee different route

const _data = require('./data');
const helpers = require('./helpers');

const handlers = {};

handlers.register = function (data, callback) {
  const methodReq = JSON.parse(data).method;
  if (methodReq === 'post') {
    handlers._register.post(data, callback);
  }
};

// Register container
handlers._register = {};

//REGISTER =>POST
handlers._register.post = function (dataPayload, callback) {
  let data = JSON.parse(dataPayload);

  const { email, password } = data.payload;

  if (email && password) {
    //   User object

    const newUser = {
      email,
      password: helpers.hash(password),
    };
    // Creating the user
    _data.create('users', email, newUser, (err) => {
      // Create a token
      if (!err) {
        const token = helpers.createRandomString(30);
        // Name,time, value
        client.setex('token', 3600, token);
        client.setex('email', 3600, email);

        callback(200, { token: token });
      } else {
        callback(403, { Error: 'The user is already exist' });
      }
    });
  }
};

// LOGIN USER
handlers.login = function (data, callback) {
  const methodReq = JSON.parse(data).method;
  if (methodReq === 'post') {
    handlers._login.post(data, callback);
  }
};

// login container
handlers._login = {};

handlers._login.post = function (dataPayload, callback) {
  let data = JSON.parse(dataPayload);
  const { email, password } = data.payload;

  _data.read('users', email, (err, data) => {
    if (!err) {
      const hashedPassword = helpers.hash(password);
      let objData = JSON.parse(data);

      if (objData.password === hashedPassword) {
        //   If the password match return the token
        // Create a token
        const token = helpers.createRandomString(30);
        // Name,time, value
        client.setex('token', 3600, token);
        client.setex('email', 3600, email);
        callback(200, { token: token });
      } else {
        callback(400, { Error: 'The password incorect' });
      }
    }
  });
};

//Checking the user if logged in

handlers.authorize = function (data, callback) {
  client.get('token', (err, token) => {
    if (token) {
      client.get('email', (err, email) => {
        callback(200, { message: `${email} is logged in` });
      });
    } else {
      callback(200, { message: 'The user  is logged out' });
    }
  });
};

// LOG OUT THE USER
handlers.logout = function (data, callback) {
  console.log('Musa ');
  //   clearing the token and user
  client.setex('token', 1, '');
  client.setex('email', 1, '');
  callback(200, { message: 'The user  is logged out' });
};

// curl -d '{"email":"musalumu24@gmail.com","password":"123456" }' H "Content-Type: application/json" -X POST http://localhost:5000/users/register

module.exports = handlers;
