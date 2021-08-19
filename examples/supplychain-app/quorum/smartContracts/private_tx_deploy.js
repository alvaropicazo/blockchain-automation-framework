const Web3 = require('web3');
const fs = require('fs-extra'); // Importing for writing a file
const contract = require('./compile'); //Importing the function to compile smart contract
const path = require('path');

const url = process.argv[2];  // url of RPC port of quorum node
const contractPath = process.argv[3]; // path to the contract directory
const contractEntryPoint = process.argv[4]; // Smart contract entrypoint eg Main.sol
const contractName = process.argv[5]; // Smart Contract Class Nameconst initArguments = process.env.INITARGUMENTS | " ";
const clientName = process.argv[6]; // Name of the sender;
const fromAddress = process.argv[7]; // Account address of the sender;
const toPublicKey = process.argv[8]; // Public address of the tessera tm of the receiver;
const value = process.argv[9]; // Value to be set for the private transaction;
const initArguments = process.env.INITARGUMENTS | " ";
const unlockPassPhrase = process.env.PASSPHRASE | " "; // Passphrase to unlock the account
const timeTillUnlocked = process.env.TIMETILLUNLOCKED | 600;
const numberOfIterations = parseInt(process.env.ITERATIONS) | 200; // Number of Iterations of execution of code for calculation of gas
// initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode

const web3 = new Web3(`${url}`); // Creating a provider
  
  //fromAddress: accountAddress of the sender, toPublicKey is the tessera public key of the receiver
const createContract = async () => {
    const web3 = new Web3(`${url}`); // Creating a provider
    const smartContract = await contract.GetByteCode(numberOfIterations,contractPath,contractEntryPoint,contractName); // Converting smart contract to byte code, optimizing the bytecode conversion for numer of Iterations
    const bytecode = `0x${smartContract.bytecode}`; // adding 0x prefix to the bytecode
    const contractInstance = new web3.eth.Contract(smartContract.abi);
    const ci = await contractInstance
      .deploy({ data: bytecode, arguments: [47] })
      .send({ from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22" })
      .on('transactionHash', function(hash){
        console.log("The transaction hash is: " + hash);
      });
    SetValueAtAddress(url,clientName,smartContract.abi,ci.options.address,fromAddress,toPublicKey)
}

  //Can be used to check the privateTransaction was executed fine
  async function getValueAtAddress(client, nodeName="node", deployedContractAddress, contractAbi) {
    const web3 = new Web3(`${url}`); // Creating a provider
    const web3quorum = new Web3Quorum(web3, {privateUrl: client.privateUrl}, true);
    const contractInstance = new web3.eth.Contract(contractAbi, deployedContractAddress);
    const res = await contractInstance.methods.get().call().catch(() => {});
    console.log(nodeName + " obtained value at deployed contract is: "+ res);
    return res;
  };
  

// You need to use the accountAddress details provided to Quorum to send/interact with contracts
const SetValueAtAddress = (host, value, deployedContractAbi, deployedContractAddress, fromAddress, toPublicKey) => {
  const web3 = new Web3(host)
  const contractInstance = new web3.eth.Contract(deployedContractAbi, deployedContractAddress);
  const res = await contractInstance.methods.set(value).send({from: fromAddress, privateFor: [toPublicKey], gasLimit: "0x24A22"});
  //return res
}
  
createContract();
