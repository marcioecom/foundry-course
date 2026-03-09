// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title A sample Raffle contract
 * @author Márcio Júnior
 * @notice This contract if for creating a sample raffle.
 * @dev implements Chainlink VRFv2.5
 */
contract Raffle {
    /* Errors */
    error Raffle__SendMoreToEnterRaffle();

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    /* Events */
    event RaffleEntered(address indexed player);

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        // require(msg.value >= i_entranceFee, "Not enough ETH sent!");
        // require(msg.value >= i_entranceFee, SendMoreToEnterRaffle());
        if (msg.value < i_entranceFee) revert Raffle__SendMoreToEnterRaffle();

        s_players.push(payable(msg.sender));
        emit RaffleEntered(msg.sender);
    }

    function pickWinner() public {}

    /**
     * Getter functions
     */
    function getEntranceFee() external view returns (uint256) {
        return i_entranceFee;
    }
}

