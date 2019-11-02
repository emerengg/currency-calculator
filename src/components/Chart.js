import React, { Component } from 'react';
import { Line } from 'react-chartjs-2'

class Exchange extends Component {
    constructor(props){
        super(props);
        const { ct, cf } = this.props;
               
        const x = 5;
        const y = 0;
        const { labels, label, data } = this.prepareData(this.props);

        this.state = {
            x: x,
            y: y,
            currencyFrom: cf,
            currencyTo: ct,
            chartLabels: labels,
            chartData: data,
            data: this.chartObject(labels, label, data, {x, y})
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.rates !== prevProps.data.rates) {
            const { ct, cf } = this.props;
            const { x, y } = this.state;
            const { labels, label, data } = this.prepareData(this.props);

            this.setState({
                currencyFrom: cf,
                currencyTo: ct,
                chartLabels: labels,
                chartData: data,
                data: this.chartObject(labels, label, data, {x, y})
            })
        }
    }

    prepareData = (props) => {
        const { ct } = props;
        const { rates } = props.data;

        const dates = rates.map(key => key.date);
        const currency = rates.map(key => Object.keys(key)[0] === ct ? Object.values(key)[0] : Object.values(key)[1]);
        const label = ct;
        const labels = dates.length >= 20 && dates.reverse().slice(0,20);
        const data = currency.length >= 20 && currency.reverse().slice(0,20);
        
        return {
            labels,
            label,
            data
        }
    }

    chartObject = (labels, label, data, {x, y}) => {
        return {
            labels: labels.slice(y, x).reverse(),
            datasets: [{
                label: label,
                fill: false,
                backgroundColor: 'rgb(219,84,97)',
                borderColor: 'rgb(241,237,238)',
                pointHoverRadius: 7,
                data: data.slice(y, x).reverse()
            }],
            fill: false
        }
    }
    
    // display chart data
    handleData = (event) => {
        const { chartLabels, chartData, currencyTo, x } = this.state;

        const name = event.currentTarget.className;
        const r = name.includes('prevData') ? x + 5 : x - 5;

        if(r <= chartLabels.length && r > 0){
            const rx = name.includes('prevData') ? r : r;
            const ry = name.includes('prevData') ? x : r - 5;

            const label = currencyTo;
            const labels = chartLabels.slice(ry, rx).reverse();
            const data = chartData.slice(ry, rx).reverse();

            this.setState({
                x: rx,
                y: ry,
                data: this.chartObject(labels, label, data, {rx, ry})
            })
        }
    }

    render() {
        const { currencyTo, data } = this.state;
        return (
            <div className="chart" ref="chart" data-testid="chart">
                <Line 
                    data={data}
                    options={{
                        defaultFontColor: "#fff",
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: `Exchange rate history`,
                            fontSize: 16,
                            fontColor: '#F1EDEE'
                        },
                        legend: {
                            display: true,
                            position: "bottom",
                            labels: {
                                fontColor: '#F1EDEE'
                            }
                        }, 
                        scales: {
                            yAxes: [{
                                ticks: {
                                    callback: function(value, index, values) {
                                        return value.toFixed(5) + ` ${currencyTo}`;
                                    },
                                    fontColor: '#8AA29E'
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontColor: '#8AA29E'
                                },
                            }]
                        }, 
                        elements: {
                            line: {
                                tension: 0
                            }
                        }
                    }}
                />
                <button type="button" className="prevData" onClick={this.handleData}><i className="fas fa-arrow-left prev"></i></button>
                <button type="button" className="nextData" onClick={this.handleData}><i className="fas fa-arrow-right next"></i></button>
            </div>
        );
    }
}

export default Exchange;
