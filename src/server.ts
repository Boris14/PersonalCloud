import express from 'express';
//import { sequelize } from './database.js';
import routes from './routes/CloudRoutes.js';
import CloudService from './services/CloudService.js';
import userRoutes from './routes/UserRoutes.js';
import fileRoutes from './routes/FileRoutes.js';
import sharedWithRoutes from './routes/SharedWithRoutes.js';

const port : number = 3000;
const hostname : string = '127.0.0.1';

const app = express();


app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', fileRoutes);
app.use('/api', sharedWithRoutes);

CloudService.InitCloud();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})
