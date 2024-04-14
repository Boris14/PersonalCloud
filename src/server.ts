import * as fs from 'fs';
import { createServer } from 'node:http';
import formidable from 'formidable';
import { fileURLToPath } from 'url';

const dir_path: string = import.meta.url;
const hostname : string = '127.0.0.1';
const port : number = 3000;

const server = createServer((req, res) => {
  if (req.url == '/fileupload') {
    const form = formidable({});
    form.parse(req, function (err, fields, files) {
      res.write("File uploaded!");
      res.end();
      // Save the file to the root directory (files.filetoupload.originalFilename is undefined for some reason)
      /*var oldpath : string = files.filetoupload.filepath;
      var newpath : string = dir_path + files.filetoupload.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });*/
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});