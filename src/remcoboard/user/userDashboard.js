import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';

import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import RecTrans from '../common/dashComponents/recTrans';

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    console.log(sessionInfo.loginInfo)
    const roleId = sessionInfo.loginInfo.role;
    this.state = {
      role: roleId,
      token: sessionInfo.loginInfo.token,
      tokenList: [],
      transList: []

    }
  }

  componentDidMount() {
    const transUrl = base_url + 'admin/token/transaction/recent/list';
    this.setState({ isLoading: true });
    axios.get(transUrl, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ transList: response.data.tokenDTO });
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

    const api_url = base_url + 'user/dashboard/values';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ tokenList: response.data.tokenDT });
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

  render() {
    console.log(this.props)
    const { tokenList, transList } = this.state;
    return (
      <div>
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={this.state.role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="superadmin-box">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-xs-12 mobilepadd0">
                    <div className="user-boxlist">
                      <h1>Number of Tokens Generated (Total)</h1>
                      <div className="userbody">
                        <h2>{tokenList.tokenListCount}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-xs-12 mobilepadd0">
                    <div className="user-boxlist userda534f">
                      <h1>Number of Tokens Generated (This month)</h1>
                      <div className="userbody">
                        <h2>{tokenList.monthlyTokenListCount}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-xs-12 mobilepadd0">
                    <div className="user-boxlist user418bca">
                      <h1>Number of Transaction (This month)</h1>
                      <div className="userbody">
                        <h2>{tokenList.monthlyTransactionListCount}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-xs-12 mobilepadd0">
                    <div className="user-boxlist user000000">
                      <h1>Remco Commission (For this month)</h1>
                      <div className="userbody">
                        <h2>{tokenList.remcoCommission}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <RecTrans transList={transList} isUser />
              {/* <div className="recentTransaction">
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-xs-12 mobilepadd">
                    <div className="transactionhistory">
                      <h1>Recent Transaction</h1>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Token Number</th>
                              <th className="text-center">Amount</th>
                              <th>type</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default UserDashboard;
