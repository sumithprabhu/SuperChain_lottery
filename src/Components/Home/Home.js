import React from "react";
import './Home.scss';
import { NavLink } from "react-router-dom";

const Home = ({ connectWallet, account }) => {
  return (
    <div>
    <nav className="app__navbar">
      <div className="app__navbar-title">
        <p>SUPERCHAIN LOTTERY</p>
      </div>
      <div>
        <NavLink to="/lottery">
      <button style={{marginRight: "0px"}} className="button1">
        Launch DAPP
      </button>
      </NavLink>
      {account === "" ? (
        <button id="connectWallet" className="button1" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <button className="button1">
          {`${account.substring(0, 4)}...${account.substring(
            38
          )}`}
        </button>
      )}
      </div>
    </nav>
    <div className="Home" id="home">
    <title>SUPERCHAIN LOTTERY</title>
    <hr className="hr"></hr>
    <p>Superfluid X Chainlink</p>
    <div>Create, Update and Delete Superfluid streams seemlessly and get alerted to your device with Push Notifications for every actions.</div>
    </div>
    </div>
  );
};

export default Home;
