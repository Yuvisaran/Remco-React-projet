import React, { Fragment } from 'react';
import _map from 'lodash/map';
import Pagination from 'react-js-pagination';

import CommissionTableRow from './commissionTableRow';

export default class CommissionTableHead extends React.Component {
  render() {
    const { investorList, handlePageChange, page, perPage, vTNCommissionDTO, onProductTableUpdate,
      perOfInvestorError, commissionEmailIdError, isEdit, commissionPage } = this.props;
    return (
      <Fragment>
        <div className="feesallowed-table">
          <div className="fees-adddelete">
            <button type="button" className="addmorerow" onClick={this.props.onRowAdd} >
              <i className="fa fa-plus" aria-hidden="true"></i>Add More Row</button>
            <button type="button" className="deleterow" onClick={this.props.onRowDel} >
              <i className="fa fa-trash-o" aria-hidden="true"></i>Delete Row</button>
          </div>
          <div className="fees-verfytable">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd">
                <div className="vtn-tale">
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Percent (%)</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isEdit && <Fragment> {_map(vTNCommissionDTO, (commissionDetail, i) => {
                        return (
                          page * perPage > i &&
                            (page - 1) * perPage <= i &&
                            <CommissionTableRow onProductTableUpdate={onProductTableUpdate}
                              investorList={investorList} commissionEmailIdError={commissionEmailIdError}
                              commissionDetail={commissionDetail} key={i} perOfInvestorError={perOfInvestorError} />
                        )
                      })
                      } </Fragment>}
                      {!isEdit && <Fragment> {_map(vTNCommissionDTO, (commissionDetail, i) => {
                        return (
                          <CommissionTableRow onProductTableUpdate={onProductTableUpdate}
                            investorList={investorList} commissionEmailIdError={commissionEmailIdError}
                            commissionDetail={commissionDetail} key={i} perOfInvestorError={perOfInvestorError} />
                        )
                      })
                      } </Fragment>}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="datatable-pagination">
                {vTNCommissionDTO.length > 3 && isEdit &&
                  <Pagination
                    prevPageText='Previous'
                    nextPageText='Next'
                    hideFirstLastPages
                    activePage={page}
                    activeLinkClass='active'
                    linkClassPrev='active'
                    linkClassNext='active'
                    itemsCountPerPage={perPage}
                    totalItemsCount={vTNCommissionDTO.length}
                    onChange={(page) => handlePageChange(page)} />
                }
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
