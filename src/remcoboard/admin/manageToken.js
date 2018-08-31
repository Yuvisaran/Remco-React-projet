import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
import CustTable from '../common/custTable';

export default class ManageToken extends Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    console.log(sessionInfo.loginInfo)
    this.state = {
      token: sessionInfo.loginInfo.token,
      role: sessionInfo.loginInfo.role,
      isLoading: false,
      page: 1,
      tokenList: []
    }
  }

  componentDidMount() {
    this.getManageTokenList();
  }

  handlePageChange = (page) => {
    console.log('pageno', page)
    this.setState({ page })
  }

  getManageTokenList = () => {
    const api_url = base_url + 'user/company/token/list';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ tokenList: response.data.tokenDTO });
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

  changeTokenStatus = (value, tokenNum) => {
    console.log('called managetokenstatus');
    console.log('called managetokenstatus', value, tokenNum);
    const api_url = base_url + 'user/token/active/inactive';
    let stat;
    if (value === 'Active') {
      stat = 1;
    } else stat = 0;
    console.log('valueeeeeeee', stat)
    const payLoad = {
      'tokenNumber': tokenNum,
      'activeOrInActive': stat
    }
    this.setState({ isLoading: true });
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        notify.show(response.data.message, 'success');
        this.getManageTokenList();
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

  tableHead = ['Controll No', 'Token Number', 'Serial Number', 'Token Address', 'Currency Type', 'Token Value', 'Token Balance', 'Status'];

  render() {
    console.log('manageToken state', this.state);
    const { role, tokenList, page } = this.state;
    return (
      <div>
        {
          this.state.isLoading && <div className="loaderBg">
            <div className="loaderimg">
              <SyncLoader
                color={'#0f99dd'}
                loading={this.state.isLoading}
              /></div>
          </div>
        }
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Manage Tokens</h1>
              </div>
              <CustSearch tokenList={tokenList} tableHead={this.tableHead} handlePageChange={this.handlePageChange}
                page={page} perPage={10} isManageToken changeTokenStatus={this.changeTokenStatus} />
              {/* <CustTable tokenList={tokenList} tableHead={this.tableHead} handlePageChange={this.handlePageChange}
                  page={page} perPage={10} isManageToken changeTokenStatus={this.changeTokenStatus} /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
