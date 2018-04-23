import Web3 from 'web3'
import {address, ABI} from './constants/lotteryContract'
let getContract = new Promise(function (resolve, reject) {
    let web3 = new Web3(window.web3.currentProvider);
    let lotteryContract = web3.eth.contract(ABI);
    let lotteryContractInstance = lotteryContract.at(address);
    // lotteryContractInstance = () => lotteryContractInstance
    resolve(lotteryContractInstance);
});

export default getContract