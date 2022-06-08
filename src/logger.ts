import {Level} from "./logging/logging";
import {DateLogger} from "./logging/loggers";

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

module.exports = new DateLogger(DefaultLevel.values());