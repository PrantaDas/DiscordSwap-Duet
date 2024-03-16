# Discord -> Uniswap (V2 & V3)

## Run Development node

**Ganache**

```sh
ganache -a 10 -m "your_mnemonic_phrase" -f <your_node_url> -u "0x7cB769025F9CCFdf2DF576bf848479Dabf8BF195" -u "0x51eDF02152EBfb338e03E30d65C15fBf06cc9ECC"
```

## Routers

- **UniSwap V2 Router:** 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
- **UniSwap V3 Router:** 0xe592427a0aece92de3edee1f18e0157c05861564

## Test with tokens

- **WETH:** 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
- **SHIB:** 0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE

## Commands

Use your favourite package manager.

**For `yarn` and `pnpm`** use any

- **Deploy Contract:** `pnpm migrate`
- **Send some WETH:** `pnpm send:eth`
- **Start LIVE:** `pnpm start`
- **Start DEV:** `pnpm dev`
- **Build /w esbuild a single build:** `pnpm build`
- **Build with tsc:** `pnpm compile`
- **TEST:** `pnpm test`

**For `npm`** use any

- **Deploy Contract:** `npm run migrate`
- **Send some WETH:** `npm run send:eth`
- **Start LIVE:** `npm run start`
- **Start DEV:** `npm run dev`
- **Build /w esbuild a single build:** `npm run build`
- **Build with tsc:** `npm run compile`
- **TEST:** `npm run test`
