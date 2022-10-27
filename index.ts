require('dotenv').config();
import './src/utils/newrelic';
require('express-async-errors');
import bodyParser from 'body-parser';
import Database from "./src/config/db.config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import colors from 'colors';

Database.connect().then(() => {
  console.log(colors.italic.bold.bgGreen('Database is connected'));
}).catch(err => {
  logger.error(err);
});

// Importing routes
import homepageRoutes from './src/routes/homepage.route';
import wordsRoute from './src/routes/words.route';

// Import middlewares
import isAccessible from './src/middlewares/isAccessible';
import logger from './src/middlewares/winston';

const app: express.Application = express();

app.use(cookieParser());
app.use(express.json());

const corsConfig = {
  credentials: true,
  origin: true,
};

app.use(cors(corsConfig));
  
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(isAccessible);

app.use('/', homepageRoutes);
app.use('/api', wordsRoute);

const PORT = process.env.PORT || 5003;
const appPort = app.listen(PORT, () => console.log(`Port currently running on ${PORT}`));

export default appPort;