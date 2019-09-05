import React from 'react';
import { render, waitForElement, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import App from '../App'

import { fetchLatestRates, fetchHistory } from '../api/fetch'

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


test("test", async () => {
    const data = latestRatesData;
    const history = historyData;
    fetchLatestRates.mockResolvedValueOnce(data);
    fetchHistory.mockResolvedValueOnce(history);

    const { container, getByLabelText, getByTestId } = render(<App />)

    await waitForElement(() => container.querySelectorAll('.calculate'))
    await waitForElement(() => container.querySelectorAll('.table'))

    fireEvent.change(getByLabelText('From'), {target: {value: "USD"}});

    fireEvent.change(getByLabelText('Amount'), {target: {value: 123}});

    fireEvent.click(getByTestId('calculatebtn'));

    await waitForElement(() => container.querySelector('.chart'))
    expect(container.querySelector('.chart')).toBeInTheDocument()
})