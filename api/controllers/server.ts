import {prisma, config} from "../bin/www";
import {status} from "../util";
import {NextFunction, Request, Response} from "express";
import {error, now} from "./util";

let express = require('express');
let router = express.Router();

const SERVER_KEY = "_serv";

const applicableVotesQuery: (serverId: number) => any = (serverId) => {
    return {
        where: {
            serverId: serverId,
            createdAt: {
                lt: new Date(now() - config.vote_expiration)
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    };
}

router.use("/:id", async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let server;
    if(isNaN(Number(id))) {
        status(res, 400, "Invalid id.");
        return;
    }
    if(req.method !== "PUT" || req.baseUrl !== `/server/${id}`) {
        if((server = await findServer(Number(id))) == null) {
            status(res, 404, "Server not found.");
            return;
        }
        if(req.method !== "GET") {
            req.body[SERVER_KEY] = server;
        }
    }
    next();
});
router.get('/:id', async function(req: Request, res: Response) {
    let id = Number(req.params.id);
    let server = await prisma.server.findUnique({
        where: {id: id}
    });
    server != null ? res.json(server) : status(res, 404);
});
router.put("/:id", async (req: Request, res: Response) => {
    let id = Number(req.params.id);
    if(await findServer(id) != null) {
        status(res, 409, "Server already exists.");
        return;
    }
    let name = req.body.name;
    let gif = req.body.gif;
    let source = req.body.source;
    if(name == null || gif == null || source == null) {
        status(res, 400, "Request must contain name, gif and source.");
        return;
    }
    prisma.server.create({
        data: {
            name: name,
            gif: gif,
            source: source,
            votes: {
                create: []
            }
        }
    });
    status(res, 200, "Server has been uploaded.");
});
router.get("/:id/votes", async (req: Request, res: Response) => {
    let id = Number(req.params.id);
    res.json(await prisma.vote.findMany(applicableVotesQuery(id)));
});
router.get("/:id/votes/count", async (req: Request, res: Response) => {
    let id = Number(req.params.id);
    res.json({
        count: await prisma.vote.count(applicableVotesQuery(id))
    });
});
router.put("/:id/vote", async function(req: Request, res: Response) {
    let id = Number(req.params.id);
    let nickname = req.body.nickname || null;
    let server = await findServer(id);
    if(nickname == null || server == null) {
        status(res, server == null ? 404 : 400);
        return;
    }
    let vote: any;
    if((vote = await findLastVote(id, nickname)) == null) {
        await prisma.vote.create({
            data: {
                nickname: nickname,
                serverId: id,
                server: server
            }
        });
        status(res, 200);
    } else error(425, "Cannot vote yet.", obj => {
        obj["next"] = vote.createdAt.valueOf();
    })
});

async function findServer(serverId: number): Promise<any | null> {
    return prisma.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            source: true
        }
    });
}

async function findLastVote(serverId: number, nickname: string): Promise<any | null> {
    return prisma.vote.findFirst(applicableVotesQuery(serverId));
}

module.exports = router;
