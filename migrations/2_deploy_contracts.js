const VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");
const AddressChange = artifacts.require("AddressChange");
const DrivingLicenseRenew = artifacts.require("DrivingLicenseRenew");
const PracticeExam = artifacts.require("PracticeExam");
const ReadLid = artifacts.require("ReadLid");
const VirtualRecord = artifacts.require("VirtualRecord");
const SellDonateCar = artifacts.require("SellDonateCar");

module.exports = function(deployer) {
  deployer.deploy(AddressChange);
  deployer.deploy(DrivingLicenseRenew);
  deployer.deploy(VehicleRegistrationRenewal);
  deployer.deploy(PracticeExam);
  deployer.deploy(ReadLid);
  deployer.deploy(VirtualRecord);
  deployer.deploy(SellDonateCar);
};
