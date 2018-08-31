import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';

export default class TransFee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investorsList: [],
      page: 1
    };
  }

  componentDidMount() {
    const api_url = base_url + 'admin/transaction/fee';
    this.setState({ isLoading: true });
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    axios.get(api_url, {
      'headers': {
        'authToken': sessionInfo.loginInfo.token,
        'ownerType': sessionInfo.loginInfo.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ investorsList: response.data.investorDTO });
      } else if (response.status === 206 && response.data.message === 'Session expired') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      console.log('error props', this.props);
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, "error")
      }
    });
  }

  handlePageChange = (page) => {
    console.log('pageno', page)
    this.setState({ page })
  }

  tableHead = ['S.No', 'Date', 'Token Number', 'Remittance Company', 'City', 'IP Address', 'Fees Amount', 'Investor Percentage'];

  render() {
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const { isLoading, investorsList, page } = this.state;
    return (
      <div>
        {
          isLoading && <div className="loaderBg">
            <div className="loaderimg">
              <SyncLoader
                color={'#0f99dd'}
                loading={isLoading}
              /></div>
          </div>
        }
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={sessionInfo.loginInfo.role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Remittance Companies</h1>
              </div>
              <CustSearch tokenList={investorsList} tableHead={this.tableHead}
                page={page} perPage={2} isTransFee handlePageChange={this.handlePageChange} />
              {/* <div className="searchbox">
                  <div className="searchicon">
                    <input type="text" placeholder="Enter Your Search..."/>
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </div>
                </div>
                <div className="remittance-tabledetails">
                  <div className="table-details table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th className="text-center">S.No</th>
                          <th>Date</th>
                          <th>Token Number</th>
                          <th>Remittance Company</th>
                          <th>City</th>

                          <th>IP Address</th>
                          <th>Fees Amount</th>
                          <th className="text-center">Investor Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">1</td>
                          <td>18-07-2018</td>
                          <td className="text-center">848632007</td>
                          <td>Company Name</td>
                          <td>City Name</td>
                          <td>2001:4860:4860::8844</td>
                          <td className="text-center">100</td>
                          <td className="text-center">
                            <button type="button" className="btn-pend viewbtn" data-toggle="modal" data-target="#feesview" data-backdrop="static">View</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> */}
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
              {/* </div> */}
            </div>
          </div>
        </div>
        {/* <div className="transactionFeesPopup">
            <div className="modal fade" id="feesview" role="dialog">
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
                            <th>
                                            Investor type
                            </th>
                            <th>
                                            Percentage
                            </th>
                            <th>
                                            Amount
                            </th>
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
            </div>
          </div> */}
      </div>
    )
  }
}
