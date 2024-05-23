import express from 'express';
import routes from './routes/CloudRoutes.js';

const port : number = 3000;
const hostname : string = '127.0.0.1';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})