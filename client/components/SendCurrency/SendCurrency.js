import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';
import asyncActions from '../../actions/asyncActions';
import Modal from '../Modal/Modal';
import './SendCurrency.scss';

class SendCurrency extends Component {
  constructor() {
    super();
    this.state = {
      isModalOpen: false,
      data: {
        userid: '',
        currency: '',
        value: '',
        address: '',
      },
    };
  }

  onChange(field, e) {
    const that = this;
    that.setState({ data: { [field]: e.target.value } });
  }
  // onBlur() {
  //   const userId = this.state.data.userid;
  //   const accounts = this.props.admin.allAccounts;
  //   const obj = _.find(accounts, { userId });
  //   this.setState({ data: { address: obj.address } });
  // }
  // onUpdate() {
  //   const that = this;
  //   const { name, email, phone, role, street, city, pin, state } = that.state;
  //   that.props.dispatch(asyncActions.updateUser({ name, email, phone, role, street, city, pin, state }, that.props.auth.id))
  //   .then(response => _.get(response.payload, 'id', '') === that.props.auth.id ? that.closeModal() : ''); // if it is not so, set update error
  // }
  flipModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  render() {
    const that = this;
    const { userid, currency, value, address } = that.state.data;
    return (
      <div className="sendCurrency-wrapper">
        <Icon
          circular
          name="edit"
          onClick={that.flipModal.bind(that)}
          className="edit-icon"
        />
        {that.state.isModalOpen && (
          <Modal closeModal={that.flipModal.bind(that)}>
            <div className="form">
              <div className="data-row">
                <div className="input-container">
                  <span>CustomerID</span>
                  <span />
                </div>
                <div className="input-container">
                  <span>Address</span>
                  <span />
                </div>
                <div className="input-container">
                  <span>Currency</span>
                  <span />
                </div>
                <div className="input-container">
                  <span>Amount</span>
                  <input
                    value={value}
                    type="text"
                    onChange={that.onChange.bind(that, 'value')}
                  />
                </div>
                <button type="button" className="next-btn pt-button">
                  SEND
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
SendCurrency.defaultProps = {
  admin: {},
};
const select = state => ({ admin: state.adminReducer });
export default connect(select)(SendCurrency);
