import React, { Component, Fragment } from 'react';
import CustTable from '../common/custTable';
import CustTableTransaction from '../common/custTableTransaction';

export default class CustSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
      // page: 1
    }
  }
  searchChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value });
  }

  // handlePageChange = (page) => {
  //   console.log('pageno', page)
  //   this.setState({ page })
  // }

  render() {
    const { searchString } = this.state;
    const { tokenList, tableHead, page, perPage, isViewToken, isCreateToken, handlePageChange, isTransaction,
      changeTokenStatus, isCommissionList, viewRemitCompany, isManageRemitCompany, isInvestorList, isMangeAdmin,
      deleteAdmin, viewAdmin, isManageToken, isTransFee, toggleViewUpdate, toggleEditUpdate } = this.props;
    let tList = this.props.tokenList;
    let sString = this.state.searchString.toString().trim().toLowerCase();
    if (sString.length > 0) {
      tList = tList.filter(function (i) {
        if (isCreateToken) {
          return (
            i.controlNumber.toString().toLowerCase().match(sString) ||
            i.tokenNumber.toString().toLowerCase().match(sString) ||
            i.serialNumber.toString().toLowerCase().match(sString) ||
            i.tokenAddress.toString().toLowerCase().match(sString) ||
            i.tokenCurrency.toString().toLowerCase().match(sString) ||
            i.tokenValue.toString().toLowerCase().match(sString)
          )
        } else if (isViewToken) {
          return (
            i.controlNumber.toString().toLowerCase().match(sString) ||
            i.tokenNumber.toString().toLowerCase().match(sString) ||
            i.serialNumber.toString().toLowerCase().match(sString) ||
            i.tokenAddress.toString().toLowerCase().match(sString) ||
            i.tokenCurrency.toString().toLowerCase().match(sString) ||
            i.tokenValue.toString().toLowerCase().match(sString) ||
            i.tokenBalance.toString().toLowerCase().match(sString) ||
            i.tokenActive.toString().toLowerCase().match(sString)
          )
        } else if (isTransaction) {
          return (
            i.toString().toLowerCase().match(sString) ||
            i.transactionType.toString().toLowerCase().match(sString) ||
            i.transactionDate.toString().toLowerCase().match(sString) ||
            i.tokenBalance.toString().toLowerCase().match(sString) ||
            i.accessKey.toString().toLowerCase().match(sString) ||
            i.accessToken.toString().toLowerCase().match(sString) ||
            i.tokenNumber.toString().toLowerCase().match(sString) ||
            i.tokenValue.toString().toLowerCase().match(sString) ||
            i.transactionFee.toString().toLowerCase().match(sString) ||
            i.tokenStatus.toString().toLowerCase().match(sString)
          )
        } else if (isManageRemitCompany) {
          return (
            i.companyName.toString().toLowerCase().match(sString) ||
            i.firstName.toString().toLowerCase().match(sString) ||
            i.phone.toString().toLowerCase().match(sString) ||
            i.emailId.toString().toLowerCase().match(sString) ||
            i.kycStatus.toString().toLowerCase().match(sString)
          )
        } else if (isInvestorList) {
          return (
            i.firstName.toString().toLowerCase().match(sString) ||
            i.emailId.toString().toLowerCase().match(sString) ||
            i.percentageOfShare.toString().toLowerCase().match(sString)
          )
        } else if (isMangeAdmin) {
          return (
            i.adminName.toString().toLowerCase().match(sString) ||
            i.mobileNo.toString().toLowerCase().match(sString) ||
            i.emailId.toString().toLowerCase().match(sString) ||
            i.ipAddress.toString().toLowerCase().match(sString)
          )
        } else if (isTransFee) {
          return (
            i.toString().toLowerCase().match(sString) ||
            i.date.toString().toLowerCase().match(sString) ||
            i.tokenNumber.toString().toLowerCase().match(sString) ||
            i.remittanceCompany.toString().toLowerCase().match(sString) ||
            i.ciry.toString().toLowerCase().match(sString) ||
            i.ipAddress.toString().toLowerCase().match(sString) ||
            i.amount.toString().toLowerCase().match(sString)
            // i.tokenValue.toString().toLowerCase().match(sString) ||
            // i.transactionFee.toString().toLowerCase().match(sString) ||
            // i.tokenStatus.toString().toLowerCase().match(sString)
          )
        } else if (isCommissionList) {
          return (
            i.toString().toLowerCase().match(sString) ||
            i.companyName.toString().toLowerCase().match(sString) ||
            i.accessKey.toString().toLowerCase().match(sString) ||
            i.accessTokens.toString().toLowerCase().match(sString) ||
            i.dailyTransactionLimit.toString().toLowerCase().match(sString)
          )
        }
      });
    }
    return (
      <Fragment>
        <div className="searchbox">
          <div className="searchicon">
            <input type="text" placeholder="Enter Your Search..." onChange={this.searchChange} name='searchString' value={searchString} />
            <i className="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        {isTransaction ? <CustTableTransaction tableHead={tableHead} tokenList={tList}
          handlePageChange={handlePageChange} page={page} perPage={perPage} isTransaction={isTransaction} />
          : <CustTable tokenList={tList} tableHead={tableHead} handlePageChange={handlePageChange} toggleViewUpdate={toggleViewUpdate}
            isMangeAdmin={isMangeAdmin} isManageToken={isManageToken} changeTokenStatus={changeTokenStatus}
            viewRemitCompany={viewRemitCompany} page={page} perPage={perPage} isViewToken={isViewToken}
            viewAdmin={viewAdmin} deleteAdmin={deleteAdmin} isCreateToken={isCreateToken} isCommissionList={isCommissionList}
            isManageRemitCompany={isManageRemitCompany} isInvestorsList={isInvestorList} isTransFee={isTransFee}
            toggleEditUpdate={toggleEditUpdate} />}
      </Fragment>
    )
  }
}
