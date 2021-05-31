import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import './LoginSignup.scss';
import asyncActions from '../actions/asyncActions';

class LoginSingup extends Component {
  constructor() {
    super();
    this.state = {
      login: true,
      fullName: '',
      email: '',
      password: '',
      phone: '',
      OTP: '',
      islogInSucess: false,
    };
  }
  flip() {
    this.setState({ login: !this.state.login });
  }
  onChange(field, e) {
    const that = this;
    const value = e.target.value;
    that.setState({ [field]: value });
  }

  onOTPSubmit() {
    console.log(this.state.OTP);
    this.props
      .dispatch(asyncActions.loginOTP({ otp: this.state.OTP }))
      .then(payload => {
        if (payload.status === 200) {
          console.log('OTP Reponse Sucess: ');
          this.props.dispatch(push('/admin'));
        } else {
          console.log('OTP Reponse Failed: ');
          this.props.dispatch(push('/login'));
        }
      })
      .catch(err => {
        console.log('Login Failed', err);
      });
  }

  onLoginSignup() {
    const { fullName, email, password, phone } = this.state;
    const captcha = document.querySelector('#g-recaptcha-response').value;
    if (!captcha) {
      alert('Please verify that you are human!');
      return;
    }
    if (this.state.login) {
      this.props
        .dispatch(asyncActions.login({ email, password, captcha }))
        .then(payload => {
          //  const data = payload.data;
          console.log('LogIn response : ', payload);
          if (payload.status === 200) {
            this.setState({ islogInSucess: true });
          } else {
            console.log('Response Error: ');
          }
          // if (data.isAdmin) this.props.dispatch(push('/admin'));
        })
        .catch(err => {
          console.log('Login Error', err);
        });
    } else {
      this.props
        .dispatch(
          asyncActions.signup({
            fullName,
            email,
            password,
            phone,
            captcha,
            isAdmin: true,
          })
        )
        .then(payload => {
          if (payload.status === 200) {
            window.alert('Signup success, Login to continue');
            this.setState({
              login: true,
              fullName: '',
              password: '',
              phone: '',
            });
          }
          // const data = payload.data;
          // if (data.isAdmin) this.props.dispatch(push('/admin'));
        });
    }
  }
  render() {
    const that = this;
    const { login, fullName, email, password, phone, OTP } = that.state;
    return (
      <div className="login-wrapper">
        <div className="modules">
          <div className="middle">
            <div className="title">
              <b
                className={login ? 'active' : ''}
                onClick={that.flip.bind(that)}
              >
                LOGIN
              </b>
              <b
                className={!login ? 'active' : ''}
                onClick={that.flip.bind(that)}
              >
                SIGNUP
              </b>
            </div>
            {this.state.islogInSucess ? (
              <div className="form">
                <p>OTP</p>
                <input
                  value={OTP}
                  type="text"
                  onChange={that.onChange.bind(that, 'OTP')}
                  placeholder="OTP"
                />
                <button onClick={that.onOTPSubmit.bind(that)}>SUBMIT</button>
              </div>
            ) : (
              <div className="form">
                {!login ? (
                  <input
                    value={fullName}
                    type="text"
                    onChange={that.onChange.bind(that, 'fullName')}
                    placeholder="name"
                  />
                ) : (
                  ''
                )}
                <input
                  value={email}
                  type="text"
                  onChange={that.onChange.bind(that, 'email')}
                  placeholder="email"
                />
                <div
                  id="login-captcha"
                  className="g-recaptcha"
                  data-sitekey={process.env.RECAPTCHA_SITE_KEY}
                />
                <br />
                <input
                  value={password}
                  type="password"
                  onChange={that.onChange.bind(that, 'password')}
                  placeholder="password"
                />
                {!login && (
                  <input
                    value={phone}
                    type="text"
                    onChange={that.onChange.bind(that, 'phone')}
                    placeholder="phone"
                  />
                )}
                <button onClick={that.onLoginSignup.bind(that)}>
                  {login ? 'LOG IN' : 'SIGN UP'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
LoginSingup.defaultProps = {
  dispatch: () => {},
};
LoginSingup.propTypes = {
  dispatch: PropTypes.func,
};
const select = state => ({ state });
export default connect(select)(LoginSingup);
