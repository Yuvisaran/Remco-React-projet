import React, { Fragment, Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import Select from 'react-select';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';
import _map from 'lodash/map';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
// import CustTable from '../common/custTable';

export default class ViewToken extends Component {
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
    const api_url = base_url + 'user/all/token/list';
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

  handlePageChange = (page) => {
    console.log('pageno', page)
    this.setState({ page })
  }

  tableHead = ['Controll No', 'Token Number', 'Serial Number', 'Token Address', 'Currency Type', 'Token Value', 'Token Balance', 'Status'];

  render() {
    console.log('ViewToken state', this.state);
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
                <h1>View Tokens</h1>
              </div>
              <CustSearch tokenList={tokenList} tableHead={this.tableHead}
                page={page} perPage={10} isViewToken handlePageChange={this.handlePageChange} />
              {/* <CustTable tokenList={tokenList} tableHead={this.tableHead}
                  page={1} perPage={10} isViewToken /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
