const { ethers } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const initialHolderAddress = process.env.MY_ADDRESS;
    const predicateRoleAddress = process.env.MY_ADDRESS; // Address for PREDICATE_ROLE
    const tokenName = process.env.TOKEN_NAME || "DEXTIAN Token";
    const tokenSymbol = process.env.TOKEN_SYMBOLE || "DEXTIAN";
    const maxSupply = ethers.parseUnits(process.env.MAX_SUPPLY || "1000000", 6); // Default to 1,000,000 tokens
    const initialSupply = ethers.parseUnits(process.env.INITIAL_SUPPLY || "500000", 6); // Default to 500,000 tokens

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!initialHolderAddress || !predicateRoleAddress) {
        throw new Error("Environment variables MY_ADDRESS or CONTRACT_ADDRESS are missing.");
    }

    console.log(`Deploying ${tokenName} (${tokenSymbol}) with PREDICATE_ROLE assigned to ${predicateRoleAddress}`);

    try {
        // Deploy the DEXTIAN contract with the specified parameters
        const dextian = await deploy("DEXTIAN", {
            from: deployer,
            args: [tokenName, tokenSymbol, predicateRoleAddress, maxSupply, initialHolderAddress, initialSupply],
            log: true,
        });

        console.log(`${tokenSymbol} deployed at ${dextian.address}`);
        console.log(
            `Verify the contract using: npx hardhat verify --network <network> ${dextian.address} "${tokenName}" "${tokenSymbol}" "${predicateRoleAddress}" "${maxSupply}" "${initialHolderAddress}" "${initialSupply}"`
        );
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};

module.exports.tags = ["all", "dextian"];
