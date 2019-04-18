const DrivingLicenseRenew = artifacts.require("DrivingLicenseRenew");

module.exports = function(deployer) {
  deployer.deploy(DrivingLicenseRenew);
};
