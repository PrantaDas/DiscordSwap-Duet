import { NewMessageEvent } from 'telegram/events';
import Api from "./api";
import log from "./log";
import Task from "./task";
import { DiscordResp } from "./types";
import { extractPairAddress, saveMessage } from "./utils";

function isDiscordResp(data: DiscordResp | NewMessageEvent): data is DiscordResp {
  return (data as DiscordResp).guild_id !== undefined;
}

export default async function processTask(
  data: DiscordResp,
  api: Api,
  task: Task,
  slippage: number,
  discord: {
    guild: string,
    channels: Array<string>
  },
): Promise<void> {
  try {
    let content: string = '';
    if (
      isDiscordResp(data) &&
      data.content &&
      data.guild_id === discord.guild &&
      !discord.channels.includes(data.channel_id)
    ) {
      content = data.content.trim();
      saveMessage(content)
    } else return;
    const matched = extractPairAddress(content);
    if (!(matched as boolean)) return;
    await Promise.all((matched as string[]).map(async (address: string) => await executeTask(api, task, slippage, address)));
  } catch (err) { log.error(err); }
};

async function executeTask(
  api: Api,
  task: Task,
  slippage: number,
  pairAddress: string
) {
  const pairResp = await api.getLiquidity('ethereum', pairAddress!);
  if (pairResp.dexId !== 'uniswap') return;
  const useV2 = pairResp.labels.includes('v2') ? true : false;
  const { usd } = pairResp.liquidity;

  let amount = 0;
  if (usd <= 39900) amount = parseFloat(process.env.X!);
  else if (usd >= 40000 && usd <= 99000) amount = parseFloat(process.env.Y!);
  else if (usd >= 100000 && usd <= 149990) amount = parseFloat(process.env.Z!);
  else if (usd >= 150000 && usd <= 249990) amount = parseFloat(process.env.A!);
  else if (usd >= 250000 && usd <= 499000) amount = parseFloat(process.env.B!);
  else if (usd >= 500000) amount = parseFloat(process.env.C!);
  else {
    log.info('=> No value matched');
    return;
  }

  task.addTask(pairAddress, useV2, pairResp.quoteToken.address, pairResp.baseToken.address, amount.toString(), slippage);

  log.info(`
  Transaction Data:
  Pair Address: ${pairAddress},
  Quote Token: ${pairResp.quoteToken.address},
  Base Token: ${pairResp.baseToken.address},
  Amount: ${amount.toString()},
  Label: ${useV2 ? '🦄 UniswapV2' : '🦄 UniswapV3'}`);
}