import React from 'react';
import Notifications from 'react-notify-toast';
import axios from 'axios';

import { base_url } from '../common/apiUrl';
import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import AdminBox from '../common/dashComponents/adminBox';
import RecTrans from '../common/dashComponents/recTrans';

class adminDashboard extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const roleId = sessionInfo.loginInfo.role;
    this.state = {
      role: roleId,
      token: sessionInfo.loginInfo.token,
      transList: [],
      tokenList: []
    }
    this.logoutProps = this.logoutProps.bind(this);
  }

  logoutProps() {
    Logout.logout(this.props)
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
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default adminDashboard;
