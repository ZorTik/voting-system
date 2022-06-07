#!/usr/bin/env node
import {PrismaClient} from "@prisma/client";
import * as fs from "fs";

let http = require('http');
let port = process.env.API_PORT || '3001';
let app = require('../app');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

let prisma = new PrismaClient();
(async function() {
    app.set('port', port);
    let server = http.createServer(app);
    // Middleware
    require("../middleware/passwords");
    server.listen(port);
})()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

export {prisma, config};