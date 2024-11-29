const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const myAddress = process.env.MY_ADDRESS; // Address for PREDICATE_ROLE
    const tokenName = process.env.TOKEN_NAME;
    const tokenSymbole = process.env.TOKEN_SYMBOLE;
    
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!myAddress) {
        throw new Error(
            "Environment variable MY_ADDRESS is missing. Ensure it is defined in your .env file."
        );
    }

    console.log(`Deploying DEXTIAN with PREDICATE_ROLE assigned to ${myAddress}`);

    try {
        // Deploy the DEXTIAN contract with the predicate address
        const dextian = await deploy(tokenSymbole, {
            from: deployer,
            args: [tokenName, tokenSymbole, myAddress], // Pass the predicate address dynamically
            log: true,
        });

        console.log(`${tokenSymbole} deployed at ${dextian.address}`);
        console.log(
            `Verify the contract using: npx hardhat verify --network <network> ${dextian.address} ${tokenName} ${tokenSymbole} ${myAddress}`
        );
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};

module.exports.tags = ["all", "dextian"];
