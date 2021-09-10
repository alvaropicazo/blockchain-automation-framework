const path = require('path');
const fs = require('fs-extra');
const Tx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

// member1 details
const { tessera, besu } = require("./keys.js");
const host = 'http://malv.quo.dev2.aws.blockchaincloudpoc-develop.com:15014';

async function main(){
  const web3 = new Web3(host);
  console.log("OH")
  // preseeded account with 90000 ETH
  //const privateKeyA = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
  const accountA = '0x117908498377ec101537e8ef697d9c7ec2f919ee';
  var accountABalance = web3.utils.fromWei(await web3.eth.getBalance('0x117908498377ec101537e8ef697d9c7ec2f919ee'));
  console.log("Account A has balance of: " + accountABalance);

  // create a new account to use to transfer eth to
  var accountB = '0x117908498377ec101537e8ef697d9c7ec2f919ee';
  var accountBBalance = web3.utils.fromWei('0x117908498377ec101537e8ef697d9c7ec2f919ee');
  console.log("Account B has balance of: " + accountBBalance);

  // send some eth from A to B
  const rawTxOptions = {
    nonce: web3.utils.numberToHex(await web3.eth.getTransactionCount('0x117908498377ec101537e8ef697d9c7ec2f919ee')),
    from: '0x117908498377ec101537e8ef697d9c7ec2f919ee',
    to: '0x0c81d9d7c651a54cab888c3fec3ebab2bee5a121', 
    value: "0x100",  //amount of eth to transfer
    gasPrice: "0x0", //ETH per unit of gas
    gasLimit: "0x24A22" //max number of gas units the tx is allowed to use
  };
  console.log("Creating transaction...");
  const tx = new Tx(rawTxOptions);
  console.log("Signing transaction...");
  tx.sign(Buffer.from('fc8521ec20b62acc4ef11fc74b7664c485e599e980d3c390eb67ec96e27aa927', "hex"));
  console.log("Sending transaction...");
  var serializedTx = tx.serialize();
  const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex').toString("hex"));
  console.log("tx transactionHash: " + pTx.transactionHash);

  //After the transaction there should be some ETH transferred
  accountABalance = web3.utils.fromWei(await web3.eth.getBalance('0x117908498377ec101537e8ef697d9c7ec2f919ee'));
  console.log("Account A has an updated balance of: " + accountABalance);
  accountBBalance = web3.utils.fromWei(await web3.eth.getBalance('0x0c81d9d7c651a54cab888c3fec3ebab2bee5a121'));
  console.log("Account B has an updatedbalance of: " + accountBBalance);

}

if (require.main === module) {
  main();
}

module.exports = exports = main

