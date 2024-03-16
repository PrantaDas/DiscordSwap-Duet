import Trade from "./trade";
import log from './log';
import { TaskQueue } from "./types";
import Repository from "./repository";
import { saveTrxnHash } from "./utils";

export default class Task {
  private trades: Array<TaskQueue> = [];
  private isRunning: boolean = false;
  private trade: Trade;
  private repo: Repository;

  constructor(trade: Trade, db: Repository) {
    this.trade = trade;
    this.repo = db;
  }

  async addTask(
    pair: string,
    useV2: boolean,
    quote: string,
    base: string,
    amount: number | string,
    slippage: number,
    data?: any
  ): Promise<any> {
    // Check if the pair is already exists in Repository
    const isExist = await this.repo.findOne({ pairAddress: pair });
    if (isExist) return log.info(`=> Pair ${pair} already traded/blacklisted.`);

    this.trades.push({
      pair,
      args: [useV2, quote, base, amount, slippage, data]
    });

    if (!this.isRunning) {
      await this.resolve();
    }
  }

  async resolve() {
    const task = this.trades.shift();
    if (!task) return;

    // Set running state to pending
    this.isRunning = true;
    const res = await this.trade.swap(...task.args);

    if (res) {
      // Oraganize this
      log.info(`=> New Transaction TrxHash: ${res.hash} `);

      // Save the transaction with pair to Repository
      await this.repo.insertOne({
        pairAddress: task.pair,
        trxHash: res.hash,
        quoteToken: task.args[1],
        baseToken: task.args[2],
        amount: task.args[3],
        createdAt: new Date().toISOString()
      });

      await saveTrxnHash(res.hash);
    }
    // Save to db as blacklisted if failsf
    else await this.repo.insertOne({ pairAddress: task.pair });

    // Set running state to completed
    this.isRunning = false;

    // Do the next task
    await this.resolve();
  }
}