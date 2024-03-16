import { config } from 'dotenv';
config();

import { describe, expect, test } from "@jest/globals";
import Wallet from "./wallet";
import { Contract } from 'ethers';

describe("Test Walet Creation", () => {
  const RPC_PROVIDER = process.env.RPC_URL || "";
  const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
  const wallet = new Wallet(RPC_PROVIDER, PRIVATE_KEY);

  // Test If I can create a web3/ethers instance with Wallet Class
  test("Web3 instance creation", () => {
    expect(wallet.web3).toHaveProperty('ready');
  });

  // Test If I can create a wallet with Wallet Class
  test("Wallet instance creation", () => {
    expect(wallet.createWallet(PRIVATE_KEY).wallet.address)
      .toBe('0x6E84150012Fd6D571C33C266424fcDEcF80E3274');
  });

  // Test if there is any ethers module exported from Wallet Class
  test('ethers instances\' presense', () => {
    expect(wallet.ethers).toHaveProperty('utils'); // Utils is present in v5
  });

  // Test uFactory is an Instance of Smart Contract
  test('uFactory is an Instance of Smart Contract', () => {
    expect(wallet.uFactory()).toBeInstanceOf(Contract);
  });
});