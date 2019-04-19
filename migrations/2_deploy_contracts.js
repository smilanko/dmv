const VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");
const AddressChange = artifacts.require("AddressChange");
const DrivingLicenseRenew = artifacts.require("DrivingLicenseRenew");
const PracticeExam = artifacts.require("PracticeExam");

module.exports = function(deployer) {
  deployer.deploy(AddressChange);
  deployer.deploy(DrivingLicenseRenew);
  deployer.deploy(VehicleRegistrationRenewal);
  deployer.deploy(PracticeExam);
};
