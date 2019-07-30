pragma solidity ^0.4.24;

import "./HotDogToken.sol";
import "./ProxyStorage.sol";

contract Logic {
    address public _proxyStorageAddress;

    function feeFreeSend(address tokenAddress, address recipient, uint256 amount) public {
        ERC20(tokenAddress).transferFrom(msg.sender, recipient, amount);
    }

    function feeSend(address tokenAddress, address recipient, uint256 amount) public payable {
        address[] memory _god = ProxyStorage(_proxyStorageAddress).getGods();
        ERC20(tokenAddress).transferFrom(msg.sender, recipient, amount);
        uint256 length = ProxyStorage(_proxyStorageAddress).getNumGod();
        for(uint8 i=0; i<length; i++) {
            _god[i].transfer(ProxyStorage(_proxyStorageAddress).getValue());
        }
    }

    function erc20TokenSend(address tokenAddress, address recipient, uint256 tokenAmount, address[] gods, uint256[] feeAmount) public payable {
        require(tokenAddress != address(0), "wrong token address");
        require(recipient != address(0), "wrong token address");
        require(gods.length == feeAmount.length, "wrong gods' info");
        uint256 balance = ERC20(tokenAddress).balanceOf(msg.sender);
        if(tokenAmount > balance) {
            return;
        }
        ERC20(tokenAddress).transferFrom(msg.sender, recipient, tokenAmount);
        for(uint256 i=0; i<gods.length; i++) {
            gods[i].transfer(feeAmount[i]);
        }
    }
}