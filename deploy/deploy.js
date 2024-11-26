const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const myAddress = process.env.MY_ADDRESS; 
    const tokenName = process.env.TOKEN_NAME;
    const tokenSymbol = process.env.TOKEN_SYMBOL;

    let minSupply, maxSupply;

    try {
        minSupply = ethers.parseUnits(process.env.MIN_SUPPLY, 6); 
        maxSupply = ethers.parseUnits(process.env.MAX_SUPPLY, 6);
    } catch (err) {
        throw new Error("Failed to parse MIN_SUPPLY or MAX_SUPPLY. Ensure they are valid numbers in the .env file.");
    }

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!myAddress || !tokenName || !tokenSymbol || !minSupply || !maxSupply) {
        throw new Error(
            "Environment variables MY_ADDRESS, TOKEN_NAME, TOKEN_SYMBOL, MIN_SUPPLY, or MAX_SUPPLY are missing. Ensure they are defined in your .env file."
        );
    }

    if (minSupply>maxSupply) {
        throw new Error("MIN_SUPPLY cannot be greater than MAX_SUPPLY.");
    }

    console.log(`Deploying DEXTN with PREDICATE_ROLE assigned to ${myAddress}`);
    console.log(`Token Name: ${tokenName}, Token Symbol: ${tokenSymbol}`);
    console.log(`Initial Supply: ${ethers.formatUnits(minSupply, 6)}, Max Supply: ${ethers.formatUnits(maxSupply, 6)}`);

    try {
        const tadex = await deploy(tokenSymbol, {
            from: deployer,
            args: [tokenName, tokenSymbol, myAddress, minSupply, maxSupply],
            log: true,
        });

        console.log(`${tokenSymbol} deployed at ${tadex.address}`);
        console.log(
            `Verify the contract using: npx hardhat verify --network <network> ${tadex.address} ${tokenName} ${tokenSymbol} ${myAddress} ${minSupply.toString()} ${maxSupply.toString()}`
        );
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};

module.exports.tags = ["all", "tadex"];
