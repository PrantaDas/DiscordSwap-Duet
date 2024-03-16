import { DexResponse, DexTokenResponse, Pair } from "./types";

export default class Api {
  private readonly pairUrl: string;
  private readonly tokenUrl: string;

  constructor(pairUrl: string, tokenUrl: string) {
    this.pairUrl = pairUrl;
    this.tokenUrl = tokenUrl
  }

  /**
   * getLiquidity()

   * @param chain - String
   * @param pairAddress - String
   * @returns - DexResponse
   */
  async getLiquidity(chain: string, pairAddress: string): Promise<Pair> {
    const res = await fetch(`${this.pairUrl}/${chain}/${pairAddress}`);
    if (res.status !== 200) throw new Error(res.statusText);
    const { pair } = await res.json() as DexResponse;
    return pair;
  }

  /**
   * getTokensLiquidity()

   * @param tokenAddress - String
   * @returns - DexTokenResponse
   */
  async getTokensLiquidity(tokenAddress: string): Promise<Pair[]> {
    const res = await fetch(`${this.tokenUrl}/${tokenAddress}`);
    if (res.status !== 200) throw new Error(res.statusText);
    const { pairs } = await res.json() as DexTokenResponse;
    return pairs;
  }
};