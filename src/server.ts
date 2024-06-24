import express from 'express';
//import { sequelize } from './database.js';
import routes from './back-end/routes/CloudRoutes.js';
import CloudService from './back-end/services/CloudService.js';
import userRoutes from './back-end/routes/UserRoutes.js';
import fileRoutes from './back-end/routes/FileRoutes.js';
import sharedWithRoutes from './back-end/routes/SharedWithRoutes.js';

const port : number = 3001;
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
