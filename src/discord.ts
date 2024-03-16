import WebSocket from 'ws';
import { DiscordPayload, DiscordResp } from './types';
import log from './log';
var ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');

export default class Discord {
  private token: string;
  private payload: DiscordPayload;

  constructor(token: string) {
    this.token = token;

    /**
   * Webhook Initiator Payload
   */
    this.payload = {
      op: 2,
      d: {
        token: token,
        capabilities: 253,
        properties: {
          "os": "linux",
          "browser": "chrome",
          "device": "chrome",
        }
      }
    };
  }
  /**
   * Resets Websocket Heartbit
   * @param {Integer} ms
   * @returns
   */
  heartbeat(ms: number) {
    return setInterval(() => {
      ws.send(JSON.stringify({ op: 1, d: null }));
    }, ms);
  }

  connect(callback: (data: DiscordResp) => void) {
    ws.on('open', () => {
      ws.send(JSON.stringify(this.payload));
    });

    // Don't let it close the connection
    ws.on('close', () => {
      ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
    })

    ws.on('message', (data: WebSocket.RawData) => {
      let payload = JSON.parse(data.toString());
      let { t, op, d } = payload;

      switch (op) {
        case 10:
          const { heartbeat_interval } = d;
          this.heartbeat(heartbeat_interval);
          break;

        case 7:
          log.debug(payload);
      }

      switch (t) {
        case 'READY':
          log.info(`=> Logged in as ${d.user.username}#${d.user.discriminator}`);
          break;

        case 'MESSAGE_CREATE':
          callback(d);
          break;
        default:
          break;
      }
    });
  }
}