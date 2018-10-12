import React, { Fragment } from 'react';
import Pagination from 'react-js-pagination';
import _map from 'lodash/map';

import FeeDeatilsTableRow from './tableRow';

export default class FeeDeatilsTable extends React.Component {
  render() {
    const { handlePageChange, page, perPage, percentageDTO, onProductTableUpdate, fixAmtError,
      toAmtError, fromAmtError, perOfCommissionError, isEdit } = this.props;

    return (
      <div>
        <div className="feesallowed-table">
          <div className="fees-adddelete">
            <button type="button" className="addmorerow" onClick={this.props.onRowAdd} >
              <i className="fa fa-plus" aria-hidden="true"></i>Add More Row</button>
            <button type="button" className="deleterow" onClick={this.props.onRowDel}>
              <i className="fa fa-trash-o" aria-hidden="true"></i>Delete Row</button>
          </div>
          <div className="fees-verfytable">
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd">
                <div className="fee-tabls table-responsive1">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan="3">Amount</th>
                        <th colSpan="3">Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                        </td>
                        <td className="fbd">From</td>
                        <td className="fbd">To</td>
                        <td className="fbd">Fixed Amount(NGN)</td>
                        <td className="fbd">Percent(%)</td>
                      </tr>
                      {isEdit && <Fragment> {_map(percentageDTO, (feeDetail, i) => {
                        return (
                          page * perPage > i &&
                          (page - 1) * perPage <= i &&
                          <FeeDeatilsTableRow isEdit={isEdit} index={i} onProductTableUpdate={onProductTableUpdate}
                            feeDetail={feeDetail} key={feeDetail.percentageId} perOfCommissionError={perOfCommissionError}
                            fixAmtError={fixAmtError} toAmtError={toAmtError} fromAmtError={fromAmtError} />
                        )
                      })
                      } </Fragment>}
                      {!isEdit && <Fragment> {_map(percentageDTO, (feeDetail, i) => {
                        return (
                          <FeeDeatilsTableRow isEdit={isEdit} index={i} onProductTableUpdate={onProductTableUpdate}
                            feeDetail={feeDetail} key={feeDetail.percentageId} perOfCommissionError={perOfCommissionError}
                            fixAmtError={fixAmtError} toAmtError={toAmtError} fromAmtError={fromAmtError} />
                        )
                      })
                      } </Fragment>}
                    </tbody>
                  </table>
                </div>
                <div className="datatable-pagination">
                  {percentageDTO.length > 3 && isEdit &&
                    <Pagination
                      prevPageText='Previous'
                      nextPageText='Next'
                      hideFirstLastPages
                      activePage={page}
                      activeLinkClass='active'
                      linkClassPrev='active'
                      linkClassNext='active'
                      itemsCountPerPage={perPage}
                      totalItemsCount={percentageDTO.length}
                      onChange={(page) => handlePageChange(page)} />
                  }
                </div>
                <div className="note">
                  <p>Note :
                    <span>( If you enter 0 in the fixed or % Fee box. Then the no Fee will be charged. )</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
