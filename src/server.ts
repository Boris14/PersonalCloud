import express from 'express';
import routes from './routes/CloudRoutes.js';
import CloudService from './services/CloudService.js';

const port : number = 3000;
const hostname : string = '127.0.0.1';

const app = express();

CloudService.InitCloud(routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})