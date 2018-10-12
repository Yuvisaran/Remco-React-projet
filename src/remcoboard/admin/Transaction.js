import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
import Filter from '../common/components/Filter/filter';

export default class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionList: [],
      isLoading: false,
      page: 1,
      role: '',
      token: '',
      month: '',
      year: '',
      comList: '',
      comName: ''
    };
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

  componentDidMount() {
    const api_url = base_url + 'admin/list/company/approved';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ comList: response.data.kycList });
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

  selectedYear = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  handlePageChange = (page) => {
    this.setState({ page })
  }

  toggleTransactionList = () => {
    // API request for transaction list
    const api_url = base_url + 'admin/token/transaction/list';
    this.setState({ isLoading: true });
    const payLoad = {
      'companyName': this.state.comName,
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
        this.setState({ transactionList: response.data.tokenDTO });
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

  tableHead = ['S.No', 'Type', 'Date', 'Amount', 'Currency Type', 'Partner’s Access Key', 'Partner’s Access Token',
    'Token Number', 'Value of the Token', 'Transaction Fees', 'Status'];

  render() {
    const { isLoading, transactionList, page, role, month, year, comName, comList } = this.state;
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
                <h1>Transaction List</h1>
              </div>
              <Filter month={month} year={year} selectedYear={this.selectedYear} toggleTokenList={this.toggleTransactionList}
                comList={comList} comName={comName} isAdmin />
              <CustSearch tokenList={transactionList} tableHead={this.tableHead}
                month={month} year={year} selectedYear={this.selectedYear} toggleTokenList={this.toggleTransactionList}
                comList={comList} comName={comName} isAdmin
                page={page} perPage={10} isTransaction handlePageChange={this.handlePageChange} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
