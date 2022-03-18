//import web3Utils from "web3-utils";

const VestingVault = artifacts.require("VestingVault");
const ERC20 = artifacts.require("ERC20");
const utils = require("./helpers/utils");
const time = require("./helpers/test-helper");
//import { currentBlockTime, forwardTime, expectEvent, checkErrorRevert } from "./helpers/test-helper";


contract("VestingVault", (accounts) => {

    //const SECONDS_PER_MONTH = 2628000;
    //const SECONDS_PER_DAY = 86400;

    let [alice, bob, carol] = accounts;
    let contractInstance;
    let tokenInstance;
    let mintAmount;


context("No time constraint test list:", async () => {

    beforeEach(async () => {
        tokenInstance = await ERC20.new("Token", "TKN");
        //notVestabletoken = await ERC20.new("NotToken", "NTKN");
        contractInstance = await VestingVault.new(tokenInstance.address);
        mintAmount = 10000;
        await tokenInstance.mintToOwner(mintAmount, {from: alice});

    })

    it("Is alice the contract owner?", async () => {
        const tokenOwner = await contractInstance.owner();
        assert.equal(tokenOwner, alice);
    })
    
    it("Should assert that only owner can mint.", async () => {
        await utils.shouldThrow(tokenInstance.mintToOwner(mintAmount, {from: bob}));
    })

    it("Testing minting function (test flow only).", async () => {
               const aliceBalance = await tokenInstance.balanceOf(alice);
        assert.equal(aliceBalance.toString(), mintAmount.toString());
    })

    it("Should fail to create a new grant if contract is not approved.", async () =>{
        await utils.shouldThrow(contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice}));
    })

    it("Should create a new grant.", async () => {
        await tokenInstance.approve(contractInstance.address, mintAmount, {from: alice});
        await contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice});
        const grantAmount = await contractInstance.getGrantAmount(bob);
        assert.equal(grantAmount.toString(), mintAmount.toString());
    })

    it("Should assert non-grantees can't claim.", async () => {
        await tokenInstance.approve(contractInstance.address, mintAmount, {from: alice});
        await contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice});
        await utils.shouldThrow(
            contractInstance.claimVestedTokens(), {from: alice}
            || contractInstance.claimVestedTokens(), {from: carol});
    })

    it("Trying to add a new grant while grantee has another active should result in error.", async () => {
        await tokenInstance.approve(contractInstance.address, mintAmount, {from: alice});
        await contractInstance.addTokenGrant(bob, mintAmount/2, 2, 1, {from: alice});
        await utils.shouldThrow(
            contractInstance.addTokenGrant(bob, mintAmount/2, 2, 1, {from: alice})
            );
    })
})

context("Time constrained test list:", async () => {

    beforeEach(async () => {
        tokenInstance = await ERC20.new("Token", "TKN");
        //notVestabletoken = await ERC20.new("NotToken", "NTKN");
        contractInstance = await VestingVault.new(tokenInstance.address);
        mintAmount = 10000;
        await tokenInstance.mintToOwner(mintAmount, {from: alice});

    })

    it("If grant revoked, outstanding unclaimed balance should go to grantee and the rest should go to Vesting authority.", async () => {
        await tokenInstance.approve(contractInstance.address, mintAmount, {from: alice});
        await contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice});
        
        await time.increase(time.duration.days(1));

        await contractInstance.revokeTokenGrant(bob, {from: alice});

        const returnedAmount = await tokenInstance.balanceOf(bob);
        const grantedAmount = await tokenInstance.balanceOf(alice);

        assert.equal(returnedAmount.toString(), grantedAmount.toString());

    })

    xit("Time & Grant amount calculus.", async () => {
        await tokenInstance.approve(contractInstance.address, mintAmount, {from: alice});
        await contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice});
        
        await time.increase(time.duration.days(1.5));

        const data = await contractInstance.calculateGrantClaim(bob, {from: alice});
        
        const daysVested = data[0].toString();
        const amountVested = data[1].toString();
        console.log(`${daysVested} & ${amountVested}`);

        await utils.shouldThrow(
            contractInstance.addTokenGrant(bob, mintAmount, 2, 1, {from: alice})
            );

    })

})

})
