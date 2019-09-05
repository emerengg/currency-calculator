import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Result from './Result'

import {fetchHistory} from '../api/fetch'


class Calculate extends Component {
    constructor(props){
        super(props);
        const { latestRates, currentDate, currencyFrom, currencyTo, } = this.props
        const symbols = Object.keys(latestRates.rates).map(key => key).sort();
        this.state = {
            latestRates,
            currentDate,
            amount: "",
            currencyFrom,
            currencyTo,
            calculatedExchange: 0,
            conversionFrom: 0,
            conversionTo: 0,
            result: false,
            symbols
        }
    }

    static propTypes = {
        latestRates: PropTypes.shape({
            rates: PropTypes.object.isRequired,
            date: PropTypes.string.isRequired,
            base: PropTypes.string.isRequired,
          }),
        currentDate: PropTypes.string.isRequired,
        currencyFrom: PropTypes.string.isRequired,
        currencyTo: PropTypes.string.isRequired,
    }

    handleSwitch = () => {
        this.setState({
            currencyFrom: this.state.currencyTo,
            currencyTo: this.state.currencyFrom
        }, () => {
            const { currencyFrom, currencyTo } = this.state;
            this.props.switch({ currencyFrom, currencyTo });
            this.handleRotate();
            this.state.result && this.handleCalculateClick();
        })
    }

    handleChange = (event) => {
        const val = event.target.value;
        this.setState({
            [event.target.name]: val
        }, () => {
            const { currencyFrom, currencyTo } = this.state;
            this.props.switch({ currencyFrom, currencyTo });
            this.state.result && this.handleCalculateClick();
        })
    }

    handleCalculateClick = () => {
        const { latestRates, currencyFrom, currencyTo, amount } = this.state;

        const val = this.validate(amount);

        if(val){
            const conversionTo =  latestRates.rates[currencyFrom] / latestRates.rates[currencyTo];
            const conversionFrom =  latestRates.rates[currencyTo] / latestRates.rates[currencyFrom];
            const calculatedExchange = Math.abs(val) * conversionFrom;

            this.setState({
                amount: Math.abs(val),
                calculatedExchange,
                conversionFrom,
                conversionTo,
                result: true
            }, () => {
                this.handleHistoryData();
            })
        }
    }

    // get data from the local storege otherwise fetch data
    handleHistoryData = () => {
        const { currencyFrom, currencyTo, currentDate } = this.state;

        const toFrom = `${currencyTo}-${currencyFrom}`;
        const fromTo = `${currencyFrom}-${currencyTo}`;

        let storedData = null;

        if(localStorage.getItem(toFrom)){
            storedData = JSON.parse(localStorage.getItem(toFrom)).end_at === currentDate && JSON.parse(localStorage.getItem(toFrom));
        }else if(localStorage.getItem(fromTo)){
            storedData = JSON.parse(localStorage.getItem(fromTo)).end_at === currentDate && JSON.parse(localStorage.getItem(fromTo));
        }

        if(storedData) {
            this.props.getChartData(storedData);
        }else {
            this.getHistory();
        }
    }

    getHistory = async () => {
        const { currencyFrom, currencyTo, latestRates } = this.state;
        const currentDate = new Date();
        const tma = new Date(new Date().setDate(currentDate.getDate() - 30));

        const t1 = currentDate.toLocaleDateString().split('.');
        const t2 = tma.toLocaleDateString().split('.');

        // string representation od dates
        const startAt = `${t2[2]}-${t2[1]}-${String(t2[0]).padStart(2, '0')}`;
        const endAt = `${t1[2]}-${t1[1]}-${String(t1[0]).padStart(2, '0')}`;

        let symbols = "";

        if(currencyFrom !== latestRates.base && currencyTo !== latestRates.base){
            symbols = `${currencyFrom},${currencyTo}`;
        }else if(currencyFrom !== latestRates.base){
            symbols = `${currencyFrom}`;
        }else if(currencyTo !== latestRates.base){
            symbols = `${currencyTo}`;
        }

        try {
            const response = await fetchHistory(startAt, endAt, symbols);
            const { rates, end_at, start_at, base } = response;

            // convert object response into an array
            const data = Object.keys(rates).map(d => {
                const x =  Object.keys(rates[d])[0];
                const y =  Object.keys(rates[d]).length === 2 ? Object.keys(rates[d])[1] : base;
                const xv = Object.keys(rates[d]).length === 2 ? Object.values(rates[d])[0] / Object.values(rates[d])[1] : Object.values(rates[d])[0] / 1;
                const yv = Object.keys(rates[d]).length === 2 ? Object.values(rates[d])[1] / Object.values(rates[d])[0] : 1 / Object.values(rates[d])[0];

                const object = x === currencyFrom ? { [x]: xv.toFixed(5), [y]: yv.toFixed(5), date: d} : { [y]: yv.toFixed(5), [x]: xv.toFixed(5), date: d}
                return object
            })

            const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

            const charData = {rates: sortedData, end_at, start_at};

            localStorage.setItem(`${currencyFrom}-${currencyTo}`, JSON.stringify(charData));
            this.props.getChartData(charData);
        } catch (err) {
            console.log("ERR ->", err);
        }
    }

    validate = amount => {
        const reg = /^([0-9]+(\.[0-9]{0,6})?)/g;
        const result = String(amount).match(reg) ? String(amount).match(reg)[0] : 1; 
        return result;
    }

    // rotate animation 
    handleRotate = () => {
        const rotate = this.refs.rotate;
        const cl = [ ...rotate.classList ]
        cl.includes("down") ? rotate.classList.remove("down") : rotate.classList.add("down");
    }

    render() {
        const { symbols, currencyFrom, currencyTo, result, latestRates, amount, calculatedExchange, conversionFrom, conversionTo } = this.state;
        return (
            <>
                {symbols &&
                    <div className="calculate">
                        <div className="amount top">
                            <label htmlFor="acf">Amount</label>
                            <input type="text" id="acf" ref="amountInput" name="amount" onChange={this.handleChange} autoComplete="off"></input>
                        </div>

                        <div className="currencyFromTo">
                            <div className="currencyFrom">
                                <label htmlFor="cf">From</label>
                                <select id="cf" name="currencyFrom" value={currencyFrom} onChange={this.handleChange}>
                                    {symbols.map(symbol => <option key={symbol} value={symbol}>{symbol}</option>)}
                                </select>
                            </div>
                            
                            <div className="rotate" ref="rotate">
                                <i className="fas fa-exchange-alt fa-2x" data-testid="switch" onClick={this.handleSwitch}></i>
                            </div>

                            <div className="currencyTo">
                                <label htmlFor="ct">To</label>
                                <select id="ct" name="currencyTo" value={currencyTo} onChange={this.handleChange}>
                                    {symbols.map(symbol => <option key={symbol} value={symbol}>{symbol}</option>)}
                                </select>
                            </div>
                        </div>

                        <button type="button" className="check" onClick={this.handleCalculateClick} data-testid="calculatebtn">Calculate</button>
                    </div>
                }   

                {result && 
                    <Result 
                        date={latestRates.date} 
                        amount={amount} 
                        calculatedExchange={calculatedExchange} 
                        currencyFrom={currencyFrom} 
                        currencyTo={currencyTo}
                        conversionFrom={conversionFrom}
                        conversionTo={conversionTo}
                    />
                } 
            </>
        );
    }
}

export default Calculate;