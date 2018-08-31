import React, { Component } from 'react';
import axios from 'axios';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

import SideMenu from '../common/sideMenu';
import HeaderCommon from '../common/header';
import { base_url } from '../common/apiUrl';
import CustSearch from '../common/custSearch';
import CommiViewUpdate from '../common/components/commissionViewUpdate';
import Commission from '../admin/commission';

export default class CommissionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commissionList: [],
      page: 1,
      commissionPage: 1,
      isViUp: false,
      commissionItem: {}
    };
  }

  componentDidMount() {
    const api_url = base_url + 'admin/list/commission';
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
        this.setState({ commissionList: response.data.commissionList });
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
  handleCommissionPageChange = (commissionPage) => {
    console.log('pageno', commissionPage)
    this.setState({ commissionPage })
  }
  toggleViewUpdate = (commissionItem) => {
    console.log('toggleViUp clicked', commissionItem)
    this.setState({ isViUp: !this.state.isViUp, commissionItem });
  }
  toggleEditUpdate = (commissionItem) => {
    console.log('toggleeditupdate clicked', commissionItem);
    this.props.history.push('/commission', commissionItem);
    // <Commission commissionItem={commissionItem} />
  }
  tableHead = ['S.No', 'Company Name', 'Access Key', 'Access Token', 'Daily Transaction Limit', 'Action'];

  render() {
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const { isLoading, commissionList, page, isViUp, commissionItem, commissionPage } = this.state;
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
                <h1>Commission List</h1>
              </div>
              <CustSearch tokenList={commissionList} tableHead={this.tableHead} toggleViewUpdate={this.toggleViewUpdate}
                page={page} perPage={2} isCommissionList handlePageChange={this.handlePageChange} toggleEditUpdate={this.toggleEditUpdate} />
            </div>
          </div>
        </div>
        {isViUp && <CommiViewUpdate handlePageChange={this.handlePageChange} handleCommissionPageChange={this.handleCommissionPageChange}
          commissionPage={commissionPage} page={page} toggleViewUpdate={this.toggleViewUpdate} commissionDetails={commissionItem} />}
      </div>
    )
  }
}
