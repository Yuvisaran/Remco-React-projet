import React from 'react';
import Pagination from 'react-js-pagination';
import _map from 'lodash/map';
import Skeleton from 'react-loading-skeleton';

const CustTable = ({ tokenList, tableHead, perPage, isViewToken, isManageToken, changeTokenStatus, page,
  isInvestorsList, handlePageChange, isCreateToken, isManageRemitCompany, viewRemitCompany, isMangeAdmin,
  viewAdmin, deleteAdmin, isTransFee, isCommissionList, isInvestorsDue, toggleViewUpdate, toggleEditUpdate }) => {
  return (
    < div >
      <div className="export-table-view">
        <div className="export-view table-responsive">
          <table id='remcoExport'>
            <thead>
              <tr>
                {_map(tableHead, (items, i) => {
                  console.log('heading', items)
                  return (
                    <th key={i} className="text-center">{items}</th>
                  )
                })
                }
              </tr>
            </thead>
            {isInvestorsList && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                console.log('content', items)
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
              }
            </tbody>}
            {isCommissionList && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                console.log('content', items)
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
                        console.log('ittttt', items)
                        toggleViewUpdate(items);
                      }}>View</button>
                      <button type="button" className="btn-pend viewbtn" onClick={() => {
                        console.log('ittttt', items)
                        toggleEditUpdate(items);
                      }}>Edit</button>
                    </td>
                  </tr>
                )
              })
              }
            </tbody>}
            {isMangeAdmin && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (each, i) => {
                console.log('content', each)
                return (
                  page * perPage > i &&
                  (page - 1) * perPage <= i &&
                  <tr key={i}>
                    <td>{each.adminName}</td>
                    <td>{each.mobileNo}</td>
                    <td>{each.emailId}</td>
                    <td>{each.ipAddress}</td>
                    {(each.status === '1' ? (
                      <td className="text-center">
                        <button type="button" className="btn-pend green">Active</button>
                      </td>) : <td className="text-center">
                        <button type="button" className="btn-pend darkorange">InActive</button>
                      </td>)}
                    <td className="text-center" onClick={(each) => viewAdmin(each)} >
                      <a className="darkblue" data-toggle="tooltip" title="Edit">
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </a>
                      <a onClick={(each) => deleteAdmin(each)} className="darkorange" data-toggle="tooltip" title="Delete">
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                      </a>
                    </td>
                  </tr>)
              })}
            </tbody>}
            {isManageRemitCompany && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                console.log('content', items)
                return (
                  page * perPage > i &&
                  (page - 1) * perPage <= i &&
                  <tr key={i}>
                    <td>{items.companyName}</td>
                    <td>{items.firstName}</td>
                    <td>{items.phone}</td>
                    <td>{items.emailId}</td>
                    <td className="text-center">
                      <button type="button" className="btn-pend pending">{items.kycStatus}</button>
                    </td>
                    <td className="text-center">
                      <button type="button" className="btn-pend viewbtn" onClick={(items) => viewRemitCompany(items)}>View</button>
                    </td>
                  </tr>
                )
              })
              }
            </tbody>}
            {isTransFee && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                console.log('content', items)
                return (
                  page * perPage > i &&
                  (page - 1) * perPage <= i &&
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{items.date}</td>
                    <td>{items.tokenNumber}</td>
                    <td>{items.remittanceCompany}</td>
                    <td>{items.ciry}</td>
                    <td>{items.ipAddress}</td>
                    <td>{items.amount}</td>
                    <td className="text-center">
                      <button type="button" className="btn-pend viewbtn" data-toggle="modal" data-target="#feesview" data-backdrop="static">View</button>
                    </td>                    {/* <td className="text-center">
                      <button type="button" className="btn-pend pending">{items.kycStatus}</button>
                    </td>
                    <td className="text-center">
                      <button type="button" className="btn-pend viewbtn" onClick={(items) => viewRemitCompany(items)}>View</button>
                    </td> */}
                  </tr>
                )
              })
              }
            </tbody>}
            {isInvestorsDue && <tbody>
              {_map(tokenList || <Skeleton count={5} />, (items, i) => {
                console.log('content', items)
                return (
                  page * perPage > i &&
                  (page - 1) * perPage <= i &&
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{items.investorDate}</td>
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
              }
            </tbody>}
            {(isCreateToken || isViewToken || isManageToken) && <tbody>
              {_map(tokenList, (items, i) => {
                console.log('content', items)
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
                      <option className="red-text" name='0' value="InActive">InActive</option>
                    </select> </td>}
                  </tr>
                )
              })
              }
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
      {/* <div className="transactionFeesPopup"> */}
      {/* <div className="modal fade" id="feesview" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Investor Percentage</h4>
            </div>
            <div className="modal-body">
              <div className="feestable">
                <table>
                  <thead>
                    <tr>
                      <th>Investor type</th>
                      <th>Percentage</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Investor A</td>
                      <td>20%</td>
                      <td>2</td>
                    </tr>
                    <tr>
                      <td>Investor B</td>
                      <td>40%</td>
                      <td>4</td>
                    </tr>
                    <tr>
                      <td>Investor C</td>
                      <td>40%</td>
                      <td>4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="feesBtn">
                <button type="button" className="btn fees-cancelbtn" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div> */}
    </div>
    // </div >
  )
}

export default CustTable;
