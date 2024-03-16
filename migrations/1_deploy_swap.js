const Swap = artifacts.require("Swap");

module.exports = function (deployer) {
  deployer.deploy(Swap);
};
