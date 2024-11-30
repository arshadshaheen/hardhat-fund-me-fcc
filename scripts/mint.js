const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const recipientAddress = process.env.MY_ADDRESS;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // Address for deployed contract

    const mintAmount = ethers.parseUnits(process.env.MINT_SUPPLYU || "500000", 6); // Default to 500,000 tokens

    // Get signer
    const [deployer] = await ethers.getSigners();
    console.log(`Using deployer account: ${deployer.address}`);

    // Attach to the deployed contract
    const Dextian = await ethers.getContractFactory("DEXTIAN");
    const dextian = Dextian.attach(CONTRACT_ADDRESS);

    // Log the computed PREDICATE_ROLE
    const predicateRole = ethers.keccak256(ethers.toUtf8Bytes("PREDICATE_ROLE"));
    console.log(`Computed PREDICATE_ROLE: ${predicateRole}`);

    // Check if deployer has the required PREDICATE_ROLE
    try {
        const hasRole = await dextian.hasRole(predicateRole, deployer.address);
        console.log(`Deployer has PREDICATE_ROLE: ${hasRole}`);
        if (!hasRole) {
            throw new Error(`Deployer does not have PREDICATE_ROLE. Minting not authorized.`);
        }
    } catch (error) {
        console.error(`Error checking PREDICATE_ROLE: ${error.message}`);
        throw error;
    }

    // Mint tokens
    console.log(`Minting ${mintAmount.toString()} tokens to ${recipientAddress}...`);
    const tx = await dextian.mint(recipientAddress, mintAmount);
    console.log("Transaction submitted. Hash:", tx.hash);

    // Wait for confirmation
    await tx.wait();
    console.log(`Minting successful. Transaction hash: ${tx.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error occurred during minting:", error);
        process.exit(1);
    });
