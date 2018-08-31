import React from 'react';
import axios from 'axios';
import { base_url } from '../common/apiUrl';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import Notifications, { notify } from 'react-notify-toast';

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      emailId: '',
      emailValid: false,
      formValid: false,
      Password: '',
      confirmPassword: '',
      errors: { Password: '', confirmPassword: '' },
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.forgetPasswordSubmit = this.forgetPasswordSubmit.bind(this);
  }

  handleChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.errors;

    switch (fieldName) {
      case 'emailId':
        this.state.emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.emailId = this.state.emailValid ? '' : 'Please enter valid emailId.';
        break;
      default:
        break;
    }
    this.setState({
      errors: fieldValidationErrors
    }, this.validateForm);
  }
  validateForm() {
    this.setState({ formValid: this.state.emailValid });
  }

  forgetPasswordSubmit(e) {
    e.preventDefault();
    let payLoad = {
      'emailId': this.state.emailId
    }
    this.setState({ loading: true });
    const api_url = base_url + 'forgot/password';
    axios.post(api_url, payLoad)
      .then(response => {
        this.setState({ loading: false });
        if (response.status === 200) {
          this.props.history.push('/login');
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          notify.show(response.data.message, 'error');
        }
      }).catch(error => {
        console.log(error);
        if (error.response.status == 401) {
          sessionStorage.removeItem('loginInfo');
          this.props.history.push('/login');
          notify.show(error.response.data.message, "error")
        }
      });
  }

  render() {
    // Forget Password
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
              <h1 className="text-center">Forgot Password</h1>
            </div>
            <div className="login-form">
              <form onSubmit={this.forgetPasswordSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Email Id" name="emailId" value={this.state.emailId} onChange={this.handleChange} />
                  <label className="error">
                    <div>{this.state.errors.emailId}</div>
                  </label>
                  <div className="form-group">
                    <button type="submit" className="loginbtn-submit green" disabled={!this.state.formValid}>Send</button>
                  </div>
                  <div className="form-group text-right">
                    <p>Click here to
                      <NavLink to={'/login'} > Login</NavLink>
                    </p>
                    {/* <NavLink className="clickHere" to='/login'>Click here to Login</NavLink> */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ForgetPassword;
