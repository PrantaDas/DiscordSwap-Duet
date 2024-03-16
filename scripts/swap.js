require('dotenv').config();
const { Web3, HttpProvider } = require('web3');
const IERC20 = require('../build/contracts/IERC20.json');
const SWAP = require('../build/contracts/Swap.json');

const NODE_URL = process.env.RPC_URL;
// const CONTRACTADDR = SWAP.networks['1'].address;
const CONTRACTADDR = "0x19D7a50582593484857dCA68318fd9543a309fde";

// '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'
const BASE_TOKEN = '0xC256F81d35a54c3599B424171d719E9Ae87b2E9b';

const SENDER = '0x6E84150012Fd6D571C33C266424fcDEcF80E3274';
const web3 = new Web3(new HttpProvider(NODE_URL));
const contract = new web3.eth.Contract(SWAP.abi, CONTRACTADDR);
const weth = new web3.eth.Contract(IERC20.abi, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
const shib = new web3.eth.Contract(IERC20.abi, BASE_TOKEN);

async function main(useV2, tradeAmount) {
  try {
    const wethBalanceBefore = web3.utils.fromWei(await weth.methods.balanceOf(SENDER).call(), 'ether');
    const shibBalanceBefore = web3.utils.fromWei(await shib.methods.balanceOf(SENDER).call(), 'ether');
    console.table({
      'WETH Balance Before': wethBalanceBefore,
      'SHIB Balance Before': shibBalanceBefore
    });

    // Amount to trade
    const amount = web3.utils.toWei(tradeAmount.toString(), 'ether');

    // Approve Token
    await weth.methods.approve(CONTRACTADDR, amount).send({ from: SENDER });
    // const trx = await contract.methods.executeTrade(
    //   useV2,
    //   '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    //   BASE_TOKEN,
    //   amount,
    //   100
    // ).send({
    //   from: SENDER,
    //   gas: 1000000
    // });
    // console.log(`\n=> Transaction complete!\n=> Hash: ${trx.transactionHash}\n`);

    // const wethBalanceAfter = web3.utils.fromWei(await weth.methods.balanceOf(SENDER).call(), 'ether');
    // const shibBalanceAfter = web3.utils.fromWei(await shib.methods.balanceOf(SENDER).call(), 'ether');
    // console.table({
    //   'WETH Balance After': wethBalanceAfter,
    //   'SHIB Balance After': shibBalanceAfter
    // });
  } catch (e) {
    console.log(e);
  }
};

(async () => {
  const useV2 = false;
  const tradeAmount = 1;
  console.log(`\n\n=> Swaping on UniSwap${useV2 ? 'V2' : 'V3'}...`);
  await main(useV2, tradeAmount);
  console.log(`=> Swap complete on UniSwap${useV2 ? 'V2' : 'V3'}...\n\n`);
  process.exit(0);
})();
