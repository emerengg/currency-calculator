
import React from 'react';
import { render, waitForElement, fireEvent, getByTestId, getByLabelText } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import Exchange from '../components/Exchange'

import { fetchLatestRates } from '../api/fetch'


jest.mock("../api/fetch");

const mockedData = {
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

describe("<Exchange />", () => {
    it("render component", () => {
        const { container } = render(<Exchange />)

        expect(container.firstElementChild).toHaveClass('main')
    })

    it("should have two preloaders on render", () => {
        const data = null;
        fetchLatestRates.mockResolvedValueOnce(data);

        const { container } = render(<Exchange />)

        expect(container.querySelectorAll('.loading').length).toBe(2)
    })
    
    it("should have 3 child components", () => {
        const { container } = render(<Exchange />)

        expect(container.firstChild.childElementCount).toEqual(3)
    })

    it("should display Calculate component after fetching the data", async () => {
        const data = mockedData;
        fetchLatestRates.mockResolvedValueOnce(data);

        const { container } = render(<Exchange />)

        const calculate = await waitForElement(() => container.querySelector('.calculate'))
        expect(calculate).toBeInTheDocument()
    })

    it("should display Table component after fetching the data", async () => {
        const data = mockedData;
        fetchLatestRates.mockResolvedValueOnce(data);

        const { container } = render(<Exchange />)

        const table = await waitForElement(() => container.querySelector('.table'))
        expect(table).toBeInTheDocument()
    })

    it("shouldn't display Chart component on mount", () => {
        const { container } = render(<Exchange />)

        expect(container.querySelector('.chart')).not.toBeInTheDocument()
    })

    it("should switch values of selectors after button click", async () => {
        const data = mockedData;
        fetchLatestRates.mockResolvedValueOnce(data);

        const { getByTestId, getByLabelText, debug } = render(<Exchange />)

        const swtch = await waitForElement(() => getByTestId('switch'))

        expect(getByLabelText('From').value).toMatch('EUR')
        expect(getByLabelText('To').value).toMatch('PLN')

        fireEvent.click(swtch)

        expect(getByLabelText('From').value).toMatch('PLN')
        expect(getByLabelText('To').value).toMatch('EUR')
    })
})