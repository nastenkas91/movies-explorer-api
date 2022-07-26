require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/rateLimit');
const routes = require('./routes/index');
// const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { devDataBase } = require('./utils/devConfig');

const { PORT = 3000 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : devDataBase);

// app.use(cors); //TBD после деплоя фронтенда

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
