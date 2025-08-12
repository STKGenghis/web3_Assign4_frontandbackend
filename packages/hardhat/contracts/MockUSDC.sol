// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @dev A mock USDC token for testing purposes
 */
contract MockUSDC is ERC20 {
    uint8 private _decimals;

    /**
     * @dev Constructor that initializes the token with name, symbol and decimals
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals_ The number of decimals for the token
     */
    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        _decimals = decimals_;
        // Mint 1,000,000 tokens to the deployer
        _mint(msg.sender, 1_000_000 * 10**decimals_);
    }

    /**
     * @dev Override the decimals function to return the custom decimals
     */
    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Function to mint tokens to an address (for testing)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
