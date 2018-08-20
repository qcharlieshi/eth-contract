import React, { Component } from 'react';
import './App.css';
import TransactionItemComponent from './TransactionItemComponent';
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
            depositInput: '',
            withdrawInput: '',
            showTransactions: true,
        };

        this.runAllUpdates = this.runAllUpdates.bind(this);
        this.runBalanceUpdates = this.runBalanceUpdates.bind(this);
        this.depositInput = this.depositInput.bind(this);
        this.withdrawInput = this.withdrawInput.bind(this);
        this.showTransactions = this.showTransactions.bind(this);
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
        getUserVaultBalance(this);
        getVaultTransactions(this);
    }

    runAllUpdates() {
        //runs all api requests
        getUserAccount(this).then(() => {
            getUserBalance(this);
            getUserVaultBalance(this)
        });

        getVaultTransactions(this)
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

    showTransactions() {
        this.setState((prevState) => {
            return {showTransactions: !prevState.showTransactions}
        })
    }

    render() {
        const showTransactions = (this.state.showTransactions ? 'Hide ' : 'Show ') + ' Transactions';

        return (
            <div className="main">
                <div className="user-balances">
                    <span className="user-balance-item">
                        <label>User Wallet Balance</label>
                        {this.state.userBalance} ETH
                    </span>
                    <div className="input-box">
                        <div>
                            <input onChange={this.depositInput} value={this.state.depositInput} placeholder="ETH"/>
                            <button onClick={() => depositToVault(this)}>DEPOSIT</button>
                        </div>
                        <div>
                            <input onChange={this.withdrawInput} value={this.state.withdrawInput} placeholder="ETH"/>
                            <button onClick={() => withdrawFromVault(this)}>WITHDRAW</button>
                        </div>
                        {/*<div className="arrow-image">&#11013;</div>*/}
                    </div>
                    <span className="user-balance-item">
                        <label>User Vault Balance</label>
                        {this.state.userVaultBalance} ETH
                    </span>
                </div>

                <hr/>

                <div>
                    <button onClick={this.showTransactions}>{showTransactions}</button>
                    {   this.state.showTransactions ?
                        <div>
                            <div className="transaction-column-names">
                                <span className="column-timestamp">Timestamp</span>
                                <span className="column-hash">From</span>
                                <span className="column-hash">To</span>
                                <span className="column-hash">Hash</span>
                                <span className="column-value">Value</span>
                            </div>
                            {this.state.transactions.map((transaction) => {
                                return (
                                    <TransactionItemComponent transaction={transaction} />
                                )
                            })}
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

export default App;
