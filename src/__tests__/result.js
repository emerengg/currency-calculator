import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import Result from '../components/Result'


const defaultProps = {
    date: '08-08-2019', 
    calculatedExchange: 531.735685, 
    amount: 123, 
    currencyFrom: 'EUR', 
    currencyTo: 'PLN', 
    conversionFrom: 4.3227, 
    conversionTo: 0.2313368959215305
}

describe("<Result />", () => {
    it("render component", () => {
        const { container } = render(<Result {...defaultProps} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("shoud have 4 child components", () => {
        const { container } = render(<Result {...defaultProps} />)
        expect(container.firstChild.childElementCount).toBe(4)
    })

    it("shoud render date prop", () => {
        const { getByText } = render(<Result {...defaultProps} />)
        expect(getByText('08-08-2019')).toHaveTextContent(/^08-08-2019$/)
    })
})