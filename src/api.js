import axios from 'axios'
import Web3 from 'web3'
import {API_KEY, VAULT_ADDRESS, CONTRACT_ABI, WEI} from "./constants";

let web3 = window.web3;
web3 = new Web3(web3.currentProvider);

const vaultContract = new web3.eth.Contract(CONTRACT_ABI, VAULT_ADDRESS);

const axiosConfig = {
    getVaultBalance: `https://api.etherscan.io/api?module=account&action=balance&address=${VAULT_ADDRESS}&tag=latest&apikey=${API_KEY}`,
    getVaultTransactions: `http://api.etherscan.io/api?module=account&action=txlist&address=${VAULT_ADDRESS}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`
};

export const getUserBalance = (context) => {
    return web3.eth.getBalance(context.state.userAccount, function(err, balance) {
        return balance
    }).then((balance) => {
        const ethBalance = web3.utils.fromWei(balance, "ether");
        context.setState(() => {
            return {userBalance: ethBalance}
        })
    })
};

export const getUserAccount = (context) => {
    return web3.eth.getAccounts((err, accounts) => {
        if (err != null || accounts.length === 0) {
            return;
        }

        return accounts[0];
    }).then((account) => {
        context.setState(() => {
            return {userAccount: account[0]}
        });
    })
};

//unnecesscary
export const getVaultBalance = (context) => {
    axios.get(axiosConfig.getVaultBalance)
        .then(function (response) {
            if (response.data.message === "OK") {
                context.setState(() => {
                    return {vaultBalance: response.data.result}
                })
            } else {
                throw new Error(response.data.message)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const getUserVaultBalance = (context) => {
    vaultContract.methods.balanceOf(context.state.userAccount).call({}, (err, res) => {
        const newBalance = res / WEI;
        console.log('----- getUserVaultBalance', newBalance, res);
        context.setState(() => {
            return {userVaultBalance: newBalance}
        })
    })
};

export const depositToVault = (context) => {
    const amt = context.state.depositInput * WEI || 0;
    const userAccount = context.state.userAccount;

    vaultContract.methods.deposit().send({from: userAccount, value: amt}, (err, res) => {
        console.log('----- depositToVault', err, res)
    })
};

export const withdrawFromVault = (context) => {
    const amt = context.state.withdrawInput * WEI || 0;
    const userAccount = context.state.userAccount;

    vaultContract.methods.withdraw(amt).send({from: userAccount}, (err, res) => {
        console.log('----- withdrawFromVault', err, res)
    })
};

export const getVaultTransactions = (context) => {
    console.log('----- getVaultTransactions')
    axios.get(axiosConfig.getVaultTransactions)
        .then(function (response) {
            console.log('------ VAULT TRANSACTIONS', response.data)
            // if (response.data.message === "OK") {
            //     context.setState(() => {
            //         return {vaultBalance: response.data.result}
            //     })
            // } else {
            //     throw new Error(response.data.message)
            // }
        })
        .catch(function (error) {
            console.log(error);
        });
}
