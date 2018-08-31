import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import queryString from 'query-string'

class Login extends React.Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(location.search);
    this.state = {
      emailId: '',
      password: '',
      errors: {
        emailId: '',
        password: ''
      },
      emailIdvalid: false,
      passwordvalid: false,
      formValid: false,
      loading: false,
      twoFa: false,
      securedKey: '',
      verifyEmail: parsed.emailId

    }
    this.handleChange = this.handleChange.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
  }
  UNSAFE_componentWillMount() {
    if (this.state.verifyEmail) {
      let payLoad = {
        'emailId': this.state.verifyEmail
      }
      const api_url = base_url + 'userregister/activate';
      axios.post(api_url, payLoad).then(response => {
        if (response.status === 200) {
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
        }
      }).catch(function (error) {
        console.log(error)
      });
    }
  }
    otpChange = (e) => {
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({ securedKey: e.target.value })
      }
    }
    handleChange(event) {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({ [name]: value },
        () => { this.validateField(name, value) });
    }
    validateField(fieldName, value) {
      let fieldValidationErrors = this.state.errors;

      switch (fieldName) {
        case 'emailId':
          this.state.emailIdvalid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          fieldValidationErrors.emailId = this.state.emailIdvalid ? '' : 'Please enter valid email.';
          break;
        case 'password':
          this.state.passwordvalid = value.length >= 8;
          fieldValidationErrors.password = this.state.passwordvalid ? '' : 'Password must contain minimum 8 character.';
          break;
        default:
          break;
      }
      this.setState({ errors: fieldValidationErrors }, this.validateForm)
    }
    validateForm() {
      this.setState({
        formValid:
                this.state.emailIdvalid &&
                this.state.passwordvalid
      })
    }

    loginSubmit(e) {
      e.preventDefault();
      this.setState({ loading: true })
      const payLoad = {
        'emailId': this.state.emailId,
        'password': this.state.password
      }
      const api_url = base_url + 'login';
      axios.post(api_url, payLoad).then(response => {
        this.setState({ loading: false })
        console.log('OTP', response.data.securedKey)
        if (response.status === 200) {
          this.setState({ twoFa: true })
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
        }
      }).catch(function (error) {
        console.log(error)
      });
    }
    verifyOtp() {
      this.setState({ loading: true })
      const payLoad = {
        'emailId': this.state.emailId,
        'password': this.state.password,
        'securedKey': this.state.securedKey
      }
      const api_url = base_url + 'login/secure';
      axios.post(api_url, payLoad).then(response => {
        this.setState({ loading: false, twoFa: false, securedKey: '' })
        sessionStorage.setItem('loginInfo', JSON.stringify(response.data));
        if (response.status === 200) {
          if (response.data.loginInfo.role === 'User' && response.data.loginInfo.kycStatus === 'Rejected') {
            this.props.history.push('/kycupload')
          } else if (response.data.loginInfo.role === 'User' && (response.data.loginInfo.kycStatus === 'Approved' || response.data.loginInfo.kycStatus === 'Pending')) {
            this.props.history.push('/userdashboard')
          } else if (response.data.loginInfo.role === 'Admin') {
            this.props.history.push('/admindashboard')
          } else if (response.data.loginInfo.role === 'Superadmin') {
            this.props.history.push('/superadmin')
          }
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
        }
      }).catch(function (error) {
        console.log(error)
      });
    }

    render() {
      return (
        <div>
          <Notifications />
          <div className="login-wrapper">
            {
              this.state.loading && <div className="loaderBg">
                <div className="loaderimg">
                  <SyncLoader
                    color={'#0f99dd'}
                    loading={this.state.loading}
                  /></div>
              </div>
            }
            <div className="login-bg">
              <div className="login-logo">
                <div className="logo-div"></div>
                <h1>Login</h1>
              </div>

              <div className="login-form">
                <form onSubmit={this.loginSubmit}>
                  <div className="form-group">
                    <input type="text" name="emailId" value={this.state.emailId} onChange={this.handleChange} placeholder="Email" />
                    <span className="error">{this.state.errors.emailId}</span>
                  </div>
                  <div className="form-group">
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                    <span className="error">{this.state.errors.password}</span>
                  </div>
                  <div className="form-group text-right">
                    <NavLink className="forgpwd" to='/forgotpassword'>Forgot Password?</NavLink>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="loginbtn-submit green" disabled={!this.state.formValid} onClick={this.loginSubmit}>Login</button>
                  </div>
                  <p> Don&apos;t have an account?
                    <NavLink to={'/register'} > Register</NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* <!-- OTP Message --> */}

          {this.state.twoFa &&

                    <div className="fa-code-section">
                      <div className="fa-code-div">
                        <div className="fa-code-content">
                          <img src="src/public/image/email.png" width="100px;" />
                          <h1>Enter Your OTP</h1>
                          <p>Thanks for giving your details. An OTP has been sent to your Email. Please enter the OTP
                                    below for Successful Registration</p>
                          <form>
                            <input type="password" name="securedKey" value={this.state.securedKey} onChange={this.otpChange} placeholder="Enter your OTP number" required="" />
                          </form>
                          <button type="submit" onClick={this.verifyOtp} disabled={this.state.securedKey === ''} className="btn-verfy">Verify</button>
                          <button className="btn-close" onClick={() => { this.setState({ twoFa: false, securedKey: '' }); }}>&#x2716;</button>

                        </div>
                      </div>
                    </div>}
        </div>
      )
    }
}
export default Login;
