
import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import Table from '../components/Table'


const rates = {
    CAD: 1.4654,
    EUR: 1,
    GBP: 0.9034,
    JPY: 121.42,
    PLN: 4.2641,
    RUB: 70.4625,
    USD: 1.1215,
}

describe("<Table />", () => {
    it("render component", () => {
        const { container } = render(<Table rates={rates} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should have 8 thead childs", () => {
        const { container } = render(<Table rates={rates} />)
        expect(container.querySelector('thead').firstElementChild.childElementCount).toEqual(6)
    })

    it("should have 8 tbody childs", () => {
        const { container } = render(<Table rates={rates} />)
        expect(container.querySelector('tbody').firstElementChild.childElementCount).toEqual(6)
    })

    it("should have 8 table row childs", () => {
        const { container } = render(<Table rates={rates} />)
        
        const tableRows = container.querySelector('tbody').childNodes;
        tableRows.forEach(tr => {
            expect(tr.childElementCount).toEqual(6)
        })
    })
})