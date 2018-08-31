import React, { Fragment } from 'react';
import CommissionTableRow from './commissionTableRow';

export default class CommissionTableHead extends React.Component {
  render() {
    const { investorList } = this.props;
    var onProductTableUpdate = this.props.onProductTableUpdate;
    var perOfInvestorError = this.props.perOfInvestorError;
    var commissionEmailIdError = this.props.commissionEmailIdError;
    var commissionDetail = this.props.vTNCommissionDTO.map(function (commissionDetail) {
      return (<CommissionTableRow onProductTableUpdate={onProductTableUpdate} investorList={investorList} commissionEmailIdError={commissionEmailIdError}
        commissionDetail={commissionDetail} key={commissionDetail.id} perOfInvestorError={perOfInvestorError} />)
    });
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
                      {commissionDetail}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="datatable-pagination">
                                    <ul className="pagination">
                                      <li>
                                        <a className="pagelink" href="javascript:void(0);">Previous</a>
                                      </li>
                                      <li>
                                        <a className="active" href="javascript:void(0);">1</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0);">1</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0);">2</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0);">3</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0);">4</a>
                                      </li>
                                      <li>
                                        <a href="javascript:void(0);">5</a>
                                      </li>
                                      <li>
                                        <a className="pagelink" href="javascript:void(0);">Next</a>
                                      </li>
                                    </ul>
                                  </div> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
