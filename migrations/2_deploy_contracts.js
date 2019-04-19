const VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");
const AddressChange = artifacts.require("AddressChange");
const DrivingLicenseRenew = artifacts.require("DrivingLicenseRenew");

module.exports = function(deployer) {
  deployer.deploy(AddressChange);
  deployer.deploy(DrivingLicenseRenew);
  deployer.deploy(VehicleRegistrationRenewal);
};
