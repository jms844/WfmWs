const idpTransfer = require('./idpTransfer3');
const rsList = require('./rs/rs');

async function main() {
  if (new Date().getHours() == 4) {
    for (let i = 0; i < rsList.length; i++) {
      await idpTransfer(rsList[i].SK, rsList[i].CODE, -5, 0);
    }
  } else if (new Date().getHours() == 5) {
    for (let i = 0; i < rsList.length; i++) {
      await idpTransfer(rsList[i].SK, rsList[i].CODE, 0, 10);
    }
  } else if (new Date().getHours() == 6) {
    for (let i = 0; i < rsList.length; i++) {
      await idpTransfer(rsList[i].SK, rsList[i].CODE, 10, 15);
    }
  } else {
    for (let i = 0; i < rsList.length; i++) {
      await idpTransfer(rsList[i].SK, rsList[i].CODE, 0, 0);
    }
  }
}

main();
