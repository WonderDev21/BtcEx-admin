import React, { Component, PropTypes } from 'react';
import { Icon } from 'semantic-ui-react';
import './Modal.scss';

class Modal extends Component {
  closeModal() {
    this.props.closeModal();
  }
  render() {
    return (
      <div className="Modal">
        <div className="overlay" onClick={this.closeModal.bind(this)} />
        <div className="content">
          <Icon
            name="remove"
            onClick={this.closeModal.bind(this)}
            className="close"
          />
          {this.props.children}
        </div>
      </div>
    );
  }
}
Modal.defaultProps = {
  closeModal: () => {},
};
Modal.propTypes = {
  closeModal: PropTypes.func,
};
export default Modal;
