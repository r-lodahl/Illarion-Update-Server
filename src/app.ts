import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import json from 'koa-json';

export const app = new Koa();

app.use(bodyParser());
app.use(json({pretty: true}));
app.use(logger());

//app.use(etlJobRoutes.routes());
//app.use(etlJobRoutes.allowedMethods());
