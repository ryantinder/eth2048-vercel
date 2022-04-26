const Web3 = require("web3");
const  abi  = require("./public/abi.json");
const contractAddress = "0x322c4CCcD7CeB6a328782e0ab3Baf65913C33A86";
const ALCHEMY_API_KEY="CmpA3XVOkoRR78rJrf1rWg24X4BOJ06X"
const provider = new Web3.providers.HttpProvider(`https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(abi, contractAddress);
const main = async() => {
    const event = await contract.getPastEvents('gameUpdate', {fromBlock: 1});
    console.log(event);
}

main().then();