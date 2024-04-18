import * as fs from 'fs';
import { createServer } from 'node:http';
import formidable from 'formidable';

const dirPath: string = process.cwd();
const hostname : string = '127.0.0.1';
const port : number = 3000;

var storedFileData : Buffer[] = [];
var storedFileNames : string[] = [];

function getPageHtml() : string {
  return `
  <h2>Personal Cloud</h2>
  <div>Stored files: ${storedFileNames.toString()}</div>
  <form action="/upload" enctype="multipart/form-data" method="post">
    <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
    <input type="submit" value="Upload" />
  </form>
  <form action="/download" method="post">
    <input type="submit" value="Download" />
  </form>
  `;
}

const server = createServer(async (req, res) => {  
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // parse a file upload
    const form = formidable({});
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        console.error(err);
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
    }

    for(let i = 0; i < files.multipleFiles.length; ++i)
    {
      let file = files.multipleFiles[i];
      var oldpath = file.filepath;
      storedFileNames.push(file.originalFilename);
      fs.readFile(file.filepath, function (err, data){
        storedFileData.push(data);
      });
      fs.unlink(oldpath, (err) => {
        if(err) throw err;
      });
    }
    res.end(getPageHtml());
  }
  else if(req.url === "/download")
  {
    for(let i = 0; i < storedFileNames.length; ++i) {
      let fileName = storedFileNames[i];
      console.log(fileName);
      fs.writeFile(dirPath + `\\${fileName}`, storedFileData[i], function (err){
        if(err) throw err;
      });
    }
    res.end(getPageHtml());
  }
  else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getPageHtml());
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});