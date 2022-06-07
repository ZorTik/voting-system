import {prisma} from "../bin/www";
import bcrypt from "bcrypt";

prisma.$use(async (params, next) => {
    if((params.action === "create" || params.action === "update")
    && params.model === "Account") {
        let data = params.args.data
        let salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
    }
    return next(params);
})
export {};