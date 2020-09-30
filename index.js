// CREATE A SERVER
const http = require('http');
const { StringDecoder } = require('string_decoder');
const url = require('url');
const { stringDecoder } = require('string_decoder').StringDecoder; //for Payload
const handlers = require('./lib/handlers');

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log('The server is running in port ', PORT);
});

// server login for both http & https
const unifiedServer = function (req, res) {
  //Get the URL
  const parsedUrl = url.parse(req.url, true);
  //   Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //   Get the query String as an Object
  const queryStringObject = parsedUrl.query;

  // Get the method
  const method = req.method.toLowerCase();

  //  Get the header
  const headers = req.headers;
  //  Get the payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data); //This is called when we have data
  });
  req.on('end', () => {
    buffer += decoder.end();

    //Choos the handler this request to go if  not use not found
    let chosenHandler = null;
    if (router[trimmedPath]) {
      chosenHandler = router[trimmedPath];
    } else {
      chosenHandler = handlers.notFound;
    }

    // Consturuct data to send to handler
    if (buffer) {
      buffer = JSON.parse(buffer);
    } else {
      buffer = null;
    }
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    //    Create a JSON data
    data = JSON.stringify(data);

    // Route the request according to the specific route
    chosenHandler(data, (statusCode, payload) => {
      // Use status called from handler
      if (!payload) {
        payload = {};
      }
      const payloadString = JSON.stringify(payload);
      console.log('Output', payloadString);
      //   Set the type of the data you are returning
      res.setHeader('Content-type', 'application/json');
      //   return the respond
      res.writeHead(statusCode);
      //   Send the respond
      res.end(payloadString);
      console.log('Returning this respond', statusCode, payloadString);
    });
  });
};

const router = {
  'users/register': handlers.register,
  'users/login': handlers.login,
  'users/authorize': handlers.authorize,
  'users/logout': handlers.logout,
};
