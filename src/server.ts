import * as fs from 'fs';
import { createServer, Server } from 'node:http';
import formidable from 'formidable';
import CloudController from './controllers/CloudController.js';
import express from 'express';
import routes from './routes/CloudRoutes.js';

const app = express();
const port : number = 3000;

app.use(express.json());
app.use(routes);

/*const server : Server = createServer(async (req, res) => {  
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    CloudController.uploadFile(req, res);
  }
  else if(req.url === "/download") {
    CloudController.downloadFile(req, res);
  }
  else if(req.url.startsWith("/remove")){
    CloudController.removeFile(req, res);
  }
  else {
    CloudController.defaultPage(req, res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})