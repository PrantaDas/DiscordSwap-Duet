import { config } from 'dotenv';
config();

import SWAP from '../build/contracts/Swap.json';
import Api from './api';
import Discord from './discord';
import log from './log';
import processTask from './processTask';
import Repository from './repository';
import server, { PORT } from './server';
import Task from './task';
import Trade from './trade';
import { DiscordResp } from './types';
import W3Wallet from './wallet';

// Checing env variables
const ENV_VARS = [
  'DEX_PAIR_API', 'DEX_TOKEN_API', 'RPC_URL',
  'PRIVATE_KEY', 'CONTRACT_ADDRESS', 'DISCORD_USER_TOKEN',
  'MONGODB_URL', 'DISCORD_SERVER_ID', 'DISCORD_CHANNEL_IDS',
  'SLIPPAGE', 'X', 'Y', 'Z', 'A', 'B'
];

const AVAILABLE_ENV_VARS = new Set(Object.keys(process.env));

const IS_VALID_ENV = ENV_VARS.every((key) => AVAILABLE_ENV_VARS.has(key));

if (!IS_VALID_ENV) {
  log.error('=> Env variables are missing.');
  process.exit(1);
}

log.info('=> All environment variables are loaded');


const TOKEN = process.env.DISCORD_USER_TOKEN!;
const RPC_PROVIDER = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
// CONTRACT_ADDRESS from env
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x19D7a50582593484857dCA68318fd9543a309fde';
const GUILD_ID = process.env.DISCORD_SERVER_ID!;
const DISC_CHANNEL_IDS = process.env.DISCORD_CHANNEL_IDS!.split(',').map((id: string) => id.trim());
const MONGODB_URL = process.env.MONGODB_URL!;
const SLIPPAGE = parseInt(process.env.SLIPPAGE!);

const discordParams = {
  guild: GUILD_ID,
  channels: DISC_CHANNEL_IDS
};

async function main() {
  log.info('=> Starting...');
  const discord = new Discord(TOKEN);
  const wallet = new W3Wallet(RPC_PROVIDER, PRIVATE_KEY);
  const trade = new Trade(wallet, CONTRACT_ADDRESS, SWAP.abi);
  // Boot the Database Repository
  const repo = new Repository(MONGODB_URL);
  const tasks = new Task(trade, repo);
  const api = new Api(process.env.DEX_PAIR_API!, process.env.DEX_TOKEN_API!);

  repo.start();
  // Starting the signaling server
  server.listen(PORT, () => {
    log.info('=> Server is listening on port ' + PORT);
  });
  // Discord will push data to callback in connect method
  discord.connect(async (data: DiscordResp) => await processTask(data, api, tasks, SLIPPAGE, discordParams));
}

(async () => await main())();