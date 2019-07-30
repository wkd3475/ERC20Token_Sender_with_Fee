const ProxyStorage = artifacts.require("ProxyStorage");
const fs = require('fs');
const logicAddress = fs.readFileSync('../logicAddress', 'utf8').replace(/\n|\r/g, "");

module.exports = function(deployer) {
    deployer.deploy(ProxyStorage, logicAddress)
    .then(() => {
        if (ProxyStorage._json) {
            fs.writeFile('proxyStorageABI', JSON.stringify(ProxyStorage._json.abi),
                (err) => {
                    if (err) throw err;
                    console.log("파일에 ABI 입력 성공");
                }
            )
            fs.writeFile('proxyStorageAddress', ProxyStorage.address,
                (err) => {
                    if (err) throw err;
                    console.log("파일에 주소 입력 성공");
                }
            )
        }
    });
};