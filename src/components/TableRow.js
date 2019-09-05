import React from 'react';

import TableData from './TableData'

function TableRow ({currency, data}){
    return (
        <tr>
            <td>{currency}</td>
            {Object.entries(data).map(([key, value]) => {
                return <TableData key={key} value={value} />
            })}
        </tr>
    );
}

export default TableRow;
