import React from 'react';
import FeeDeatilsTableRow from './tableRow';

export default class FeeDeatilsTable extends React.Component {
  render() {
    var onProductTableUpdate = this.props.onProductTableUpdate;
    var fixAmtError = this.props.fixAmtError;
    var toAmtError = this.props.toAmtError;
    var fromAmtError = this.props.fromAmtError;
    var perOfCommissionError = this.props.perOfCommissionError;
    var feeDetail = this.props.percentageDTO.map(function(feeDetail) {
      return (<FeeDeatilsTableRow onProductTableUpdate={onProductTableUpdate} feeDetail={feeDetail} key={feeDetail.id}
        perOfCommissionError={perOfCommissionError} fixAmtError={fixAmtError} toAmtError={toAmtError} fromAmtError={fromAmtError} />)
    });
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
                <div className="fee-tabls table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th colSpan="3">Amount</th>
                        <th colSpan="3">Fee</th>
                      </tr>

                    </thead>
                    <tbody>
                      <tr>
                        {/* TODO : need to integrate select all */}
                        <td>
                          {/* <input type="checkbox" /> */}
                        </td>
                        <td className="fbd">From</td>
                        <td className="fbd">To</td>
                        <td className="fbd">Fixed Amount(NGN)</td>
                        <td className="fbd">Percent(%)</td>
                      </tr>
                      {feeDetail}
                    </tbody>
                  </table>
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
