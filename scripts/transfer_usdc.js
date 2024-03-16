require('dotenv').config();
const { Web3, HttpProvider } = require('web3');
const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json');

const NODE_URL = process.env.RPC_URL;
const RECEIVER = "0x6E84150012Fd6D571C33C266424fcDEcF80E3274";
const SENDER = "0x51eDF02152EBfb338e03E30d65C15fBf06cc9ECC"
const CONTRACTADDR = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const web3 = new Web3(new HttpProvider(NODE_URL));
const contract = new web3.eth.Contract(IERC20.abi, CONTRACTADDR);


function convert(method, balance) {
  return web3.utils[method](balance, 'mwei');
}

function getBalance(wallet) {
  return contract.methods.balanceOf(wallet).call();
}

async function main() {
  try {
    //log
    const balanceSenderBefore = await getBalance(SENDER);
    console.log(`balance of sender: ${convert('fromWei', balanceSenderBefore.toString())} WA:${SENDER}`);
    const balanceReceiverBefore = await getBalance(RECEIVER);
    console.log(`balance of receiver: ${convert('fromWei', balanceReceiverBefore)} WA:${RECEIVER}`);

    //transaction
    await new Promise((resolve, reject) => {
      return contract.methods.transfer(RECEIVER, web3.utils.toWei("230000000", "mwei")).send({ from: SENDER, gasPrice: 500000000000 })
        .on('transactionHash', function (hash) {
          console.log('Transaction hash:', hash);
        })
        .on('confirmation', function () {
          console.log("transaction confirmed")
          resolve();
        })
        .on('error', function (error) {
          reject(error);
        })
    });

    //log
    const balanceSenderAfter = await getBalance(SENDER);
    console.log(`balance of sender: ${convert('fromWei', balanceSenderAfter)} WA:${SENDER}`);
    const balaceReceiverAfter = await getBalance(RECEIVER);
    console.log(`balance of receiver: ${convert('fromWei', balaceReceiverAfter)} WA:${RECEIVER}`);
    process.exit(0);
  }
  catch (e) {
    console.log(e);
  }
};

main();
