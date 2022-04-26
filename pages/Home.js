import Head from 'next/head'
import { useState, useEffect } from 'react/cjs/react.production.min'
// import { useState, useEffect } from 'react/cjs/react.development'
import Web3 from 'web3'
import abi from "../public/abi.json"
import BigNumber from "bignumber.js";
import Game from '../src/game';
import React from "react"
import Image from 'next/image';
import { BiPaste } from 'react-icons/bi'

export default function Home() {

  // Initialize provider
  const provider = new Web3.providers.HttpProvider(`https://eth-ropsten.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}`);
  // Initialize web3
  const web3 = new Web3(provider);

  //Set contract address
  const contractAddress = "0x322c4CCcD7CeB6a328782e0ab3Baf65913C33A86";
  // Set contract
  var contract = new web3.eth.Contract(abi, contractAddress)
  contract.events.gameUpdate({fromBlock: 1}).on('data', async (event) => {
    alert("Found event")
    console.log(event.returnValues)
  })
  const [game, setGame] = useState("")
  const [wallet, setWallet] = useState("")
  

  const paste = async () => {
    let val = (await navigator.clipboard.readText()).toLowerCase();
    val = val.replace(/^\s+|\s+$/g, '');
    if (web3.utils.isAddress(val)) {
      setWallet(val);
    } else {
      alert(`Pasted invalid address: ${val}`)
    }
  }

  function requestPermissions() {
    ethereum
      .request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
      .then((permissions) => {
        const accountsPermission = permissions.find(
          (permission) => permission.parentCapability === 'eth_accounts'
        );
        if (accountsPermission) {
          console.log('eth_accounts permission successfully requested!');
          console.log(accountsPermission)
          setWallet(window.ethereum.selectedAddress);
          updateGame();
        }
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Permissions needed to continue.');
        } else {
          console.error(error);
        }
      });
  }
  let locked = 0;
  const createGame = async () => {
    if (locked == 0) {
      const params = [{
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: contract.methods.createGame().encodeABI(), // Optional, but used for defining smart contract creation and interaction.
      }];
      locked = 1;
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      window.ethereum.request({
        method: 'eth_sendTransaction',
        params
      }).then( rec => {
        console.log(rec);
        updateGame();
        locked = 0;
      }).catch( err => {
        console.log(err);
        alert("An error occurred, please retry");
        locked = 0;
      })
    }

    // contract.methods.createGame().send({
    //   from: wallet
    // }).then( rec => {
    //   console.log(rec)
    //   updateGame();
    // })
  }
  const _move = async (dir) => {
    if (locked == 0) {
      const params = [{
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: contract.methods.move(dir).encodeABI(), // Optional, but used for defining smart contract creation and interaction.
      }];
      locked = 1;
      window.ethereum.request({
        method: 'eth_sendTransaction',
        params
      }).then( rec => {
        console.log(rec);
        updateGame();
        locked = 0;
      }).catch( err => {
        console.log(err);
        alert("An error occurred, please retry");
        locked = 0;
      })
    }
  }
  const move = async (dir) => {
    if (game === "") return;
    _move(dir);
  }

  const updateGame = async () => {
    console.log("updating")
    const events = await contract.getPastEvents('gameUpdate', {addr: window.ethereum.selectedAddress, fromBlock: 1});
    if (events.length == 0) {
      alert("Game not found. Create one!");
      return;
    }
    console.log(events)
    const x = new BigNumber(events[events.length - 1].returnValues.game);
    setGame(x.toString(2))
    console.log("updated")
  }


  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
      <div className='buttonContainer'>
        <button className='importWalletButton' onClick={requestPermissions}>
          <Image src="/metamask.png" width={30} height={30} alt="Connect Metamask"/>
        </button>
        <button className="importWalletButton" onClick={paste}>
          < BiPaste size={30} color="grey"/>
        </button>
        <input placeholder='Wallet'
          value={wallet}
          className="walletInput">
        </input>
        <button onClick={createGame} className="button">
            New
          </button>
          <button onClick={updateGame} className="button">
            Retrieve
          </button>
      </div>  


        <Game val={game} />
              
        <div className='actionContainer'>
          <div></div>
          <button onClick={() => {move(3)}}>{String.fromCharCode(8593)}</button>
          <div></div>
          <button onClick={() => {move(2)}}>{String.fromCharCode(8592)}</button>
          <div></div>
          <button onClick={() => {move(4)}}>{String.fromCharCode(8594)}</button>
          <div></div>
          <button onClick={() => {move(1)}}>{String.fromCharCode(8595)}</button>
          <div></div>
        </div>
      </main>
    </div>
  )
}
