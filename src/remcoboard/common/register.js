
import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { base_url } from '../common/apiUrl';
import Notifications, { notify } from 'react-notify-toast';
import validator from 'validator';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: '',
      ownerName: '',
      mobileNo: '',
      emailId: '',
      password: '',
      confirmPassword: '',
      errors: {
        companyName: '',
        ownerName: '',
        mobileNo: '',
        emailId: '',
        password: '',
        confirmPassword: ''
      },
      companyNamevalid: false,
      ownerNamevalid: false,
      mobileNovalid: false,
      emailIdvalid: false,
      passwordvalid: false,
      confirmPasswordvalid: false,
      formValid: false,
      loading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.registerSubmit = this.registerSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
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
      case 'companyName':
        this.state.companyNamevalid = !validator.isEmpty(value);
        // this.state.companyNamevalid = validator.isAlpha(value, ['en-US']);
        fieldValidationErrors.companyName = this.state.companyNamevalid ? '' : 'Please enter company name.';
        break;
      case 'ownerName':
        this.state.ownerNamevalid = !validator.isEmpty(value);
        // this.state.ownerNamevalid = validator.isAlpha(value, ['en-US']);
        fieldValidationErrors.ownerName = this.state.ownerNamevalid ? '' : 'Please enter company name.';
        break;
      case 'mobileNo':
        this.state.mobileNovalid = validator.isNumeric(value) && validator.isLength(value, 5, 20);
        fieldValidationErrors.mobileNo = this.state.mobileNovalid ? '' : 'Valid international mobile number length is 5 to 20.';
        break;
      case 'emailId':
        this.state.emailIdvalid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.emailId = this.state.emailIdvalid ? '' : 'Please enter valid email.';
        break;
      case 'password':
        this.state.passwordvalid = value.length >= 8 && value.match(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/);
        fieldValidationErrors.password = this.state.passwordvalid ? '' : 'Password must contain atleast one uppercase, one lowercase, one number, one special character and must contain minimum 8 character.';
        break;
      case 'confirmPassword':
        this.state.confirmPasswordvalid = validator.equals(value, this.state.password);
        fieldValidationErrors.confirmPassword = this.state.confirmPasswordvalid ? '' : 'Password does not match.';
        break;

      default:
        break;
    }
    if (fieldName === 'password') {
      if (this.state.confirmPassword !== '') {
        if (value !== this.state.confirmPassword) {
          fieldValidationErrors.confirmPassword = 'Password does not match.';
        } else {
          fieldValidationErrors.confirmPassword = '';
        }
      }
    } else if (fieldName === 'confirmPassword') {
      if (value !== this.state.password) {
        fieldValidationErrors.confirmPassword = 'Password does not match.';
      } else {
        fieldValidationErrors.confirmPassword = '';
      }
    }
    this.setState({ errors: fieldValidationErrors }, this.validateForm)
  }
  validateForm() {
    this.setState({
      formValid: this.state.companyNamevalid &&
                this.state.mobileNovalid &&
                this.state.emailIdvalid &&
                this.state.passwordvalid &&
                this.state.confirmPasswordvalid
    })
  }

  registerSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true })
    const payLoad = {
      'companyName': this.state.companyName,
      'ownerName': this.state.ownerName,
      'mobileNo': this.state.mobileNo,
      'emailId': this.state.emailId,
      'password': this.state.password,
      'confirmPassword': this.state.confirmPassword
    }
    const api_url = base_url + 'register';
    axios.post(api_url, payLoad).then(response => {
      this.setState({ loading: false })
      console.log(response)
      if (response.status === 200) {
        this.setState({
          companyName: '',
          ownerName: '',
          mobileNo: '',
          emailId: '',
          password: '',
          confirmPassword: ''
        })
        this.props.history.push('/login');
        notify.show(response.data.message, 'success');
      } else if (response.status === 206) {
        notify.show(response.data.message, 'error');
      }
    }).catch(function (error) {
      console.log(error)
    });
  }
  render() {
    console.log(this.state.formValid)
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
              <h1>Register</h1>
            </div>

            <div className="login-form">
              <form onSubmit={this.registerSubmit}>
                <div className="form-group">
                  <input type="text" name="companyName" value={this.state.companyName} onChange={this.handleChange} placeholder="Name of Company" />
                  <span className="error">{this.state.errors.companyName}</span>
                </div>
                <div className="form-group">
                  <input type="text" name="ownerName" value={this.state.ownerName} onChange={this.handleChange} placeholder="Full Name" />
                  <span className="error">{this.state.errors.ownerName}</span>
                </div>
                <div className="form-group">
                  <input type="text" name="mobileNo" value={this.state.mobileNo} onChange={this.handleChange} placeholder="Phone" />
                  <span className="error">{this.state.errors.mobileNo}</span>
                </div>
                <div className="form-group">
                  <input type="text" name="emailId" value={this.state.emailId} onChange={this.handleChange} placeholder="Email" />
                  <span className="error">{this.state.errors.emailId}</span>
                </div>
                <div className="form-group">
                  <input type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                  <span className="error">{this.state.errors.password}</span>
                </div>
                <div className="form-group">
                  <input type="password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm Password" />
                  <span className="error">{this.state.errors.confirmPassword}</span>
                </div>
                <div className="form-group">
                  <button type="submit" className="loginbtn-submit green" disabled={!this.state.formValid}>Register</button>
                </div>
                <p>Already have an account?
                  <NavLink to={'/login'} > Login</NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Register;
