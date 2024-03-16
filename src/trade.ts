import { Contract } from "ethers";
import IERC20 from '../build/contracts/IERC20.json';
import log from "./log";
import { Units } from "./types";
import W3Wallet from "./wallet";

export default class Trade {
  private wallet: W3Wallet;
  private address: string;
  private contract: Contract;

  constructor(wallet: W3Wallet, contractAddress: string, abi: any) {
    this.wallet = wallet;
    this.address = contractAddress;
    this.contract = wallet.contract(this.address, abi, wallet.wallet.wallet);
  }


  /**
   * Get Unit string based on Token decimal
   * @returns Unit String
   */
  async getUnit(contract: Contract): Promise<Units> {
    const units: { [key: string]: Units; } = {
      '0': 'noether',
      '1': 'wei',
      '1000': 'kwei',
      '1000000': 'mwei',
      '1000000000': 'gwei',
      '1000000000000': 'micro',
      '1000000000000000': 'milli',
      '1000000000000000000': 'ether',
      '1000000000000000000000': 'kether',
      '1000000000000000000000000': 'mether',
      '1000000000000000000000000000': 'gether',
      '1000000000000000000000000000000': 'tether'
    };

    const decimal: BigInt = await contract.decimals();
    const unit = units[(Math.pow(10, parseInt(decimal.toString()))).toString()];
    return unit;
  }

  async swap(useV2: boolean, quote: string, base: string, amount: number | string, slippage: number, data?: any): Promise<any> {
    try {
      if (!data) {
        data = {
          gasLimit: (9000000 + parseInt(process.env.GAS_FEE!)).toString()
        };
      }
      const quoteContract = this.wallet.contract(quote, IERC20.abi, this.wallet.wallet.wallet);
      const unit = await this.getUnit(quoteContract);
      const amountIn = this.wallet.ethers.utils.parseUnits(amount.toString(), unit);

      const baseTrx = await quoteContract.approve(this.address, amountIn, data);
      await baseTrx.wait();

      const trx = await this.contract.executeTrade(useV2 || true, quote, base, amountIn, slippage, data);
      await trx.wait();

      return trx;
    } catch (err) {
      // log.error(err);
      log.info(`Pair of ${quote} and ${base} blacklisted..`);
    }
  }
}