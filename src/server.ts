import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { APP_PORT } from "./lib/config";

const port = APP_PORT;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();
createServer((req, res) => {
  const parsedUrl = parse(req.url!, true);
  handle(req, res, parsedUrl);
}).listen(port);

