import Koa from 'koa';
import logger from 'koa-logger';
import bodyParser from 'koa-body';
import json from 'koa-json';
import { router } from './routes/routes';
import path from "path";

export const rootPath = path.resolve(__dirname).split('/src')[0];
export const app = new Koa();

app.use(bodyParser());
app.use(json({pretty: true}));
app.use(logger());

app.use(router.routes());
app.use(router.allowedMethods());
