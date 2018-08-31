import React, { Fragment } from 'react';
import _map from 'lodash/map';

const RecTrans = ({ transList, isUser }) => {

    console.log('rectrans', transList)
    return (
        <div className="recentTransaction">
            <div className="row">
                <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd0">
                    <div className="transactionhistory">
                        <h1>Recent Transaction</h1>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Token Number</th>
                                        <th className="text-center">Amount</th>
                                        <th>type</th>
                                        {!isUser && <th>Partner’s Access Key </th>}
                                        {!isUser && <th>Partner’s Access Token</th>}
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {_map(transList, (each, i) => {
                                        console.log('yuyuy', each)
                                        return (
                                            <tr key={i}>
                                                <td>{each.tokenNumber}</td>
                                                <td className="text-center">{each.tokenValue}</td>
                                                <td>{each.transactionType}</td>
                                                {!isUser && <td>{each.accessKey}</td>}
                                                {!isUser && <td>{each.accessToken}</td>}
                                                <td>{each.timeStamp}</td>
                                            </tr>)
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RecTrans;