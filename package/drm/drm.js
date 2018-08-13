const massive = require('massive');
// const wfmDataConnection = require('../../db/WfmData');
const drmConfig = require('../../config/drm');

//let dbPromise = massive(drmConfig);
/*massive(drmConfig).then(db => {
    db.query('Select * from drm_call_log Where id = 3000005437150').then(logs => {
        console.log(logs);
        let time_stamp = logs[0].time_stamp;
        console.log(new Date(time_stamp).toLocaleDateString());
        console.log(new Date(time_stamp).toLocaleTimeString());
        process.exit(0);
    });
});*/

function getData(query, params, callback) {
    massive(drmConfig).then(db => {
        db.query(query, params).then(result => {
            console.log(result.length);
            callback(result);
        })
    })
}

let query = 'Select * from drm_call_log Where time_drm_received >= ${startDate} and time_drm_received < ${stopDate} Limit 10';
let params = {
    startDate: '7/22/2018',
    stopDate: '7/23/2018'
}
function myCallback() {
    process.exit(0);
}

getData(query, params, myCallback);

