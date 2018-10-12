import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';

class ForgetPasswordReset extends React.Component {
  constructor(props) {
    super(props)
    const parsed = queryString.parse(props.location.search);
    this.state = {
      resetInfo: '',
      formValid: false,
      password: '',
      confirmPassword: '',
      emailId: parsed.emailId,
      token: parsed.token,
      errors: { password: '', confirmPassword: '' },
      passwordValid: false,
      confirmPasswordValid: false,
      loading: false

    }
    this.handleChangePwd = this.handleChangePwd.bind(this);
    this.forgetPasswordReset = this.forgetPasswordReset.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.state.emailId && this.state.token) {
      let payLoad = {
        'emailId': this.state.emailId,
        'token': this.state.token
      }
      const forgetURL = base_url + 'forgot/password/linkVerification';
      axios.post(forgetURL, payLoad)
        .then(response => {
          if (response.status === 200) {
            this.setState({ resetInfo: response.data.linkVerificationInfo });
          } else if (response.status === 206) {
            this.props.history.push('/login');
            notify.show(response.data.message, 'error');
          }
        })
        .catch(function (error) {
          sessionStorage.removeItem('loginInfo');
          this.props.history.push('/login');
          notify.show(error.response.data.message, 'error')
        });
    }
  }

  handleChangePwd(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidateErrors = this.state.errors;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;
    if (this.state.password) {
      if (fieldName === 'password') {
        this.state.passwordValid = value.length >= 8 && value.match(/(?=.*[_!@#$%^&*-])(?=.*\d)(?!.*[.\n])(?=.*[a-z])(?=.*[A-Z])^.{8,}$/);
        fieldValidateErrors.password = this.state.passwordValid ? '' : 'Password must contain atleast one uppercase, one lowercase, one number, one special character and must contain minimum 8 character.';

        if (this.state.confirmPassword !== '') {
          if (value !== this.state.confirmPassword) {
            fieldValidateErrors.confirmPassword = "password doesn't match.";
          } else {
            fieldValidateErrors.confirmPassword = '';
          }
        }
      } else if (fieldName === 'confirmPassword') {
        if (value !== this.state.password) {
          fieldValidateErrors.confirmPassword = "password doesn't match.";
        } else {
          fieldValidateErrors.confirmPassword = '';
        }
      }
    }
    this.setState({
      errors: fieldValidateErrors,
      passwordValid: passwordValid,
      confirmPasswordValid: confirmPasswordValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({ formValid: this.state.password && this.state.confirmPassword });
  }

  forgetPasswordReset(event) {
    event.preventDefault();
    const payLoad = {
      emailId: this.state.resetInfo.emailId,
      token: this.state.resetInfo.token,
      newPassword: this.state.password,
      confirmPassword: this.state.confirmPassword
    }
    this.setState({ loading: true });
    const changePwd = base_url + 'forgot/setpassword';
    axios.post(changePwd, payLoad)
      .then(response => {
        this.setState({ loading: false });
        if (response.status === 200) {
          this.props.history.push('/login');
          notify.show(response.data.message, 'success');
        } else if (response.status === 206) {
          this.props.history.push('/login');
          notify.show(response.data.message, 'error');
        }
      }).catch(function (error) {
        sessionStorage.removeItem('loginInfo');
        this.props.history.push('/login');
        notify.show(error.response.data.message, 'error')
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
              <h1>Reset Password</h1>
            </div>
            <div className="login-form">
              <form onSubmit={this.forgetPasswordReset} >
                <div className="form-group">
                  <input type="password" placeholder="New Password" name="password" value={this.state.password} onChange={this.handleChangePwd} />
                  <span className="error">{this.state.errors.password}</span>
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Confirm Password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChangePwd} />
                  <span className="error">{this.state.errors.confirmPassword}</span>
                </div>
                <div className="form-group">
                  <button type="submit" className="loginbtn-submit green" disabled={!this.state.formValid}>Submit</button>
                </div>
                <NavLink className="forgpwd" to='/login'>Click here to Login</NavLink>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ForgetPasswordReset;
