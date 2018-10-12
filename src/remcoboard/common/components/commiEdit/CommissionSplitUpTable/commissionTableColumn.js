import React from 'react';
import _map from 'lodash/map';
import { notify } from 'react-notify-toast';
import axios from 'axios';

import { base_url } from '../../../apiUrl';

export default class CommissionTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      investorList: [],
      role: '',
      token: ''
    }
  }

  UNSAFE_componentWillMount() {
    if (sessionStorage.getItem('loginInfo') != null) {
      const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
      this.setState({ role: sessionInfo.loginInfo.role, token: sessionInfo.loginInfo.token });
    }
  }

  componentDidMount() {
    // API request for list investor
    const api_url = base_url + 'admin/list/investor';
    this.setState({ isLoading: true });
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      this.setState({ isLoading: false });
      if (response.status === 200) {
        this.setState({ investorList: response.data.investorList });
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
    return (
      <td>
        <input type={this.props.cellData.type} name={this.props.cellData.name}
          id={this.props.id} list={this.props.cellData.list}
          value={this.props.cellData.value} onChange={this.props.onProductTableUpdate} />
        {this.props.perOfInvestorError && <span className="error erropos"> {this.props.perOfInvestorError[this.props.cellData.id] || ''}</span>}
        {this.props.commissionEmailIdError && <span className="error erropos"> {this.props.commissionEmailIdError[this.props.cellData.id] || ''}</span>}
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
