const { ethers } = require("hardhat");
require("dotenv").config();

async function testHasRole() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const Dextian = await ethers.getContractFactory("DEXTIAN");
    const dextian = Dextian.attach(CONTRACT_ADDRESS);

    const [deployer] = await ethers.getSigners();
    console.log(`Using deployer account: ${deployer.address}`);

    const predicateRole = ethers.keccak256(ethers.toUtf8Bytes("PREDICATE_ROLE"));
    console.log(`Computed PREDICATE_ROLE: ${predicateRole}`);

    try {
        const hasRole = await dextian.hasRole(predicateRole, deployer.address);
        console.log(`Deployer has PREDICATE_ROLE: ${hasRole}`);
    } catch (error) {
        console.error("Error testing hasRole:", error);
    }
}

testHasRole()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Script failed:", error);
        process.exit(1);
    });
