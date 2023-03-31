import React, { useEffect, useState } from "react";
import "./Lottery.scss";

const Lottery = ({contract, account }) => {
  const [users, setUsers] = useState([]);
  const [usersn, setUsersn] = useState(1);
  const [inputText, setInputText] = useState(0);
  const [enable, setEnable] = useState(true);
  const [winner,setWinner] = useState("0x00000000000000000000")
  const [winnerNum,setWinnerNum] = useState("0")
  const [transactButtonMsg , setTransactButtonMsg] =useState("Purchase Lottery")
  const [enableClaim, setEnableClaim] = useState(true);
  const [paymentMsg,setPaymentMsg]= useState("")
  const [claimButtonMsg , setClaimButtonMsg] =useState("Claim")
  
  useEffect(() => {
    console.log("hello")
    fetchUserData();
    console.log(users)
  }, []);

  const fetchUserData = async () => {
   
    
    await fetch(
      "https://api-testnet.polygonscan.com/api?module=account&action=tokentx&contractaddress=0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f&address=0xCd9E5F2e53d74abBFd5d429F348c57E0d3062CF4&page=1&offset=5&sort=asc&apikey=VSQXD93C3MMJERVVZ5H6BB9NUN49VG9DI2"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setUsersn(data.result.length);
      });
     
  };

  function checkPayment() {
    const address = users.result[usersn - 1].from;
    const value = (users.result[usersn - 1].value)/(10**18);

    if ((account.toUpperCase() == (address.toUpperCase()))&&(value==100)) {
      //account.toUpperCase() == (address.toUpperCase())
      
      setEnable(false);
      setPaymentMsg("Payment verified , continue towards Purchasing lottery")
    } else {
      setPaymentMsg("Payment not yet verified , please try waiting for few seconds and retry.")
      console.log(value)
    }
  }

  const handleChange = (event) => {
    setInputText(event.target.value);
  };

  const result= async()=>{
    setWinner(await contract.winner());
    setWinnerNum(await contract.winnerNum());
    document.getElementById("winner").innerHTML= winner;
    document.getElementById("winnerNum").innerHTML= winnerNum;
    //console.log(winner)

    if ((account == winner)){
      setEnableClaim(false)
    }
    else(
      setEnableClaim(true)
    )
  }

  const purchaseLottery = async (e) => {
    setTransactButtonMsg("Purchase in Progress")
    try{
      let entry= await contract.enterLottery(account, inputText);

      await entry.wait();
      setTransactButtonMsg("Purchase Lottery")
    }
    catch (e) {
      setTransactButtonMsg("Lottery already purchased")
  };
}

const claimLottery = async (e) => {
  setClaimButtonMsg("Claiming...")
  try{
    let cl= await contract.claim(account);

    await cl.wait();
    setClaimButtonMsg("Claim")
  }
  catch (e) {
    setClaimButtonMsg("Claimed already")
};
}

  
  return (
    <div>
      <nav className="app__navbar">
      <div className="app__navbar-title">
        <p>SUPERCHAIN LOTTERY</p>
      </div>
      <div>
        <button className="button1">
          {`${account.substring(0, 4)}...${account.substring(
            38
          )}`}
        </button>
      
      </div>
    </nav>
    <div className="lottery">
      <div className="payment">
        <p className="payment-des">{paymentMsg}</p>
        <div className="checkPayment">
        <p className="checkPayment-des">Welcome to SUPERCHAIN LOTTERY ,inorder to purchase a lottery you first need to send 100 FDAIx which lottery ticket price to the contract address : 0xCd9E5F2e53d74abBFd5d429F348c57E0d3062CF4 , after successful transaction you press the check button inorder to check payment status</p>
        <button className="checkPayment-btn" onClick={checkPayment}>Check</button>
        </div>
        
      </div>
      <hr
        style={{
          background: 'black',
          color: 'black',
          borderColor: 'black',
          height: '0.5px',
          width:'1200px'
        }}
      />
      <div className="transact">
        <div><p className="transact-des">As the payment is successful, Now its time to choose you lottey number ,for now the numbers range from 1 to 3. Input the number as you wish and press the Purchase lottey button inorder to process your lottery.</p></div>
        <div className="transact-sec">
        <input className="transact-in" type="number" onChange={handleChange} placeholder="Enter Number" />
        <button className="transact-btn" id="btn" onClick={purchaseLottery} disabled={enable}>
          {transactButtonMsg}
        </button>
        </div>
      </div>
      <hr
        style={{
          background: 'black',
          color: 'black',
          borderColor: 'black',
          height: '0.5px',
          width:'1200px'
        }}
      />
      <div className="claim">
        <div className="refresh-sec">
          <p className="refresh-des">This section provides the result of the lottery and anyone who wins can claim his prize here. This function is called every 15 minutes with help of Chainlink Automation, it checks whether the lottery pool has 3 participants, if yes it provides the result. </p>
          <button className="refresh-btn" onClick={result}>Refresh</button>
        </div>
        <table className="claim-table">
          <tr>
            <th className="claim-c1">Winning number</th>
            <th className="claim-c1">Winning address</th>
            <th className="claim-c1"> Claim </th>
          </tr>
          <tr>
            <th><hr></hr></th>
            <th><hr></hr></th>
            <th><hr></hr></th>
          </tr>
          <tr>
            <td className="claim-c1" id="winnerNum">0</td>
            <td className="claim-c1" id="winner">0x00000000000000000000</td>
            <td className="claim-c1"><button onClick={claimLottery} disabled={enableClaim}>{claimButtonMsg}</button></td>
          </tr>
        </table>
      </div>
      </div>
    </div>
  );
};

export default Lottery;
