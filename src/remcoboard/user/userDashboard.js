import React from 'react';
import axios from 'axios';
import Notifications, { notify } from 'react-notify-toast';

import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import RecTrans from '../common/dashComponents/recTrans';

class UserDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: '',
      token: '',
      tokenList: [],
      transList: []
    }
    /* eslint-disable */
    {/*  prevent to go previous page (login) */ }
    if (sessionStorage.getItem('loginInfo') != null) {
      history.pushState(null, null, location.href);
      window.onpopstate = function (event) {
        history.go(0);
      };
    }
    // Check authorized or not
    if (sessionStorage.getItem('loginInfo') == null) {
      props.history.push('/login');
    }
  }
  /* eslint-enable */

  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }
  componentDidMount() {
    const transUrl = base_url + 'admin/token/transaction/company/recent/list';
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
      }
    });
  }

  render() {
    const { tokenList, transList, role } = this.state;
    return (
      <div>
        <Notifications />
        <div className="cbp-spmenu-push">
          <SideMenu propsRole={role} />
          <HeaderCommon propsPush={this.props} />
          <div id="page-wrapper">
            <div className="main-page">
              <div className="superadmin-box">
                <div className="row">
                  <div className="col-lg-3 col-sm-6 col-xs-12 mobilepadd0">
                    <div className="user-boxlist">
                      <h1>Number of Tokens Generated (Total)</h1>
                      <div className="userbody">
                        <h2>{tokenList.totalNoOfTokens}</h2>
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default UserDashboard;
