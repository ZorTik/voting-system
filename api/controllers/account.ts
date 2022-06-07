import {prisma} from "../bin/www";
import express, {NextFunction, Request, Response} from "express";
import {status} from "../util";
import { Prisma } from "@prisma/client";

let router = express.Router();

router.use("/:id", async (req: Request, res: Response, next: NextFunction) => {
    if(req.method !== "PUT") {
        let id = req.params.id
        let acc = await getAccount(id);
        if(acc == null) {
            status(res, 404, "Account not found.");
            return;
        }
        req.body._account = acc;
    }
    next();
});

router.get("/:id", async (req, res) => {
    return res.json(req.body._account);
});

router.post("/:id", async (req, res) => {
    let data = Prisma.validator<Prisma.AccountUpdateArgs>()(req.body);
    let success = await prisma.account.update({
        where: {nickname: req.params.id},
        data: data
    });
    success ? status(res, 200, "Account has been updated.") : status(res, 500)
});

router.put("/:id", async (req, res) => {
    let body = req.body;
    if(!body.hasOwnProperty("password")) {
        status(res, 400, "Request must contain password.");
        return;
    }
    let nickname = req.params.id;
    let password = body.password;
    let success = await prisma.account.create({
        data: {
            nickname: nickname,
            password: password
        }
    })
    success
        ? status(res, 200, "Account has been created.")
        : status(res, 409, "Account already exists.")
});

export async function getAccount(id: string): Promise<any | null> {
    return prisma.account.findUnique({
        where: {nickname: id},
        include: {
            servers: true
        }
    });
}

module.exports = router;