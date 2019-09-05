import React, { Component } from 'react';
import { Line } from 'react-chartjs-2'

class Exchange extends Component {
    constructor(props){
        super(props);
        const { ct, cf } = this.props
        const { rates } = this.props.data
        const dates = rates.map(key => key.date);
        const currency = rates.map(key => Object.keys(key)[0] === ct ? Object.values(key)[0] : Object.values(key)[1]);
        const x = 5;
        const y = 0;
        const labels = dates.length > 20 && [...dates].reverse().slice(0,20);
        const data = currency.length > 20 && [...currency].reverse().slice(0,20);
         
        this.state = {
            cf: cf,
            ct: ct,
            chartLabels: labels,
            chartData: data,
            x: x,
            y: y,
            data: {
                labels: labels.slice(0, x).reverse(),
                datasets: [{
                    label: ct,
                    fill: false,
                    backgroundColor: 'rgb(219,84,97)',
                    borderColor: 'rgb(241,237,238)',
                    pointHoverRadius: 7,
                    data: data.slice(0, x).reverse()
                }],
                fill: false
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data.rates !== prevProps.data.rates) {
            const { x, y } = this.state
            const { cf, ct} = this.props
            const { rates } = this.props.data
            const dates = rates.map(key => key.date);
            const currency = rates.map(key => Object.keys(key)[0] === ct ? Object.values(key)[0] : Object.values(key)[1]);
            const label = ct;
            const labels = dates.length > 20 && [...dates].reverse().slice(0,20);
            const data = currency.length > 20 && [...currency].reverse().slice(0,20);
            this.setState({
                cf: cf,
                ct: ct,      
                chartLabels: labels,
                chartData: data,
                data: {
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
            })
        }
      }

    // display chart data
    handleData = (event) => {
        const { chartLabels, chartData, ct, x } = this.state;

        const name = event.currentTarget.className;

        const r = name.includes('prevData') ? x + 5 : x - 5;

        if(r <= chartLabels.length && r > 0){
            const rx = name.includes('prevData') ? r : r;
            const ry = name.includes('prevData') ? x : r - 5;

            const label = ct;
            const labels = chartLabels.slice(ry, rx).reverse();
            const data = chartData.slice(ry, rx).reverse();
            this.setState({
                x: rx,
                y: ry,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        fill: false,
                        backgroundColor: 'rgb(219,84,97)',
                        borderColor: 'rgb(241,237,238)',
                        data: data
                    }],
                    fill: false
                }
            })
        }
    }

    render() {
        const { ct, data } = this.state
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
                                        return value.toFixed(5) + ` ${ct}`;
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
