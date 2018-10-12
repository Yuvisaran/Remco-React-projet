import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
import Filter from '../common/components/Filter/filter';

export default class ViewToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      role: '',
      isLoading: false,
      page: 1,
      tokenList: [],
      month: '',
      year: ''
    }
    // Check authorized or not
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

  selectedYear = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  toggleTokenList = () => {
    const api_url = base_url + 'user/company/token/list';
    this.setState({ isLoading: true });
    const payLoad = {
      'month': this.state.month,
      'year': this.state.year
    }
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ tokenList: response.data.tokenDTO });
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

  tableHead = ['Controll No', 'Token Number', 'Serial Number', 'Token Address', 'Currency Type',
    'Token Value', 'Token Balance', 'Status'];

  render() {
    const { role, tokenList, page, month, year } = this.state;
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
                <h1>View Tokens</h1>
              </div>
              <Filter month={month} year={year} selectedYear={this.selectedYear} toggleTokenList={this.toggleTokenList} />
              <CustSearch tokenList={tokenList} tableHead={this.tableHead}
                month={month} year={year} selectedYear={this.selectedYear} toggleTokenList={this.toggleTokenList}
                page={page} perPage={10} isViewToken handlePageChange={this.handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
