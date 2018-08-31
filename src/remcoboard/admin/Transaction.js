import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustTableTransaction from '../common/custTableTransaction';
import CustSearch from '../common/custSearch';

export default class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionList: [],
      isLoading: false,
      page: 1
    };
  }

  componentDidMount() {
    const api_url = base_url + 'admin/token/transaction/list';
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
        this.setState({ transactionList: response.data.tokenDTO });
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

  tableHead = ['s.No', 'Type', 'Date', 'Amount', 'Partner’s Access Key', 'Partner’s Access Token',
    'Token Number', 'Value of the Token', 'Transaction Fees', 'Status'];

  render() {
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const { isLoading, transactionList, page } = this.state;
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
                <h1>Transaction List</h1>
              </div>
              <CustSearch tokenList={transactionList} tableHead={this.tableHead}
                page={page} perPage={2} isTransaction handlePageChange={this.handlePageChange} />
              {/* <CustTableTransaction tableHead={this.tableHead} tokenList={transactionList}
                  handlePageChange={this.handlePageChange} page={page} perPage={2} /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
