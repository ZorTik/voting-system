#!/usr/bin/env node
import {PrismaClient} from "@prisma/client";
import * as fs from "fs";
import express, {NextFunction, Request, Response} from "express";
import {status} from "../util";

let cookieParser = require('cookie-parser');
let cors = require('cors');
let app = require('../app');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let port = config.api_port || '3001';
let prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let indexRouter = require('../controllers/index');
let accountRouter = require('../controllers/account');
let serverRouter = require('../controllers/server');
let serversRouter = require('../controllers/servers');

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/server', serverRouter);
app.use('/servers', serversRouter);

(async function() {
    app.set('port', port);
    // Middleware
    require("../middleware/passwords");
    prisma.$connect();
    app.listen(port);
})()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

export {prisma, config};