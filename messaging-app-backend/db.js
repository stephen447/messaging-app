import Sequelize from 'sequelize';
import config from '../messaging-app-backend/config/config.json' assert { type: 'json' };


const dbConnect = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});
export default dbConnect;