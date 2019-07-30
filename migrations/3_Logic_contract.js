const Logic = artifacts.require("Logic");
const fs = require('fs');

module.exports = function(deployer) {
    deployer.deploy(Logic)
    .then(() => {
        if (Logic._json) {
            fs.writeFile('LogicABI', JSON.stringify(Logic._json.abi),
                (err) => {
                    if (err) throw err;
                    console.log("파일에 ABI 입력 성공");
                }
            )
            fs.writeFile('LogicAddress', Logic.address,
                (err) => {
                    if (err) throw err;
                    console.log("파일에 주소 입력 성공");
                }
            )
        }
    });
};
