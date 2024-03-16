import IUniswapV2Factory from '@uniswap/v2-core/build/IUniswapV2Factory.json';
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { ethers, Wallet, Contract, providers } from 'ethers';
import { WalletAccount } from './types';
import { Web3NodeError } from './errors';

/**
 * Custom Wallet Class
 * that wraps the Web3 Wallet and web3 specific functionalities
 */
class W3Wallet {
  private _provider: string;
  private _web3: providers.WebSocketProvider;
  private _key: string;
  public wallet: WalletAccount;

  /**
   * Wallet
   * @param provider WebSocket provider url
   * @param privateKey Private key of the wallet
   */
  constructor(provider: string, privateKey: string) {
    try {
      this._key = privateKey;
      this._provider = provider;
      // this._web3 = new Web3(new HttpProvider(provider));
      // const walletProvider = new HDWalletProvider(privateKey, provider);
      this._web3 = new providers.WebSocketProvider(provider);
      this.wallet = this.createWallet(privateKey);
    } catch (err) {
      console.log(err);
      throw new Web3NodeError('WEB3_NODE_ERROR');
    }
  }

  /**
   * Returns the Web3 instance
   */
  get web3(): providers.WebSocketProvider {
    return this._web3;
  }

  get ethers() {
    return ethers;
  }

  /**
   * Creates Web3 Account for transactions
   * @param privateKey Wallet private key
   * @returns Web3 Account instance
   */
  createWallet(privateKey: string): WalletAccount {
    // const web3 = new Web3(new HttpProvider(this._provider));
    const web3 = new providers.WebSocketProvider(this._provider);
    const wallet = new Wallet(privateKey, web3); // Create the actual wallet
    return {
      web3,
      wallet,
      uFactory: this.uFactory(undefined, wallet),
      contracts: {}
    };
  }

  /**
   * Uniswap V2 factory Contract
   */
  uFactory(factory?: string, web3?: Wallet): Contract {
    const address = factory || process.env.U_FACTORY?.replace('\r', '') || '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // Ethereum Uniswap Factory Address
    if (web3) return new Contract(address, IUniswapV2Factory.abi, web3);
    return new Contract(address, IUniswapV2Factory.abi, this.wallet.wallet);
  }

  /**
   * Any Contract
   * @param address Contract address
   * @param abi Contract Abi
   * @param web3 Web3 Instance
   * @returns Contract
   */
  contract(address: string, abi: any, web3?: Wallet): Contract {
    if (web3) return new Contract(address, abi, web3);
    return new Contract(address, abi, this.wallet.wallet);
  }

  /**
   * Uniswap V2 Router Contract
   */
  async uPair(name: string, factory: Contract, quote: string, base: string): Promise<Contract> {
    const pairAddress = await factory.getPair(quote, base);
    const contract = new Contract(pairAddress, IUniswapV2Pair.abi, this.wallet.wallet);
    this.wallet.contracts[name] = contract;
    return contract;
  }

  /**
   * Get Max Gas fee for current block
   * @returns Max GAS fee
   */
  async maxGasFee(): Promise<string> {
    const block = await this.wallet.web3.getBlock('latest');
    if (!block.baseFeePerGas) return '600000';
    return (Math.ceil(parseInt(block.baseFeePerGas.toString()) * 1.251)).toString();
  }
}

export default W3Wallet;