const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");
require("dotenv").config();

describe("DEXTN Staging Tests", function () {
    let deployer;
    let dextian;
    let predicateRole;
    console.log("Running beforeEach...");
    beforeEach(async () => {
        try {
            // Fetch the deployer's address and balance
            deployer = (await getNamedAccounts()).deployer;
            const balance = await ethers.provider.getBalance(deployer);
            console.log("Deployer Address:", deployer);
            console.log("Deployer Balance:", ethers.formatUnits(balance), "ETH");
    
            // Check if the balance is sufficient
            if (balance < ethers.parseEther("0.01")) { // Compare BigInt directly
                throw new Error(
                    "Deployer does not have enough funds for deployment."
                );
            }
    
            // Deploy the contract using the fixture
            await deployments.fixture(["all"]);
            dextian = await ethers.getContractAt("DEXTN", deployer);
    
            // Compute the PREDICATE_ROLE hash
            predicateRole = ethers.keccak256(ethers.toUtf8Bytes("PREDICATE_ROLE"));
        } catch (error) {
            console.error("Error in beforeEach:", error);
            throw error;
        }
    });
    
    

    it("should deploy successfully with correct name and symbol", async () => {
        const name = await dextian.name();
        const symbol = await dextian.symbol();
        const decimals = await dextian.decimals();

        expect(name).to.equal("DEXTN Token");
        expect(symbol).to.equal("DEXTN");
        expect(decimals).to.equal(6); // As defined in the constructor
    });

    it("should grant PREDICATE_ROLE to the correct address", async () => {
        const hasPredicateRole = await dextian.hasRole(
            predicateRole,
            "0x694AA1769357215DE4FAC081bf1f309aDC325306"
            
        );
        expect(hasPredicateRole).to.be.true;
    });

    it("should allow minting tokens by PREDICATE_ROLE", async () => {
        const mintAmount = ethers.parseUnits("1000", 6); // 1000 DEXTN tokens
        const user = (await ethers.getSigners())[1].address;

        // Grant PREDICATE_ROLE to the deployer for testing purposes
        await dextian.grantRole(predicateRole, deployer);

        // Mint tokens to a user
        await dextian.mint(user, mintAmount);

        const userBalance = await dextian.balanceOf(user);
        expect(userBalance.toString()).to.equal(mintAmount.toString());
    });

    it("should restrict minting tokens to accounts without PREDICATE_ROLE", async () => {
        const mintAmount = ethers.parseUnits("1000", 6); // 1000 DEXTN tokens
        const user = (await ethers.getSigners())[1].address;

        // Try minting without granting PREDICATE_ROLE
        await expect(dextian.mint(user, mintAmount)).to.be.revertedWith(
            "DEXTN: INSUFFICIENT_PERMISSIONS"
        );
    });
});