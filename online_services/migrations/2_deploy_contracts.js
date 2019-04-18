const VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");

module.exports = function(deployer) {
  deployer.deploy(VehicleRegistrationRenewal);
};
