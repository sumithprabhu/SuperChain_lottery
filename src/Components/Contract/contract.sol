// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import {IInstantDistributionAgreementV1} from "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {SuperTokenV1Library} from "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {ISuperfluid, ISuperToken} from "https://github.com/superfluid-finance/protocol-monorepo/blob/dev/packages/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract lottery is VRFConsumerBase{
    address[] public entries = new address[](3);
    uint[3] public numberStatus=[0,0,0];
    uint public entryCount=0;
    uint public winnerNum=0;
    address public winner=address(0x0);
    address public owner;
    bytes32 internal keyHash; // identifies which Chainlink oracle to use
    uint internal fee;        // fee to get random number
    uint public randomResult;
   ISuperToken public spreaderToken; /// @notice Super token to be distributed.
    using SuperTokenV1Library for ISuperToken;/// @notice SuperToken Library
    uint32 public constant INDEX_ID = 0;/// @notice Index ID. Never changes.

 constructor(ISuperToken _spreaderToken) 
        
    
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK token address
        ) {
            keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
            fee = 0.0001 * 10 ** 18;    // 0.1 LINK

            owner = msg.sender;
            spreaderToken = _spreaderToken;
        _spreaderToken.createIndex(INDEX_ID);
        }
 

    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in contract");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint randomness) internal override {
        randomResult = randomness;
        
    }
    function enterLottery  (address entryadd, uint entrynum)public{
        require(numberStatus[entrynum-1]==0,"lottery already present");
        entries[entrynum-1]=entryadd;
        numberStatus[entrynum-1]=1;
        entryCount+=1;

       if(entryCount==3){
           getRandomNumber();
       }
    }

    function ChainlinkAutomate() public {
        if(entryCount==3){
           declareResult();
       }
    }

    

    function claim(address subscriber) public {
        spreaderToken.claim(address(this), INDEX_ID, subscriber);
    }

    function distribute() public {
        uint256 spreaderTokenBalance = spreaderToken.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = spreaderToken
            .calculateDistribution(
                address(this),
                INDEX_ID,
                spreaderTokenBalance
            );

        spreaderToken.distribute(INDEX_ID, actualDistributionAmount);
    }

    function appr() public {
        spreaderToken.approveSubscription(address(this), INDEX_ID);
    }

    function gainShare(address subscriber) public {
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = spreaderToken.getSubscription(
            address(this),
            INDEX_ID,
            subscriber
        );

        // Update to current amount + 1
        spreaderToken.updateSubscriptionUnits(
            INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld + 1)
        );
        appr();
    }
    function declareResult() public {
        winnerNum = (randomResult % 3)+1;
        winner = entries[winnerNum-1];
        gainShare(winner);
        distribute();
        entryCount=0;
        entries= new address[](3);
        numberStatus=[0,0,0];

    }

    
}