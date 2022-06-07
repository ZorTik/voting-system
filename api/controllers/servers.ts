import express from "express";
import {status} from "../util";
import {prisma} from "../bin/www";
let router = express.Router();
let orders: any = {
    "votes": (query: any) => {
        query.orderBy = {
            votes: {
                _count: "desc"
            }
        }
    }
}
function appendOrderFilter(reqJson: any, query: any) {
    let order = reqJson.order || "votes";
    orders.hasOwnProperty(order) && orders[order](query);
}
router.post("/", async (req, res) => {
    let reqJson = JSON.parse(req.body);
    if (reqJson.hasOwnProperty("page") && reqJson.hasOwnProperty("size")) {
        let page = reqJson["page"];
        let size = reqJson["size"];
        let query = {
            skip: page * size,
            take: size,
            include: {
                votes: {
                    select: {
                        nickname: true
                    }
                }
            }
        };
        appendOrderFilter(reqJson, query);
        const servers = await prisma.server.findMany(query);
        res.json(servers);
    } else {
        status(res, 400);
    }
});
module.exports = router;
export default orders;