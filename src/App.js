import "./App.css";

import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import Lottery from "./Components/Lottery/Lottery";
import Home from "./Components/Home/Home";
import { providers, Contract } from "ethers";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { example } from "./Components/Contract/contract_abi.js";

const App = () => {
  console.log(process.env.REACT_APP_WALLET_ADD);
  const [currentAccount, setCurrentAccount] = useState("");
  const [wallet, setWallet] = useState("Please Connect Your Wallet to Proceed");
  const [contract, setContract] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const CONTRACT_ADDRESS = "0xCd9E5F2e53d74abBFd5d429F348c57E0d3062CF4";

  useEffect(() => {
    //console.log(contract.winner())
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      console.log(currentAccount);
      connectWallet();
    }
  }, [walletConnected]);
  const checkIfWalletIsConnected = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to shardeum");
      throw new Error("Change network to shardeum");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await checkIfWalletIsConnected();
      setWalletConnected(true);
      setWallet("Wallet connected");

      const signer = await checkIfWalletIsConnected(true);
      setCurrentAccount(await signer.getAddress());
      const NContract = new Contract(CONTRACT_ADDRESS, example, signer);
      setContract(NContract);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Lottery contract={contract} account={currentAccount} />

    // <div>
    //   <div>
    //     <div className="connectWalletContainer">
    //       {wallet === "Please Connect Your Wallet to Proceed" && (
    //         <button onClick={connectWallet} className="connectWalletBtn">
    //           <img
    //             src={
    //               "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png"
    //             }
    //             className="img"
    //             alt="metamask"
    //           />{" "}
    //           {wallet}
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default App;
