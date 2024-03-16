import { Wallet, Contract, providers } from 'ethers';
import Trade from './trade';
import { type } from 'os';

export type WalletAccount = {
  web3: providers.WebSocketProvider;
  wallet: Wallet;
  uFactory: Contract;
  contracts: {
    [key: string]: Contract
  }
};

export type TokenContracts = {
  contract: Contract;
  token: Token;
};

export type TaskQueue = {
  pair: string;
  args: [boolean, string, string, number | string, number, any | undefined]
};

export type DiscordPayload = {
  op: number;
  d: {
    token: string;
    capabilities: number;
    properties: {
      [key: string]: any;
    }
  }
};

export type DiscordResp = {
  type: number;
  flags: number;
  tts: boolean;
  pinned: boolean;
  mention_everyone: boolean;
  timestamp: Date;
  referenced_message: null | string;
  nonce: string;
  mentions: string[];
  mention_roles: string[];
  id: string;
  content: string;
  channel_id: string;
  guild_id: string;
  author: DiscordAuthor;
  member: DiscordMember;
};

export type DiscordAuthor = {
  username: string;
  public_flags: number;
  premium_type: number;
  id: string;
  global_name: string;
  descriminator: string;
  avatae: string;
};

export type DiscordMember = {
  roles: string[];
  premium_since: null | Date;
  pending: boolean;
  nick: string;
  mute: boolean;
  joined_at: Date;
  flags: number;
  deaf: boolean;
  communication_disabled_until: Date;
  avatar: null | string;
};

export type Units = 'noether' | 'wei' | 'kwei' | 'mwei' | 'gwei' | 'micro' | 'milli' | 'ether' | 'kether' | 'mether' | 'gether' | 'tether';

export type DexResponse = {
  pair: Pair;
  pairs: Pair[];
  schemaVersion: string;
};

export type DexTokenResponse = {
  schemaVersion: string;
  pairs: Pair[];
};

export type Pair = {
  baseToken: Token;
  chaidId: string;
  dexId: string;
  fdv: number;
  labels: Array<'v2' | 'v3'>;
  liquidity: Liquidity;
  pairAddress: string;
  pairCreatedAt: number;
  priceChange: PriceChange;
  priceNative: string;
  priceUsd: string;
  quoteToken: Token;
  txns: Trxns;
  url: string;
  volume: PriceChange;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
};

export type Liquidity = {
  base: number;
  quote: number;
  usd: number;
};

export type PriceChange = {
  h1: number;
  h6: number;
  h24: number;
  m5: number;
};

export type TrxnType = {
  buys: number;
  sells: number;
};

export type Trxns = {
  h1: TrxnType;
  h6: TrxnType;
  h24: TrxnType;
  m5: TrxnType;
};

export type TelegramArgs = {
  apiId: number;
  apiHash: string;
  session?: string;
};