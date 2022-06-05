import express from "express";
import config from "../config.json";
import {logger} from "../index";

let server = express();
server.listen(config["api-port"], () => logger.log(`API server listening on port ${config["api-port"]}`));