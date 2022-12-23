const http = require('http');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
// Create the server
const server = http.createServer((req, res) => {
  // Set up the endpoint to handle the POST request
  let count=0;
  if (req.method === 'POST' && req.url === '/upload') {
    // Validate the 'Content-Type' header to ensure that the request is an image file
    if (req.headers['content-type'] !== 'image/png' && req.headers['content-type'] !== 'image/jpeg') {
      res.statusCode = 400;
      res.end('Invalid content type');
      return;
    }
    const fileName = uuid.v4();
    // Set the 'Content-Type' header in the response
    res.setHeader('Content-Type', 'text/plain');
    
    // Create a writable stream to store the image
    const file = fs.createWriteStream(path.resolve() + '/'+fileName+'.png');
    
    // Handle errors while writing the image to the file system
    file.on('error', (error) => {
      console.error(error);
      res.statusCode = 500;
      res.end('Internal server error');
    });

    // Pipe the request data to the writable stream
    req.pipe(file);

    // When the request ends, close the file stream and send a response
    req.on('end', () => {
      file.end();
      res.end('Image uploaded');
    });
  } else {
    // For other requests, return a 404 error
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Set a timeout for the server
server.timeout = 60000; // 5 seconds

// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
