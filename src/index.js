import {Spinner} from "spin.js";

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'));

const UNIT = 10**18;
const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

const App = {
    auth: {
        address1: "0x38891757767eac632c3e0fa677be83864eccf0f4",
        privateKey1: "0x7196202659f34291de2b3d5d543efcd67bf13c5d84a3e5e502cb3cb76efdddf1",
        address2: "0xe26107f8d514d85ee1481e74b0c3088bcb09bf33",
        privateKey2: "0x68ae5efa936f27cecb8a349f6c297b5728bb41cfb46b4cf5b0301d4def653142",
        address3: "0xabf315621e3771eba757cf6d1b39ead975af2ddc",
        privateKey3: "0xac9234fe2347e8a7e063d478a52657c4f202c681e0f18988ff336782e1eff488"
    },

    start: async function () {
        $('#token-total').text('total supply : ' + await this.getTotalSupply());
        $('#token-address').text(TOKEN_ADDRESS);
        $('#account1-ether').text(await web3.eth.getBalance(this.auth.address1) + " wei");
        $('#account2-ether').text(await web3.eth.getBalance(this.auth.address2) + " wei");
        $('#account3-ether').text(await web3.eth.getBalance(this.auth.address3) + " wei");
        $('#account1').text(this.auth.address1);
        $('#account2').text(this.auth.address2);
        $('#account3').text(this.auth.address3);
    },

    changeAccount: async function (element) {
        let walletAddress = $(element).text();
        $('#setted-account').text(walletAddress);
        $('#setted-account-token-balance').text(await this.getTokenBalance(walletAddress));
    },

    getTokenBalance: async function (walletAddress) {
        return await tokenContract.methods.balanceOf(walletAddress).call();
    },

    getAccount: function (walletAddress) {
        $('#setted-account').text(walletAddress);
    },

    showTokenSendBox: async function () {
        if ($('#send-box').is(':visible')) {
            $('#send-box').hide();
        } else {
            $('#send-box').show()
        }
    },

    showFeeSendBox: async function () {
        if ($('#fee-send-box').is(':visible')) {
            $('#fee-send-box').hide();
        } else {
            $('#fee-send-box').show()
        }
    },

    showERC20SendBox: async function () {
        if ($('#erc20-send-box').is(':visible')) {
            $('#erc20-send-box').hide();
        } else {
            $('#erc20-send-box').show()
        }
    },

    getTotalSupply: async function () {
        return await tokenContract.methods.totalSupply().call();
    },

    tokenTransfer: async function (element) {
        const walletAddress = $(element).text();
        if (walletAddress) {
            let amount = BigInt(parseFloat($('#token-amount').val()) * UNIT).toString(10);
            let recipient = $('#recipient').val().toString();
            let tokenAddress = $('#free-send-token-address').val().toString();
            if (amount && recipient) {
                var spinner = this.showSpinner();
                try {
                    await this.approve(walletAddress, PROXY_ADDRESS, amount);
                    await this.freeSend(walletAddress, tokenAddress, recipient, amount);
                } catch(e) {
                    console.log('Transfer error: ', e);
                }
                spinner.stop();
                location.reload();
            } else {
                alert("wrong input");
            }
        }
        $('#send-box').hide();
    },

    freeSend: async function (walletAddress, tokenAddress, recipient, amount) {
        await web3.eth.sendTransaction({
            from: walletAddress,
            to: PROXY_ADDRESS,
            gas: 250000,
            data: web3.eth.abi.encodeFunctionCall({
                name: 'feeFreeSend',
                type: 'function',
                inputs: [{
                    type: 'address',
                    name: 'tokenAddress'
                }, {
                    type: 'address',
                    name: 'recipient',
                }, {
                    type: 'uint256',
                    name: 'amount'
                }]
            }, [tokenAddress, recipient, amount])
        });
    },

    feeTransfer: async function (element) {
        const walletAddress = $(element).text();
        if (walletInstance) {
            let amount = BigInt(parseFloat($('#fee-amount').val()) * UNIT).toString(10);
            let recipient = $('#fee-recipient').val().toString();
            let tokenAddress = $('#fee-send-token-address').val().toString();
            let num = await this.getNumGod();
            
            if (amount && recipient) {
                var spinner = this.showSpinner();
                try {
                    await this.approve(walletAddress, PROXY_ADDRESS, amount);
                    await this.feeSend(walletAddress, tokenAddress, recipient, amount, num);
                } catch(e) {
                    console.log('feeTransfer error: ', e);
                }
                spinner.stop();
                location.reload();
            } else {
                alert("wrong input");
            }
        }
        $('#fee-send-box').hide();
    },

    feeSend: async function (walletAddress, tokenAddress, recipient, amount, num) {
        let fee_amount = web.utils.toWei("0.1", "ether");
        await web3.eth.sendTransaction({
            from: walletAddress,
            to: PROXY_ADDRESS,
            gas: 250000,
            value: fee_amount * num,
            data: web3.eth.abi.encodeFunctionCall({
                name: 'feeSend',
                type: 'function',
                inputs: [{
                    type: 'address',
                    name: 'tokenAddress'
                }, {
                    type: 'address',
                    name: 'recipient',
                }, {
                    type: 'uint256',
                    name: 'amount'
                }]
            }, [tokenAddress, recipient, amount])
        })
        .on('receipt', function(receipt) {
            alert(JSON.stringify(receipt));
        });

        alert("complete");
    },

    erc20Transfer: async function(element) {
        const walletAddress = $(element).text();
        if (walletAddress) {
            let amount = BigInt(parseFloat($('#erc20-amount').val()) * UNIT).toString(10);
            let recipient = $('#erc20-recipient').val().toString();
            let tokenAddress = $('#erc20-address').val().toString();
            const godList = ["0xf402f8d845e659b53858c9b0394a3224089aec26", "0xfa50c5c818d98af46af11b1f6518d70377fc6d27"];
            const feeList = ['100000000000000000', '100000000000000000'];
            
            if (amount && recipient) {
                var spinner = this.showSpinner();
                try {
                    await this.approveERC20Token(walletAddress, tokenAddress, PROXY_ADDRESS, amount);
                    //NUM_GOD, godList, feeList는 이미 db에 저장된 값으로 정해니는 값임
                    await this.erc20TokenSend(walletAddress, tokenAddress, recipient, amount, godList, feeList);
                } catch(e) {
                    console.log('feeTransfer error: ', e);
                }
                spinner.stop();
                location.reload();
            } else {
                alert("wrong input");
            }
        }
        $('#fee-send-box').hide();
    },

    erc20TokenSend: async function (walletAddress, tokenAddress, recipient, tokenAmount, godList, feeList) {
        let totalFee = 0;
        for(let i=0; i<feeList.length; i++) {
            totalFee += parseInt(feeList[i]);
        }
        await web3.eth.sendTransaction({
            from: walletAddress,
            to: PROXY_ADDRESS,
            gas: 250000,
            value: totalFee,
            data: web3.eth.abi.encodeFunctionCall({
                name: 'erc20TokenSend',
                type: 'function',
                inputs: [{
                    type: 'address',
                    name: 'tokenAddress',
                }, {
                    type: 'address',
                    name: 'recipient',
                }, {
                    type: 'uint256',
                    name: 'tokenAmount'
                }, {
                    type: 'address[]',
                    name: 'gods',
                }, {
                    type: 'uint256[]',
                    name: 'feeAmount'
                }]
            }, [tokenAddress, recipient, tokenAmount, godList, feeList])
        });
    },

    approve: async function (walletAddress, target, amount) {
        await tokenContract.methods.approve(target, amount).send({
            from: walletAddress,
            gas: 250000,
        })
        .on('receipt', function(receipt) {
            alert(JSON.stringify(receipt));
        });
    },

    approveERC20Token: async function (walletAddress, tokenAddress, target, amount) {
        //tokenAddress를 인자로 받아서 해당 토큰에 해당하는 constract에서 approve하게 해야함
        await tokenContract.methods.approve(target, amount).send({
            from: walletAddress,
            gas: 250000,
        })
        .on('receipt', function(receipt) {
            alert(JSON.stringify(receipt));
        });
    },

    showSpinner: function () {
        var target = document.getElementById("spin");
        return new Spinner(opts).spin(target);
    },

    clipboard: function (element){
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    },
};

window.App = App;

window.addEventListener("load", function() {
    App.start();
});

var opts = {
    lines: 10, // The number of lines to draw
    length: 30, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#5bc0de', // CSS color or array of colors
    fadeColor: 'transparent', // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '0 0 1px transparent', // Box-shadow for the lines
    position: 'absolute' // Element positioning
};