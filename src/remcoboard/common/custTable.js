import React, { Fragment } from 'react';
import Pagination from 'react-js-pagination';
import _map from 'lodash/map';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

const CustTable = ({ tokenList, viewInvestorsPop, tableHead, perPage, isViewToken, isManageToken, changeTokenStatus, page,
  isInvestorsList, handlePageChange, isCreateToken, isManageRemitCompany, viewRemitCompany, isMangeAdmin, statusColor,
  viewAdmin, deleteAdmin, isTransFee, isCommissionList, isInvestorsDue, toggleViewUpdate, toggleEditUpdate }) => {
  return (
    < div >
      <div className="export-table-view addwidth">
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
            {isInvestorsList && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td className="text-center">{items.firstName}</td>
                      <td className="text-center">{items.emailId}</td>
                      <td className="text-center">{items.percentageOfShare}</td>
                    </tr>
                  )
                })
                } </Fragment>}
            </tbody>}
            {isCommissionList && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="text-center">{items.companyName}</td>
                      <td className="text-center">{items.accessKey}</td>
                      <td className="text-center">{items.accessToken}</td>
                      <td className="text-center">{items.dailyTransactionLimit}</td>
                      <td className="text-center">
                        <button type="button" className="btn-pend viewbtn" onClick={() => {
                          toggleViewUpdate(items);
                        }}>View</button>
                        <button type="button" className="btn-pend viewbtn" onClick={() => {
                          toggleEditUpdate(items);
                        }}>Edit</button>
                      </td>
                    </tr>
                  )
                })
                }</Fragment>}
            </tbody>}
            {isMangeAdmin && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (each, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td>{each.adminName}</td>
                      <td>{each.mobileNo}</td>
                      <td>{each.emailId}</td>
                      <td>{each.ipAddress}</td>
                      {(each.status === 1 ? (
                        <td className="text-center">
                          <button type="button" className="btn-pend green">Active</button>
                        </td>) : <td className="text-center">
                          <button type="button" className="btn-pend darkorange">Inactive</button>
                        </td>)}
                      <td className="text-center">
                        <a onClick={() => viewAdmin(each)} className="darkblue" data-toggle="tooltip" title="Edit">
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </a>
                        &nbsp; &nbsp;
                        <a onClick={() => deleteAdmin(each)} className="darkorange" data-toggle="tooltip" title="Delete">
                          <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </a>
                      </td>
                    </tr>)
                })}</Fragment>}
            </tbody>}
            {isManageRemitCompany && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td>{items.companyName}</td>
                      <td>{items.firstName}</td>
                      <td>{items.phone}</td>
                      <td>{items.emailId}</td>
                      {items.status ? <Fragment> <td className="text-center">
                        <button type="button" className='btn-pend' style={{ background: '#607d8b', color: '#ffffff' }} >Awaiting</button>
                      </td>
                        <td className="text-center">
                          <button type="button" className="btn-pend viewbtn">{items.status}</button>
                        </td> </Fragment> : <Fragment> <td className="text-center">
                          <button type="button" className={statusColor(items.kycStatus)}>{items.kycStatus}</button>
                        </td>
                          <td className="text-center">
                            <button type="button" className="btn-pend viewbtn" onClick={() => viewRemitCompany(items)}>View</button>
                          </td> </Fragment>}
                    </tr>
                  )
                })
                }</Fragment>}
            </tbody>}
            {isTransFee && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{moment(items.date).format('L')}</td>
                      <td>{items.tokenNumber}</td>
                      <td>{items.remittanceCompany}</td>
                      <td>{items.city}</td>
                      <td>{items.ipAddress}</td>
                      <td>{items.amount}</td>
                      <td className="text-center">
                        <button type="button" className="btn-pend viewbtn" onClick={() => viewInvestorsPop(items)}>View</button>
                      </td>
                    </tr>
                  )
                })
                }</Fragment>}
            </tbody>}
            {isInvestorsDue && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{moment(items.investorDate).format('L')}</td>
                      <td>{items.tokenNumber}</td>
                      <td>{items.remittanceCompany}</td>
                      <td>{items.ciry}</td>
                      <td>{items.ipAddress}</td>
                      <td>{items.totalFeesAmount}</td>
                      <td>{items.percentage}</td>
                      <td>{items.amount}</td>
                    </tr>
                  )
                })
                } </Fragment>}
            </tbody>}
            {(isCreateToken || isViewToken || isManageToken) && <tbody>
              {tokenList.length < 1 ? <tr className='nodata'><td>No List Found</td></tr> : <Fragment>
                {_map(tokenList, (items, i) => {
                  return (
                    page * perPage > i &&
                    (page - 1) * perPage <= i &&
                    <tr key={i}>
                      <td className="text-center">{items.controlNumber}</td>
                      <td className="text-center">{items.tokenNumber}</td>
                      <td className="text-center">{items.serialNumber}</td>
                      <td className="text-center">{items.tokenAddress}</td>
                      <td className="text-center">{items.tokenCurrency}</td>
                      <td className="text-center">{items.tokenValue}</td>
                      {(isViewToken || isManageToken) && <td className="text-center">{items.tokenBalance} </td>}
                      {isViewToken && <td className="text-center">
                        <span className="btn-pend ">{items.tokenActive}</span></td>}
                      {isManageToken && <td className="text-center"> <select className="act-inact-select" name='' value={items.tokenActive} onChange={(e) => changeTokenStatus(e.target.value, items.tokenNumber)}>
                        <option className="green-text" name='1' value="Active">Active</option>
                        <option className="red-text" name='0' value="InActive">Inactive</option>
                      </select> </td>}
                    </tr>
                  )
                })
                }</Fragment>}
            </tbody>}
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
    </div>
  )
}

export default CustTable;
