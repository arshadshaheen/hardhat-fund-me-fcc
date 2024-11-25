const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const tadex = await ethers.getContract("TADEX");

    const adminRole = ethers.constants.HashZero; // DEFAULT_ADMIN_ROLE is bytes32(0)
    const hasAdminRole = await tadex.hasRole(adminRole, deployer.address);

    if (!hasAdminRole) {
        console.log(`Granting DEFAULT_ADMIN_ROLE to deployer: ${deployer.address}`);
        const tx = await tadex.grantRole(adminRole, deployer.address);
        await tx.wait();
        console.log("DEFAULT_ADMIN_ROLE granted successfully.");
    } else {
        console.log("Deployer already has DEFAULT_ADMIN_ROLE.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});