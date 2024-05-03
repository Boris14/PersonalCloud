import * as fs from 'fs';
import { createServer, Server } from 'node:http';
import formidable from 'formidable';

const dirPath: string = process.cwd();
const hostname : string = '127.0.0.1';
const port : number = 3000;

var storedFileData : Buffer[] = [];
var storedFileNames : string[] = [];

function getPageHtml() : string {
  return `
  <h2>Personal Cloud</h2>
  ${getStoredFilesHtml()}
  <form action="/upload" enctype="multipart/form-data" method="post">
    <div>Files to upload: <input id="uploadFiles" type="file" name="multipleFiles" multiple="multiple" /></div>
    <input type="submit" value="Upload" />
  </form>
  <form action="/download" method="post">
    <input type="submit" value="Download" />
  </form>
  `;
}

function getStoredFilesHtml() : string {
  let result : string = "";
  for(let i = 0; i < storedFileNames.length; ++i) {
    result += 
    `<form action="/remove/${i}" method="post">
      <div>${storedFileNames[i]}</div>
      <input type="submit" value="Remove" />
    </form>\n`;
  }
  return result;
}

const server : Server = createServer(async (req, res) => {  
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // Parse a file upload
    const form : formidable.Formidable = formidable({allowEmptyFiles : true, minFileSize : 0});
    let fields, files;
    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        console.error(err);
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
    }

    for(let i = 0; i < files.multipleFiles.length; ++i) {
        let file : formidable.File = files.multipleFiles[i];
        if(file.size <= 0) { continue; }
        var oldpath : string = file.filepath;
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
  else if(req.url === "/download") {
    for(let i = 0; i < storedFileNames.length; ++i) {
      let fileName : string = storedFileNames[i];
      fs.writeFile(dirPath + `\\${fileName}`, storedFileData[i], function (err){
        if(err) throw err;
      });
    }
    res.end(getPageHtml());
  }
  else if(req.url.startsWith("/remove")){
    let indexOfId : number = "/remove/".length;
    let indexOfFileToRemove : number = Number(req.url.slice(indexOfId));
    storedFileData.splice(indexOfFileToRemove, 1);
    storedFileNames.splice(indexOfFileToRemove, 1);
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