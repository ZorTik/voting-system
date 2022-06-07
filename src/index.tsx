import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Configuration
import {DateLogger} from "./logging/loggers";
import {Level} from "./logging/logging";

class DefaultLevel extends Level {
    static DEBUG = new DefaultLevel(0, "DEBUG");
    static INFO = new DefaultLevel(1, "INFO");
    static WARN = new DefaultLevel(2, "WARN");
    static ERROR = new DefaultLevel(3, "ERROR");
    static FATAL = new DefaultLevel(4, "FATAL");
    private static vals = [
        DefaultLevel.DEBUG,
        DefaultLevel.INFO,
        DefaultLevel.WARN,
        DefaultLevel.ERROR,
        DefaultLevel.FATAL
    ];
    static values() {
        return DefaultLevel.vals;
    }
}
const logger = new DateLogger(DefaultLevel.values());
logger.log("Starting...");
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export {logger, DefaultLevel};
