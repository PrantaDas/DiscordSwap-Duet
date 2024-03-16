import { appendFileSync, existsSync, writeFileSync } from "fs";
import log from "./log";
import path from "path";

export async function saveTrxnHash(hash: string): Promise<void> {
  try {
    const fileName = 'transactions.txt';
    const fullPath = path.join(process.cwd(), fileName);
    if (!existsSync(fileName)) writeFileSync(fullPath, '');
    appendFileSync(fullPath, `${hash}, (${new Date().toLocaleString()})\n`);
  }
  catch (err) {
    log.error(err);
  }
};

export function extractPairAddress(text: string): boolean | Array<string> {
  const regex = /https?:\/\/dexscreener\.com\/([a-zA-Z\-]+)\/(0x[a-fA-F0-9]+)?/gm;

  const addresses = new Set<string>();
  const groups = Array.from(text.matchAll(regex));
  if (!groups) return false;

  groups.forEach(group => {
    if (group.length < 3) return false;
    const [, chain, address] = group;
    if (!addresses.has(address) && chain.toLowerCase() === 'ethereum') addresses.add(address);
  });

  return Array.from(addresses);
}

export async function saveMessage(content: string): Promise<void> {
  try {
    const fileName = 'message.txt';
    const fullPath = path.join(process.cwd(), fileName);
    if (!existsSync(fileName)) writeFileSync(fullPath, '');
    appendFileSync(fullPath, `${content}, (${new Date().toLocaleString()})\n`);
  }
  catch (err) {
    log.error(err);
  }
};