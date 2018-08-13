const wfmDataConnection = require("../db/WfmData");
const sql = require("mssql");

const vendorQuery = "Select * from dimVendor";
const oneVendorQuery = "Select * from vDimVendor Where vendorID = @vendorID";
const addVendorQuery =
  "Insert into dimVendor(vendorName,vendorAbbr,vendorImage) Values(@vendorName,@vendorAbbr,@vendorImage)";
const updateVendorQuery =
  "Update dimVendor Set vendorName = @vendorName, vendorAbbr = @vendorAbbr, vendorImage = @vendorImage Where vendorID = @vendorID";
const deleteVendorQuery = "Delete from dimVendor Where vendorID = @vendorID";

var getVendors = async function(callback) {
  const pool = await wfmDataConnection.wfmDataPromise;
  pool.request().query(vendorQuery, (err, result) => {
    if (err) {
      console.log("Error pulling Vendors");
      throw err;
    }
    callback(result.recordset);
  });
};

var getVendor = async function(vendorID, callback) {
  const pool = await wfmDataConnection.wfmDataPromise;
  pool
    .request()
    .input("vendorID", sql.TinyInt, vendorID)
    .query(oneVendorQuery, (err, result) => {
      if (err) throw err;
      callback(result.recordset[0]);
    });
};

var addVendor = async function(vendor, callback) {
  const pool = await wfmDataConnection.wfmDataPromise;
  pool
    .request()
    .input("vendorName", vendor.vendorName)
    .input("vendorAbbr", vendor.vendorAbbr)
    .input("vendorImage", vendor.vendorImage)
    .query(addVendorQuery, (err, result) => {
      if (err) throw err;
      callback(vendor);
    });
};

var updateVendor = async function(vendor, callback) {
  const pool = await wfmDataConnection.wfmDataPromise;
  pool
    .request()
    .input("vendorName", vendor.vendorName)
    .input("vendorAbbr", vendor.vendorAbbr)
    .input("vendorImage", vendor.vendorImage)
    .input("vendorID", vendor.vendorID)
    .query(updateVendorQuery, (err, result) => {
      if (err) throw err;
      callback(vendor);
    });
};

var deleteVendor = async function(vendorID, callback) {
  const pool = await wfmDataConnection.wfmDataPromise;
  pool
    .request()
    .input("vendorID", vendorID)
    .query(deleteVendorQuery, (err, result) => {
      if (err) throw err;
      callback(null);
    });
};
module.exports = {
  getVendors,
  getVendor,
  addVendor,
  updateVendor,
  deleteVendor
};
