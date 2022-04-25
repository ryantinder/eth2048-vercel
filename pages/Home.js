import Head from 'next/head'
import { useState, useEffect } from 'react/cjs/react.production.min'
import Web3 from 'web3'
import abi from "../public/abi.json"
import BigNumber from "bignumber.js";
import Game from '../src/game';
import React from "react"
import Image from 'next/image';
import { BiPaste } from 'react-icons/bi'
// My address 
const myAddr = "0xb0221c639daf0F7264096D11CD78E0e2d093dB7a";
const myPkey = "bd8e74dcd6d45fe5a1b714348183e0f689cb693876f6e609efa9d4820caad2ef";
// Initialize web3
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

//Set contract address
const contractAddress = "0x25358557c2375cBF17985fd706774e1F952F2E96";

// Set contract
var contract = new web3.eth.Contract(abi, contractAddress)


export default function Home() {
  const [game, setGame] = useState("")
  const [wallet, setWallet] = useState("")
  async function requestAccount() {
    console.log("Requesting account");

    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWallet(accounts[0]);
      } catch (e) {}
    } else {
      console.log("not detected");
    }
  }

  const paste = async () => {
    let val = (await navigator.clipboard.readText()).toLowerCase();
    val = val.replace(/^\s+|\s+$/g, '');
    if (web3.utils.isAddress(val)) {
      setWallet(val);
    } else {
      alert(`Pasted invalid address: ${val}`)
    }
  }
  const createGame = async () => {
    contract.methods.createGame().send({
      from: wallet
    }).then( rec => {
      console.log(rec)
      updateGame();
    })
  }
  let locked = 0;
  const _move = async (dir) => {
    if (locked == 0) {
      locked = 1;
      contract.methods.move(dir).send({
        from: wallet,
        gas: 200000
      }).then( rec => {
        locked = 0;
        console.log(rec.cumulativeGasUsed);
        updateGame();
      })
    }
  }
  const move = async (dir) => {
    if (game === "") return;
    _move(dir);
  }

  const updateGame = async () => {
    console.log("updating")
    contract.getPastEvents("gameUpdate", {filter: {address: myAddr}}, (err, events) => {
      const x = new BigNumber(events[0].returnValues.game);
      setGame(x.toString(2))
      console.log("updated")
    })
  }


  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="stylesheet" href='./index.css' />
      </Head>

      <main>
      <div className='buttonContainer'>
        <button className='importWalletButton' onClick={requestAccount}>
          <Image src="/metamask.png" width={30} height={30} />
        </button>
        <button className="importWalletButton" onClick={paste}>
          < BiPaste size={30} color="grey"/>
        </button>
        <input placeholder='Wallet'
          value={wallet}
          className="walletInput">
        </input>
        <button onClick={createGame} className="button">
            Create game
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
