import React from 'react';
import _map from 'lodash/map';
import Notifications, { notify } from 'react-notify-toast';
import axios from 'axios';

import { base_url } from '../../../apiUrl';

export default class CommissionTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investorList: []
    }
  }
  componentDidMount() {
    const api_url = base_url + 'admin/list/investor';
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
        this.setState({ investorList: response.data.investorList });
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
    console.log('this.props.invest', this.props.perOfInvestorError);
    return (
      <td>
        <input type={this.props.cellData.type} name={this.props.cellData.name}
          id={this.props.cellData.id} list={this.props.cellData.list} placeholder={this.props.cellData.placeHolder}
          value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} />
        {this.props.perOfInvestorError && <span className="error"> {this.props.perOfInvestorError[this.props.cellData.id] || ''}</span>}
        {this.props.commissionEmailIdError && <span className="error"> {this.props.commissionEmailIdError[this.props.cellData.id] || ''}</span>}
        {this.props.cellData.name == 'emailId' && <datalist id="investors">
          {_map(this.state.investorList,
            (items, i) => (
              <option key={i} value={items.emailId} />
            ))}
        </datalist>}
      </td>
    );
  }
}
