import React, { Fragment } from 'react';
import Pagination from 'react-js-pagination';
import _map from 'lodash/map';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

const CustTableTransaction = ({ tokenList, tableHead, perPage, page, handlePageChange }) => {
  return (
    < div >
      <div className="export-table-view">
        <div className="export-view table-responsive">
          <table id='remcoExport'>
            <thead>
              <tr>
                {_map(tableHead, (items, i) => {
                  return (
                    <th key={i} className="text-center">{items}</th>
                  )
                })
                }
              </tr>
            </thead>
            <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-center">{items.transactionType}</td>
                      <td className="text-center">{moment(items.timeStamp).format('L')}</td>
                      <td className="text-center">{items.transferAmount}</td>
                      <td className="text-center">{items.tokenCurrency}</td>
                      <td className="text-center">{items.accessKey}</td>
                      <td className="text-center">{items.accessToken}</td>
                      <td className="text-center">{items.tokenNumber}</td>
                      <td className="text-center">{items.tokenValue}</td>
                      <td className="text-center">{items.transactionFee}</td>
                      <td className="text-center">{items.tokenStatus}</td>
                    </tr>
                  )
                })
                }</Fragment>}
            </tbody>
          </table>
        </div>
        <div className="datatable-pagination">
          {tokenList.length > 0 &&
            <Pagination
              prevPageText='Previous'
              nextPageText='Next'
              hideFirstLastPages
              activePage={page}
              activeLinkClass='active'
              linkClassPrev='active'
              linkClassNext='active'
              itemsCountPerPage={perPage}
              totalItemsCount={tokenList.length}
              onChange={(page) => handlePageChange(page)} />
          }
        </div>
      </div>
    </div >
  )
}

export default CustTableTransaction;
