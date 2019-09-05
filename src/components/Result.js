import React from 'react';

const Result = ({date, calculatedExchange, amount, currencyFrom, currencyTo, conversionFrom, conversionTo}) => {
    // toFixed(n)
    return(
        <div className="results">
            <div className="date">{date}</div>
            <div className="result">{amount} {currencyFrom} = {calculatedExchange.toFixed(4)} {currencyTo}</div>
            <div className="f1t">1 {currencyFrom} = {conversionFrom.toFixed(6)} {currencyTo}</div>
            <div className="f1t">1 {currencyTo} = {conversionTo.toFixed(6)} {currencyFrom}</div>
        </div>
    );
}

export default Result;