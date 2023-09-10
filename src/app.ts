require('dotenv').config();
import express from 'express';
import config from 'config';
import log from './utils/logger';
import connectToDb from './utils/connectToDb';
import router from './routes';

const app = express();

const port = config.get('port');

app.listen(port, async () => {
  await connectToDb();
  app.use('/api/v1', router);
  log.info(`App started at http://localhost:${port}`);
});
