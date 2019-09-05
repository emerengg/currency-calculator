import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'

import Chart from '../components/Chart'


const defaultProps = {
    cf: "EUR",
    ct: "PLN",
    data: {
        end_at: "2019-08-12",
        rates: [
            {EUR: "0.23462", PLN: "4.26220", date: "2019-07-15"},
            {EUR: "0.23499", PLN: "4.25550", date: "2019-07-16"},
            {EUR: "0.23452", PLN: "4.26410", date: "2019-07-17"},
            {EUR: "0.23476", PLN: "4.25960", date: "2019-07-18"},
            {EUR: "0.23490", PLN: "4.25710", date: "2019-07-19"},
            {EUR: "0.23540", PLN: "4.24800", date: "2019-07-22"},
            {EUR: "0.23531", PLN: "4.24970", date: "2019-07-23"},
            {EUR: "0.23503", PLN: "4.25470", date: "2019-07-24"},
            {EUR: "0.23545", PLN: "4.24720", date: "2019-07-25"},
            {EUR: "0.23436", PLN: "4.26700", date: "2019-07-26"},
            {EUR: "0.23361", PLN: "4.28060", date: "2019-07-29"},
            {EUR: "0.23304", PLN: "4.29120", date: "2019-07-30"},
            {EUR: "0.23304", PLN: "4.29120", date: "2019-07-31"},
            {EUR: "0.23267", PLN: "4.29790", date: "2019-08-01"},
            {EUR: "0.23248", PLN: "4.30140", date: "2019-08-02"},
            {EUR: "0.23179", PLN: "4.31420", date: "2019-08-05"},
            {EUR: "0.23192", PLN: "4.31190", date: "2019-08-06"},
            {EUR: "0.23162", PLN: "4.31740", date: "2019-08-07"},
            {EUR: "0.23134", PLN: "4.32270", date: "2019-08-08"},
            {EUR: "0.23153", PLN: "4.31910", date: "2019-08-09"},
            {EUR: "0.23108", PLN: "4.32750", date: "2019-08-12"}
        ],
        start_at: "2019-07-13"
    }
}

describe("<Chart />", () => {
    it("render component", () => {
        const { container } = render(<Chart {...defaultProps} />)
        expect(container.querySelector('.chart')).toBeInTheDocument()
    })

    it("should display navigation buttons", () => {
        const { container } = render(<Chart {...defaultProps} />)
        expect(container.querySelector('.prevData')).toBeInTheDocument()
        expect(container.querySelector('.nextData')).toBeInTheDocument()
    })
})