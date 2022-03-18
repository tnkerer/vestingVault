const ERC20 = artifacts.require("ERC20");
const VestingVault = artifacts.require("VestingVault");

module.exports = function (deployer) {
  deployer
  .deploy(ERC20, "Token", "TKN")
  .then(() => deployer.deploy(VestingVault, ERC20.address));  
};