import React, { Component } from 'react';

import TableRow from './TableRow'


let currencies = ["EUR", "PLN", "GBP", "USD", "CAD", "JPY", "RUB"]

if(window.innerHeight > 950) {currencies =  currencies.slice(0,8)}
else if(window.innerHeight > 850) {currencies =  currencies.slice(0,7)}
else if(window.innerHeight > 700) {currencies =  currencies.slice(0,5)}
else if(window.innerHeight > 600) {currencies =  currencies.slice(0,4)}
else if(window.innerHeight > 500) {currencies =  currencies.slice(0,3)}

class Table extends Component {
    constructor(props){
        super(props);
        const { rates } = this.props
        const filteredRates = Object.entries(rates).filter(([key, value]) => currencies.includes(key) && { key, value })
        const sortedRates = filteredRates.slice().sort((a,b) => {
            return currencies.indexOf(a[0]) - currencies.indexOf(b[0]);
        })
        this.state = {
            currencies: currencies,
            sortedRates
        }
    }

    render() {
        const { currencies, sortedRates } = this.state;
        return (
            <div className="table">
                <div className="table-title"><span>Exchange Rates</span></div>
                <table ref="table" onMouseOver={this.handleMouseOver}>
                    <thead>
                        <tr>
                            <th></th>
                            {currencies.map(rate => <th key={rate}>{rate}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                    {sortedRates.map(([key,value]) => {
                            let data = {};
                            for(let x of currencies){
                                const v = this.props.rates[x] / value;
                                data[x] = v.toFixed(5);
                            }
                            return <TableRow key={key} data={data} currency={key}/>
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;
