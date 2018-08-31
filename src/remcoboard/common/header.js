import React from 'react';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import axios from 'axios';
import validator from 'validator';

class HeaderCommon extends React.Component {
  constructor(props) {
    super(props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    this.state = {
      token: sessionInfo.loginInfo.token,
      role: sessionInfo.loginInfo.role,
      isResetPwd: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      errors: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      oldPasswordvalid: false,
      newPasswordvalid: false,
      confirmPasswordvalid: false,
      formValid: false,
      loading: false
    }
    this.logout = this.logout.bind(this);
    this.clickResetPassword = this.clickResetPassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }
  logout(props) {
    console.log('props values', this.props);
    console.log('props values', props);
    const sessionInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    const api_url = base_url + 'user/logout';
    axios.get(api_url, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      if (response.data.status === 'Success') {
        sessionStorage.removeItem('loginInfo');
        this.props.propsPush.history.push('/login');
        notify.show(response.data.message, 'success')
      } else if (response.data.status === 'Failure') {
        sessionStorage.removeItem('loginInfo');
        this.props.propsPush.history.push('/login');
        notify.show(response.data.message, 'error')
      }
    }).catch(error => {
      console.log('error props', this.props);
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.propsPush.history.push('/login');
        notify.show(error.response.data.message, "error")
      }
    });
  }

  clickResetPassword(event) {
    event.preventDefault();
    const payLoad = {
      'oldPassword': this.state.oldPassword,
      'newPassword': this.state.newPassword,
      'confirmPassword': this.state.confirmPassword
    }
    const api_url = base_url + 'user/update/password';
    axios.post(api_url, payLoad, {
      'headers': {
        'authToken': this.state.token,
        'ownerType': this.state.role
      }
    }).then(response => {
      if (response.data.status === 'Success') {
        sessionStorage.removeItem('loginInfo');
        this.props.propsPush.history.push('/login');
        notify.show(response.data.message, 'success')
      } else if (response.data.status === 'Failure') {
        notify.show(response.data.message, 'error')
      }
    }).catch(error => {
      console.log('error props', this.props);
      if (error.response.status == 401) {
        sessionStorage.removeItem('loginInfo');
        this.props.propsPush.history.push('/login');
        notify.show(error.response.data.message, "error")
      }
    });
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value }, () => { this.validateField(name, value) });
  }
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;

    switch (fieldName) {
      case 'oldPassword':
        this.state.passwordvalid = value.length >= 8;
        fieldValidationErrors.password = this.state.passwordvalid ? '' : 'Password must contain minimum 8 character.';
        break;
      case 'newPassword':
        this.state.newPasswordvalid = value.length >= 8 && value.match(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/);
        fieldValidationErrors.newPassword = this.state.newPasswordvalid ? '' : 'Password must contain atleast one uppercase, one lowercase, one number, one special character and must contain minimum 8 character.';
        break;
      case 'confirmPassword':
        this.state.confirmPasswordvalid = validator.equals(value, this.state.newPassword);
        fieldValidationErrors.confirmPassword = this.state.confirmPasswordvalid ? '' : 'Password does not match.';
        break;

      default:
        break;
    }
    if (fieldName === 'newPassword') {
      if (this.state.confirmPassword !== '') {
        if (value !== this.state.confirmPassword) {
          fieldValidationErrors.confirmPassword = 'Password does not match.';
        } else {
          fieldValidationErrors.confirmPassword = '';
        }
      }
    } else if (fieldName === 'confirmPassword') {
      if (value !== this.state.newPassword) {
        fieldValidationErrors.confirmPassword = 'Password does not match.';
      } else {
        fieldValidationErrors.confirmPassword = '';
      }
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }
  validateForm() {
    this.setState({
      formValid:
        this.state.oldPasswordvalid &&
        this.state.newPasswordvalid &&
        this.state.confirmPasswordvalid
    })
  }

  render() {
    return (
      <div>
        <Notifications />
        <div className="sticky-header header-section ">
          <div className="header-left">
            <button id="showLeftPush">
              <i className="fa fa-bars"></i>
            </button>
            <div className="logo">
              <a href="javascript:void(0);">
                <div className="dashboardlogo"></div>
              </a>
            </div>

            <div className="clearfix"> </div>
          </div>
          <div className="header-right">
            <div className="profile_details">
              <ul>
                <li className="dropdown profile_details_drop">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <div className="profile_img">
                      <span className="prfil-img">
                        <img src="src/public/image/profile.png" alt="profile" /> </span>
                      <div className="user-name">
                        <p>Pat M</p>
                        <span>Administrator</span>
                      </div>
                      <i className="fa fa-angle-down lnr"></i>
                      <i className="fa fa-angle-up lnr"></i>
                      <div className="clearfix"></div>
                    </div>
                  </a>
                  <ul className="dropdown-menu drp-mnu">
                    <li>
                      <a onClick={() => { this.setState({ isResetPwd: true }) }}>
                        <i className="fa fa-unlock-alt"></i> Reset Password</a>
                    </li>
                    <li>
                      <a onClick={this.logout}>
                        <i className="fa fa-sign-out"></i> Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="clearfix"> </div>
          </div>
          <div className="clearfix"> </div>
        </div>
        {this.state.isResetPwd && <div className="loaderBg">
          <div className="loaderimg">
            <div className="login-wrapper">
              <div className="login-bg">
                <div className="login-logo">
                  <div className="logo-div"></div>
                  <h1>Reset Password</h1>
                </div>
                <div className="login-form">
                  <form onSubmit={this.clickResetPassword}>
                    <div className="form-group">
                      <input type="password" name='oldPassword' value={this.state.oldPassword} onChange={this.handleChange} placeholder="Old Password" />
                      <span className="error">{this.state.errors.oldPassword}</span>
                    </div>
                    <div className="form-group">
                      <input type="password" name='newPassword' value={this.state.newPassword} onChange={this.handleChange} placeholder="New Password" />
                      <span className="error">{this.state.errors.newPassword}</span>
                    </div>
                    <div className="form-group">
                      <input type="password" name='confirmPassword' value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" />
                      <span className="error">{this.state.errors.confirmPassword}</span>
                    </div>
                    <div className="form-group">
                      <button type="submit" disabled={this.state.oldPassword === '' || this.state.newPassword === '' || this.state.confirmPassword === ''} className="loginbtn-submit green">Save</button>
                      <button type="button" className="loginbtn-submit green" onClick={() => this.setState({ isResetPwd: false })} >Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
export default HeaderCommon;
