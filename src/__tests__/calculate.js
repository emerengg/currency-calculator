import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import Calculate from '../components/Calculate'
import { fetchHistory } from '../api/fetch'

jest.mock("../api/fetch");

const latestRatesData = {
    base: "EUR",
    date: "2019-08-08",
    rates: { 
        PLN: "4.26410",       
        EUR: "1.00000",
        GBP: "0.90340",
        JPY: "121.42000",
        RUB: "70.46250",
        USD: "1.12150"
    }
}
const historyData = {
    base: "EUR",
    end_at: "2019-08-12",
    rates:{
        "2019-07-15": {PLN: 4.2622, USD: 1.1269},
        "2019-07-16": {PLN: 4.2555, USD: 1.1223},
        "2019-07-17": {PLN: 4.2641, USD: 1.1215},
        "2019-07-18": {PLN: 4.2596, USD: 1.1216},
        "2019-07-19": {PLN: 4.2571, USD: 1.1226},
        "2019-07-22": {PLN: 4.248, USD: 1.1215},
        "2019-07-23": {PLN: 4.2497, USD: 1.1173},
        "2019-07-24": {PLN: 4.2547, USD: 1.114},
        "2019-07-25": {PLN: 4.2472, USD: 1.1115},
        "2019-07-26": {PLN: 4.267, USD: 1.1138},
        "2019-07-29": {PLN: 4.2806, USD: 1.1119},
        "2019-07-30": {PLN: 4.2912, USD: 1.1154},
        "2019-07-31": {PLN: 4.2912, USD: 1.1151},
        "2019-08-01": {PLN: 4.2979, USD: 1.1037},
        "2019-08-02": {PLN: 4.3014, USD: 1.1106},
        "2019-08-05": {PLN: 4.3142, USD: 1.1182},
        "2019-08-06": {PLN: 4.3119, USD: 1.1187},
        "2019-08-07": {PLN: 4.3174, USD: 1.1202},
        "2019-08-08": {PLN: 4.3227, USD: 1.1193},
        "2019-08-09": {PLN: 4.3191, USD: 1.1198},
        "2019-08-12": {PLN: 4.3275, USD: 1.1194}
    },
    start_at: "2019-07-13"
}

const defaultProps = {
    latestRates: latestRatesData, 
    getChartData: jest.fn(), 
    switch: jest.fn(),
    currentDate: "22-02-2019",
    currencyFrom: "EUR",
    currencyTo: "PLN",
}

describe("<Calculate />", () => {
    it("render component", () => {
        const { container } = render(<Calculate {...defaultProps} />)
        expect(container.querySelector('.calculate')).toBeInTheDocument()
    })

    it("should display empty input", () => {
        const { getByLabelText } = render(<Calculate {...defaultProps} />)
        expect(getByLabelText('Amount').value).toMatch('')
    })

    it("should change value of 'From' selector", () => {
        const { getByLabelText } = render(<Calculate {...defaultProps} />)

        expect(getByLabelText('From').value).toMatch('EUR')
        fireEvent.change(getByLabelText('From'), {target: {value: 'USD'}})
        expect(getByLabelText('From').value).toMatch('USD')
    })

    it("should change value of 'To' selector", () => {
        const { getByLabelText } = render(<Calculate {...defaultProps} />)

        expect(getByLabelText('To').value).toMatch('PLN')
        fireEvent.change(getByLabelText('To'), {target: {value: 'JPY'}})
        expect(getByLabelText('To').value).toMatch('JPY')
    })

    it("should change value of amount input", () => {
        const { getByLabelText } = render(<Calculate {...defaultProps} />)
        fireEvent.change(getByLabelText('Amount'), {target: {value: 123}});
        expect(getByLabelText('Amount').value).toEqual('123');
    })

    it("should display Result component after button click", () => {
        const data = historyData;
        fetchHistory.mockResolvedValueOnce(data);

        const { container, getByText } = render(<Calculate {...defaultProps} />)

        fireEvent.click(getByText('Calculate'));

        expect(container.querySelector('.results')).toBeInTheDocument();
    })
})