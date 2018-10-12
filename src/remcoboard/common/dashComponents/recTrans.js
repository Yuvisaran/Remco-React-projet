import React, { Fragment } from 'react';
import _map from 'lodash/map';

const RecTrans = ({ transList, isUser }) => {
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
                    <th className="text-center">Currency Type</th>
                    <th>type</th>
                    {!isUser && <th>Partner’s Access Key </th>}
                    {!isUser && <th>Partner’s Access Token</th>}
                    <th>Date</th>
                    <th>Transaction Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {transList.length < 1 ? <tr className='nodata'><td>No Recent Transaction List Found For This Month</td></tr> : <Fragment>
                    {_map(transList, (each, i) => {
                      return (
                        <tr key={i}>
                          <td>{each.tokenNumber}</td>
                          <td className="text-center">{each.transferAmount}</td>
                          <td className="text-center">{each.tokenCurrency}</td>
                          <td>{each.transactionType}</td>
                          {!isUser && <td>{each.accessKey}</td>}
                          {!isUser && <td>{each.accessToken}</td>}
                          <td>{each.timeStamp}</td>
                          <td>{each.transactionFee}</td>
                        </tr>)
                    })}</Fragment>}
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
