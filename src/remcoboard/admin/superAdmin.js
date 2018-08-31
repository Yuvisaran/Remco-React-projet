
import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import AdminBox from '../common/dashComponents/adminBox';
import RecTrans from '../common/dashComponents/recTrans';

class SuperAdmin extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const roleId = sessionInfo.loginInfo.role;
    console.log('sessionId', sessionInfo.loginInfo.sessionId)

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
    const { tokenList, transList } = this.state;
    return (
      <div>
        <Notifications />

        <div className="cbp-spmenu-push">
          <SideMenu propsRole={this.state.role} />
          <HeaderCommon />

          <div id="page-wrapper">
            <div className="main-page">
              <AdminBox tokenList={tokenList} />
              <RecTrans transList={transList} />
              {/* <div className="superadmin-box">
                <div className="row">
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bg2f3e9e">
                      <h1>{tokenList.noOfCompanies}</h1>
                      <p>Remittance Company</p>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bgd22e2e">
                      <h1>{tokenList.noOfPendingKYC}</h1>
                      <p>KYC Approval Pending</p>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bg00a651">
                      <h1>{tokenList.noofAdmins}</h1>
                      <p>Number of Admins</p>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bg00aeef">
                      <h1>{tokenList.noOfInvestors}</h1>
                      <p>Investors</p>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bg6d6e71">
                      <h1>${tokenList.commissionForMonth}</h1>
                      <p>Commission (For this Month)</p>
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-4 col-xs-12 mobilepadd0">
                    <div className="box-list6 bgf7941e">
                      <h1>$000</h1>
                      <p>Investor Due (For this Month)</p>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* <div className="recentTransaction">
                <div className="row">
                  <div className="col-lg-12 col-sm-12 col-xs-12 mobilepadd0">
                    <div className="transactionhistory">
                      <h1>Recent Transaction</h1>
                      <div className="table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th>Token Number</th>
                              <th className="text-center">Amount</th>
                              <th>type</th>
                              <th>Partner’s Access Key </th>
                              <th>Partner’s Access Token</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
                              <td>Apr 21, 2017
                                <span>8:34am</span>
                              </td>
                            </tr>
                            <tr>
                              <td>848632007</td>
                              <td className="text-center">50</td>
                              <td>Credit</td>
                              <td>C4hmnklQbc4IS8DSGFD</td>
                              <td>XIm9mdklQbc4IS8NJFS</td>
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
export default SuperAdmin;
