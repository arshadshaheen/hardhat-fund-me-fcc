const { ethers } = require("hardhat");
require("dotenv").config();

    

async function main() {

    const CONTRACT_ADDRESS = process.env.DEPLOYER_ADDRESS; // Address for deployed contract
    const Dextian = await ethers.getContractFactory("DEXTIAN");
    const dextian = Dextian.attach(CONTRACT_ADDRESS);

    const predicateRole = ethers.keccak256(ethers.toUtf8Bytes("PREDICATE_ROLE"));

    const newAddress = '0xb04bE890CF4274e3F195ff9D1415c003dA08d095'; //process.env.CONTRACT_ADDRESS; // Address for deployed contract
    const tx = await dextian.grantRole(predicateRole, newAddress);
    await tx.wait();

    console.log(`PREDICATE_ROLE granted to ${newAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
