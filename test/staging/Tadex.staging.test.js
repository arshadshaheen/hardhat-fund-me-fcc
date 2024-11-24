const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");

describe("TADEX Staging Tests", function () {
    let deployer;
    let tadex;
    let predicateRole;
    console.log("Running beforeEach...");
    beforeEach(async () => {
        try {

            // Fetch accounts and deploy contract
            deployer = (await getNamedAccounts()).deployer;
            const balance = await ethers.provider.getBalance(deployer);
            console.log(`Deployer Balance: ${ethers.utils.formatEther(balance)} ETH`);
        
            if (balance.lt(ethers.utils.parseEther("0.01"))) {
                throw new Error(
                    "Deployer does not have enough funds for deployment."
                );
            }

            // Deploy the contract using the fixture
            await deployments.fixture(["all"]);
            console.log("Deployer:", deployer);

            // Get the deployed TADEX contract
            tadex = await ethers.getContract("TADEX", deployer);
            console.log("TADEX contract fetched:", tadex.address);

            // Compute the PREDICATE_ROLE hash
            predicateRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PREDICATE_ROLE"));
            console.log("Running afterforeEach...");
        } catch (error) {
            console.error("Error in beforeEach:", error);
            throw error;
        }
    });

    it("should deploy successfully with correct name and symbol", async () => {
        const name = await tadex.name();
        const symbol = await tadex.symbol();
        const decimals = await tadex.decimals();

        expect(name).to.equal("TADEX Token");
        expect(symbol).to.equal("TADEX");
        expect(decimals).to.equal(6); // As defined in the constructor
    });

    it("should grant PREDICATE_ROLE to the correct address", async () => {
        const hasPredicateRole = await tadex.hasRole(
            predicateRole,
            "0x9277a463A508F45115FdEaf22FfeDA1B16352433"
            // 0x053e6D2ab9904f02e268D8E00F7f32d3EA1a60d0
        );
        expect(hasPredicateRole).to.be.true;
    });

    it("should allow minting tokens by PREDICATE_ROLE", async () => {
        const mintAmount = ethers.utils.parseUnits("1000", 6); // 1000 TADEX tokens
        const user = (await ethers.getSigners())[1].address;

        // Grant PREDICATE_ROLE to the deployer for testing purposes
        await tadex.grantRole(predicateRole, deployer);

        // Mint tokens to a user
        await tadex.mint(user, mintAmount);

        const userBalance = await tadex.balanceOf(user);
        expect(userBalance.toString()).to.equal(mintAmount.toString());
    });

    it("should restrict minting tokens to accounts without PREDICATE_ROLE", async () => {
        const mintAmount = ethers.utils.parseUnits("1000", 6); // 1000 TADEX tokens
        const user = (await ethers.getSigners())[1].address;

        // Try minting without granting PREDICATE_ROLE
        await expect(tadex.mint(user, mintAmount)).to.be.revertedWith(
            "TADEX: INSUFFICIENT_PERMISSIONS"
        );
    });
});