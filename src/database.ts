import { Sequelize } from 'sequelize';
import { databaseConfig } from './config.js';
import { testDatabaseConfig } from './test_config.js';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const sequelizeConfig = isTestEnvironment ? testDatabaseConfig : databaseConfig;

const sequelize = new Sequelize({
    ...sequelizeConfig,
    dialect: 'postgres',
    dialectOptions: {
        createDatabase: true, 
    },
    logging: console.log,
});

//const User = require('./models/User');
//const File = require('./models/File');
//const SharedWith = require('./models/SharedWith');

sequelize.sync()
    .then(() => {
        console.log('Database synced successfully!');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

export { sequelize };
