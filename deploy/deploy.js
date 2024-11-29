const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const myAddress = process.env.MY_ADDRESS; 
    const predicateAddress = process.env.CONTRACT_ADDRESS; 
    const tokenName = process.env.TOKEN_NAME;
    const tokenSymbol = process.env.TOKEN_SYMBOL;
    const initialSupply = ethers.parseUnits(process.env.INITIAL_SUPPLY, 6); 
    const maxSupply = ethers.parseUnits(process.env.MAX_SUPPLY, 6);

    console.log("Initial and max supplyies", initialSupply, maxSupply);
    
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!myAddress || !predicateAddress || !tokenName || !tokenSymbol || !initialSupply || !maxSupply) {
        throw new Error(
            "Environment variables MY_ADDRESS, TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY, or MAX_SUPPLY are missing. Ensure they are defined in your .env file."
        );
    }

    if (initialSupply>maxSupply) {
        throw new Error("INITIAL_SUPPLY cannot be greater than MAX_SUPPLY.");
    }

    console.log(`Deploying DEXTN with PREDICATE_ROLE assigned to ${predicateAddress}`);
    console.log(`Token Name: ${tokenName}, Token Symbol: ${tokenSymbol}`);
    console.log(`Initial Supply: ${ethers.formatUnits(initialSupply, 6)}, Max Supply: ${ethers.formatUnits(maxSupply, 6)}`);
    
    try {
        const dextian = await deploy(tokenSymbol, {
            from: deployer,
            args: [tokenName, tokenSymbol, predicateAddress, initialSupply, maxSupply],
            log: true,
        });

        console.log(`${tokenSymbol} deployed at ${dextian.address}`);
        console.log(
            `Verify the contract using: npx hardhat verify --network <network> ${dextian.address} ${tokenName} ${tokenSymbol} ${myAddress} ${initialSupply.toString()} ${maxSupply.toString()}`
        );
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};

module.exports.tags = ["all", "dextian"];
