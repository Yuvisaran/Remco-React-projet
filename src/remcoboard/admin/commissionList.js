import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';

export default class CommissionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionList: [],
      page: 1,
      commissionPage: 1,
      isViUp: false,
      isEdit: false,
      commissionItem: {},
      role: '',
      token: ''
    };
    // Check authorised or not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }
  }
  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }
  componentDidMount() {
    // API request for commission list
    const api_url = base_url + 'admin/list/commission';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ commissionList: response.data.commissionList });
      } else if (response.status === 206 && response.data.message === 'Page Session has expired. Please login again') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login')
        notify.show(response.data.message, 'error');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(error => {
      if (error.response.status === 401 && error.response.data.message === 'Auth token wrong') {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
      } else if (error.response.status === 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      } else {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
      }
    });
  }
  handlePageChange = (page) => {
    this.setState({ page })
  }
  handleCommissionPageChange = (commissionPage) => {
    this.setState({ commissionPage })
  }
  toggleViewUpdate = (commissionItem) => {
    sessionStorage.setItem('commissionInfo', JSON.stringify(commissionItem));
    this.props.history.push('/viewcommission');
  }
  toggleEditUpdate = (commissionItem) => {
    sessionStorage.setItem('commissionInfo', JSON.stringify(commissionItem));
    this.props.history.push('/editcommission');
  }
  tableHead = ['S.No', 'Company Name', 'Access Key', 'Access Token', 'Daily Transaction Limit', 'Action'];

  render() {
    const { isLoading, commissionList, page, isViUp, commissionItem, commissionPage, isEdit, role } = this.state;
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
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="dashboard-title">
                <h1>Commission List</h1>
              </div>
              <CustSearch tokenList={commissionList} tableHead={this.tableHead} toggleViewUpdate={this.toggleViewUpdate}
                page={page} perPage={10} isCommissionList handlePageChange={this.handlePageChange} toggleEditUpdate={this.toggleEditUpdate} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
