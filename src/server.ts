import cors from 'cors';
import express, { urlencoded, Request, Response } from 'express';
import actuator from 'express-actuator';
import healthCheck from 'express-healthcheck';
import { readFileSync } from 'fs';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import http2 from 'https';


const app = express();
export const PORT = process.env.PORT! || 4040;
const USEHTTP2 = process.env.USEHTTP2 === 'true' ? true : false;

let server: http.Server;

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(morgan('common'));
app.use(actuator({
  basePath: '/health',
  infoGitMode: 'full',
  infoBuildOptions: {},
}));
app.use('/health', healthCheck());
app.use(urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Serve is running on port ' + PORT });
});

app.get('/status', (req: Request, res: Response) => {
  return res.status(200).send({ message: 'Discord bot is running!' });
});

if (USEHTTP2) {
  const options = {
    key: readFileSync(path.join(process.cwd(), 'ssl', 'privatekey.pem')),
    cert: readFileSync(path.join(process.cwd(), 'ssl', 'certificate.pem')),
    allowHTTP1: true,
    protocols: ['h2', 'http/1.1']
  };

  server = http2.createServer(options, app);
}

else server = http.createServer(app);

export default server;