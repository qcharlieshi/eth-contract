import React, { Component } from 'react';
import './App.css';
import {
    depositToVault,
    getUserAccount,
    getUserBalance,
    getUserVaultBalance,
    getVaultBalance, getVaultTransactions,
    withdrawFromVault
} from "./api";
import {UPDATE_INTERVAL} from "./constants";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userAccount: null,
            userBalance: null,
            vaultBalance: null,
            userVaultBalance: null,
            transactions: [],
            lastUpdated: null,
            depositInput: 0,
            withdrawInput: 0
        };

        this.runAllUpdates = this.runAllUpdates.bind(this);
        this.onDeposit = this.onDeposit.bind(this);
        this.depositInput = this.depositInput.bind(this);
        this.withdrawInput = this.withdrawInput.bind(this);
    }

    componentDidMount() {
        this.runAllUpdates();

        //We periodiclly pull from the server
        this.interval = setInterval(() => {
            this.setState({ lastUpdated: Date.now() });
            this.runAllUpdates()
        }, UPDATE_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    runBalanceUpdates() {
        getUserBalance(this);
        getUserVaultBalance(this)
    }

    runAllUpdates() {
        //runs all api requests
        getUserAccount(this).then(() => {
            getUserBalance(this);
            getUserVaultBalance(this)
        });

        getVaultTransactions(this)
    }

    onDeposit() {
    }

    depositInput(e) {
        const newValue = e.target.value;
        this.setState(() => {
            return {depositInput: newValue}
        })
    }

    withdrawInput(e) {
        const newValue = e.target.value;
        this.setState(() => {
            return {withdrawInput: newValue}
        })
    }

    render() {
        console.log('----- RENDER', this.state);
        return (
            <div>
                <ul>
                    <li>{this.state.userAccount}</li>
                    <li>{this.state.userBalance} ETH</li>
                    <li>{this.state.userVaultBalance} ETH</li>
                    <li>{this.state.vaultBalance} ETH</li>
                </ul>
                <div>
                    <button onClick={() => depositToVault(this)}>DEPOSIT</button>
                    <input onChange={this.depositInput} value={this.state.depositInput}/>
                </div>
                <div>
                    <button onClick={() => withdrawFromVault(this)}>WITHDRAW</button>
                    <input onChange={this.withdrawInput} value={this.state.withdrawInput}/>
                </div>
            </div>
        );
    }
}

export default App;
