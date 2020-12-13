"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const path_1 = require("path");
const stream_1 = require("stream");
const url_1 = require("url");
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
app.prepare().then(() => {
    http_1.createServer((req, res) => {
        const parsedUrl = url_1.parse(req.url || '', true);
        const { pathname } = parsedUrl;
        if (pathname === process.env.NEXT_PUBLIC_SERVICE_WORKER_SERVER_PATH) {
            res.setHeader('content-type', 'text/javascript');
            stream_1.pipeline(fs_1.createReadStream(path_1.resolve(__dirname, '../service-worker.js')), res, err => {
                if (err)
                    console.error('Error', err);
            });
        }
        else {
            handle(req, res, parsedUrl);
        }
    }).listen(port, () => {
        console.log(`> Ready on ${process.env.NEXT_PUBLIC_SITE_URL} | PORT: ${port}`);
    });
});
