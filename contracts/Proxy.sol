pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./ProxyStorage.sol";

contract Proxy {
    address public _proxyStorageAddress;

    constructor(address proxyStorageAddress) public {
        require(proxyStorageAddress != address(0), "zero address");
        _proxyStorageAddress = proxyStorageAddress;
    }

    function () external payable {
        address logicAddress = ProxyStorage(_proxyStorageAddress).getLogicAddress();
        require(logicAddress != address(0), "error : zero address");
        
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, logicAddress, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    function getGods() public view returns(address[]) {
        address[] memory _god = ProxyStorage(_proxyStorageAddress).getGods();
        return _god;
    }

    function test(uint256[] feeAmount) public view returns(uint256[]) {
        return feeAmount;
    }
}