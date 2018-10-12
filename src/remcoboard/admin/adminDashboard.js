import React from 'react';
import Notifications, { notify } from 'react-notify-toast';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';

import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import AdminBox from '../common/dashComponents/adminBox';
import RecTrans from '../common/dashComponents/recTrans';
import Filter from '../common/components/Filter/filter';

class adminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      role: '',
      transList: [],
      tokenList: [],
      month: '',
      year: '',
      comList: '',
      comName: '',
      isLoading: false
    }
    /* eslint-disable */
    /*  prevent to go previous page (login) */
    if (sessionStorage.getItem('loginInfo') != null) {
      history.pushState(null, null, location.href);
      window.onpopstate = function (event) {
        history.go(0);
      };
    }

    // Check Authorised or Not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }
  }
  /* eslint-enable */

  logoutProps = () => {
    Logout.logout(this.props)
  }

  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }

  componentDidMount() {
    // API Request for dashboard values of administrator
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

    const com_url = base_url + 'admin/list/company/approved';
    this.setState({ isLoading: true });
    axios.get(com_url, {
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

  toggleRecentTransList = () => {
    // API request for recent transaction list of administrator
    const transUrl = base_url + 'admin/token/transaction/recent/list';
    this.setState({ isLoading: true });
    const payLoad = {
      'companyName': this.state.comName
    }
    axios.post(transUrl, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ transList: response.data.tokenDTO });
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

  render() {
    const { tokenList, transList, month, year, comName, comList, role, isLoading } = this.state;
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
              <AdminBox tokenList={tokenList} />
              <Filter month={month} year={year} selectedYear={this.selectedYear}
                toggleTokenList={this.toggleRecentTransList} comList={comList} comName={comName} isAdminDas />
              <RecTrans transList={transList} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default adminDashboard;
