import React, { Component } from 'react';

import Chart from './Chart'
import Table from './Table'
import Calculate from './Calculate';
import Reference from './Reference';

import './Exchange.css'

import { fetchLatestRates } from '../api/fetch'


class Exchange extends Component {
    constructor(props){
        super(props);
        this.state = {
            latestRates: { rates: null, date: null, base: null },
            chartData: null,
            currentDate: null,
            currencyFrom: "EUR",
            currencyTo: "PLN",
        };
    }

    componentDidMount() {
        const todaysDate = new Date().toLocaleDateString().split('.');
        const currentDate = `${todaysDate[2]}-${String(todaysDate[1]).padStart(2, '0')}-${String(todaysDate[0]).padStart(2, '0')}`;
        const storageData = localStorage.getItem("latestRates") && JSON.parse(localStorage.getItem("latestRates"));

        if(storageData) {
            if(currentDate !== storageData.date && new Date().getDay() !== 6 && new Date().getDay() !== 0){
                this.setState({
                    currentDate
                })
                localStorage.clear();
                this.getLatestRates();
            }else {
                this.setState({
                    currentDate,
                    latestRates: storageData
                })
            }
        }else {
            this.setState({
                currentDate
            })
            localStorage.clear();
            this.getLatestRates();
        }
    }

    getLatestRates = async () => {
        try{
            const res = await fetchLatestRates();
            const { base, date, rates } = res;
            rates[base] = 1;

            this.setState({
                latestRates: { date, rates, base }
            }, () => {
                localStorage.setItem('latestRates', JSON.stringify(this.state.latestRates));
            })
        } catch (err) {
            // console.log(err)
        }
    }

    handleChartData = data => {
        this.setState({
            chartData: data
        })
    }

    switchCurrencies = ({currencyTo, currencyFrom}) => {
        this.setState({
            currencyFrom,
            currencyTo
        })
    }

    render() {
        const { latestRates, currentDate, currencyFrom, currencyTo, chartData } = this.state;
        return (
            <main className="main">
                <section className="exchange">
                    {latestRates.rates ? 
                        <Calculate 
                            latestRates={latestRates} 
                            getChartData={this.handleChartData} 
                            switch={this.switchCurrencies}
                            currentDate={currentDate}
                            currencyFrom={currencyFrom}
                            currencyTo={currencyTo}
                        />
                    :
                        <div className="loading">
                            <div className="loader"></div>
                        </div>
                    }
                </section>

                <section className="exchange-history">
                    {chartData ? 
                        <Chart data={chartData} cf={currencyFrom} ct={currencyTo} /> 
                        :
                        latestRates.rates ? 
                            <Table rates={latestRates.rates} /> 
                        : 
                            <div className="loading">
                                <div className="loader"></div>
                            </div>
                    }
                </section>

                <Reference />
            </main>
        );
    }
}

export default Exchange;
