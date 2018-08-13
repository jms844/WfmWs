const wfmDataConnection = require('../db/WfmData');

const serviceQuery = 'Select * from vDimService';
const oneServiceQuery = 'Select * from vDimService Where serviceID = @serviceID';
const addServiceQuery = 'Insert into dimService(serviceName,serviceAbbr,serviceImage) Values(@serviceName,@serviceAbbr,@serviceImage)';
const updateServiceQuery = 'Update dimService Set serviceName = @serviceName, serviceAbbr = @serviceAbbr, serviceImage = @serviceImage Where serviceID = @serviceID';
const deleteServiceQuery = 'Delete from dimService Where serviceID = @serviceID';

var getServices = async function (callback) {
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .query(serviceQuery, (err, result) => {
            if (err) {
                console.log('Error pulling services');
                throw err;
            }
            callback(result.recordset);
        });
}

var getService = async function (sID, callback) {
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('serviceID', sID)
        .query(oneServiceQuery, (err, result) => {
            if (err) {
                console.log('Error pulling one service');
                throw err
            }
            callback(result.recordset[0]);
        });
}

var addService = async function (service, callback) {
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('serviceName', service.serviceName)
        .input('serviceAbbr', service.serviceAbbr)
        .input('serviceImage', service.serviceImage)
        .query(addServiceQuery, (err, result) => {
            if (err) {
                console.log('Error in adding service: ' + service);
                throw err;
            }
            callback(service);
        });
}

var updateService = async function (service, callback) {
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('serviceName', service.serviceName)
        .input('serviceAbbr', service.serviceAbbr)
        .input('serviceImage', service.serviceImage)
        .input('serviceID', service.serviceID)
        .query(updateServiceQuery, (err, result) => {
            if (err) {
                console.log('Error in updating service: ' + service);
                throw err;
            }
            callback(service);
        });
}

var deleteService = async function (sID, callback) {
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('serviceID', sID)
        .query(deleteServiceQuery, (err, result) => {
            if (err) {
                console.log('Error pulling one service');
                throw err
            }
            callback(null);
        });
}

var closeConnection = async function () {
    wfmDataConnection.closeConnection();
}

module.exports = {
    getServices, addService, getService, closeConnection, updateService, deleteService
}