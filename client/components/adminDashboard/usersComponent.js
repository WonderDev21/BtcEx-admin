import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Icon, Table, Modal, Button } from 'semantic-ui-react';
import './common.scss';

const userComponent = ({
  admin,
  getUser,
  changeBank,
  bankKey,
  userDoc,
  handleEdit,
  closeUserDoc,
  search,
  handleSearch,
  editObject,
  onEnter,
  onSelect,
  onChange,
  handleBack,
  onSave,
  onChangeEdit,
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
          <span>name:</span>
          <input
            value={obj.fullName}
            onChange={e => onChangeEdit('fullName', e.target.value)}
          />
        </div>
        <div className="row">
          <span>email:</span>
          <input
            value={obj.email}
            onChange={e => onChangeEdit('email', e.target.value)}
          />
        </div>
        <div className="row">
          <span>phone:</span>
          <input
            value={obj.phone}
            onChange={e => onChangeEdit('phone', e.target.value)}
          />
        </div>
        <div className="row">
          <span>isVerified:</span>
          <select
            value={obj.isVerified.toString()}
            onChange={e => onChangeEdit('isVerified', e.target.value)}
          >
            <option value={Boolean(10 > 9)}>True</option>
            <option value={Boolean(9 > 10)}>False</option>
          </select>
        </div>
        <div className="row">
          <span>kycVerified:</span>
          <select
            value={obj.kycVerified}
            onChange={e => onChangeEdit('kycVerified', e.target.value)}
          >
            <option value="UNVERIFIED">UNVERIFIED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
          </select>
        </div>
      </div>
    </div>
  );
  const userData = () => (
    <div style={{ padding: '0.5em', marginTop: '2em' }}>
      <Table compact size="small" striped>
        <Table.Header>
          <Table.Row>
            {(admin.userAttr || []).map((ele, key) => (
              <Table.HeaderCell key={key}>{ele}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(admin.allUsers || []).map((ele, key) => (
            <Table.Row key={key}>
              <Table.Cell onClick={() => getUser(ele.userId)}>
                {ele.userId}
              </Table.Cell>
              <Table.Cell>{ele.fullName}</Table.Cell>
              <Table.Cell>{ele.email}</Table.Cell>
              <Table.Cell>{ele.phone}</Table.Cell>
              <Table.Cell>{ele.isVerified.toString()}</Table.Cell>
              <Table.Cell>{ele.kycVerified}</Table.Cell>
              <Table.Cell textAlign="center">
                <Button positive fluid icon onClick={() => handleEdit(ele)}>
                  <Icon name="edit" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal
        open={!_.isEmpty(userDoc.userId)}
        onClose={() => getUser(userDoc.userId)}
        closeIcon
        closeOnDimmerClick={false}
      >
        <Modal.Header>User KYC Information</Modal.Header>
        <Modal.Content image scrolling style={{ overflow: 'scroll' }}>
          <Table compact size="small">
            <Table.Body>
              {Object.keys(userDoc).map(k => (
                <Table.Row key={k}>
                  <Table.Cell>{k}</Table.Cell>
                  <Table.Cell>
                    <pre>{JSON.stringify(userDoc[k])}</pre>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    </div>
  );
  return (
    <div className="users-wrapper">
      <b className="active-item">{admin.activeItem}</b>
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
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="userId">UserId</option>
          <option value="kycVerified">KYC Status</option>
        </select>
      </div>
      {_.isEmpty(editObject) ? userData() : editMethod(editObject)}
    </div>
  );
};

export default userComponent;
