import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import './common.scss';

const orderComponent = ({
  admin,
  onRestart,
  handleEdit,
  search,
  handleSearch,
  editObject,
  onEnter,
  onSelect,
  onChange,
  handleBack,
  onSave,
  onChangeEdit,
  onCheckOrder,
  onUnCheckOrder,
}) => {
  const handleInputChange = e => {
    onChange(e.target.value);
  };
  const editMethod = obj => (
    <div className="edit-object">
      <div className="btns">
        <button className="back-btn" onClick={() => handleBack()}>
          Back
        </button>
        <button className="save-btn" onClick={() => onSave(admin.activeItem)}>
          Save
        </button>
      </div>
      <div className="form">
        <div className="row">
          <span>Side:</span>
          <input value={obj.side} readOnly />
        </div>
        <div className="row">
          <span>Currency:</span>
          <input value={obj.currency} readOnly />
        </div>
        <div className="row">
          <span>Price:</span>
          <input value={obj.price} readOnly />
        </div>
        <div className="row">
          <span>Current Size:</span>
          <input value={obj.currentSize} readOnly />
        </div>
        <div className="row">
          <span>Filled Size:</span>
          <input value={obj.filledSize} readOnly />
        </div>
        <div className="row">
          <span>Status:</span>
          <select
            value={obj.status}
            onChange={e => onChangeEdit('status', e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="TRADED">TRADED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>
    </div>
  );

  const orderData = () => (
    <div className="user-method">
      <div className="all-users">
        {(admin.orderAttr || []).map((ele, key) => (
          <div className="attribute" key={key}>
            <strong>{ele}</strong>
          </div>
        ))}
      </div>
      {(admin.allOrders || []).map((ele, key) => (
        <div style={{ position: 'relative' }} key={key}>
          <div className="users-data">
            <div className="attribute">{ele.orderId}</div>
            <div className="attribute">{ele.userId}</div>
            <div className="attribute">{ele.side}</div>
            <div className="attribute">{ele.currency}</div>
            <div className="attribute">{ele.price}</div>
            <div className="attribute">{ele.currentSize}</div>
            <div className="attribute">{ele.filledSize}</div>
            <div className="attribute">{ele.status}</div>
            <div className="attribute">
              {moment(ele.updatedAt).format('DD:MM HH:mm')}
            </div>
            {ele.status === 'PENDING' && (
              <div className="flex-col-rev">
                <Icon
                  circular
                  name="edit"
                  onClick={() => handleEdit(ele)}
                  className="edit-icon"
                />
                <input
                  type="checkbox"
                  onClick={e => {
                    console.log('Check value:', !ele.isCheck);
                    return !ele.isCheck
                      ? onCheckOrder(ele)
                      : onUnCheckOrder(ele);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="users-wrapper">
      <b className="active-item">{admin.activeItem}</b>
      <div>
        <p
          onClick={() => {
            onRestart();
          }}
        >
          Restart
        </p>
      </div>
      <div className="search-box">
        <div className="inp-wrapper">
          <input
            className=""
            value={search}
            type="search"
            onChange={handleInputChange}
            onKeyPress={onEnter}
            placeholder="Search"
          />
          <Icon name="search" onClick={handleSearch} />
        </div>
        <select onChange={onSelect}>
          <option value="">Search By</option>
          <option value="orderId">OrderId</option>
          <option value="userId">UserId</option>
        </select>
      </div>
      {_.isEmpty(editObject) ? orderData() : editMethod(editObject)}
    </div>
  );
};

export default orderComponent;
