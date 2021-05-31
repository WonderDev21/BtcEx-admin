import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Icon, Table, Button, Select, Input } from 'semantic-ui-react';
import AppConstants from '../../constants/AppConstants';
import './common.scss';

const filterOptions = [
  { key: 'userId', value: 'userId', text: 'UserId' },
  { key: 'id', value: 'id', text: 'Account Id' },
];

const accountComponent = ({
  admin,
  handleEdit,
  search,
  handleSearch,
  getNewAddress,
  editObject,
  onEnter,
  onSelect,
  onChange,
  handleBack,
  onSave,
  onChangeEdit,
  handleSelectFilter,
  handleAccountSearch,
  handleInputChange,
  filterValue,
  selectedFilter,
  handleResetFilter,
}) => {
  // const handleInputChange = e => {
  //   onChange(e.target.value);
  // };

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
          <label>Name:</label>
          <span>{obj.user.fullName}</span>
        </div>
        <div className="row">
          <label>UserId:</label>
          <span>{obj.user.userId}</span>
        </div>
        <div className="row">
          <span>currency:</span>
          <span>{obj.currency}</span>
        </div>
        <div className="row">
          <span>value:</span>
          <span>{obj.value}</span>
          <input
            value={obj.updateBalance}
            placeholder="Enter amount"
            onChange={e => onChangeEdit('updateBalance', e.target.value)}
            style={{ marginRight: '8px' }}
          />
          <select
            value={obj.updateMode}
            onChange={e => onChangeEdit('updateMode', e.target.value)}
          >
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>
        {obj.currency === 'XRP' && (
          <div className="row">
            <span>Tag:&nbsp;</span>
            <span>{obj.keyObject.tag}</span>
          </div>
        )}
        {obj.currency === AppConstants.baseCurrency ? (
          <div className="row">Bank account details:</div>
        ) : (
          <div className="row">
            <span>Address:&nbsp;</span>
            <span>{obj.address}</span>
          </div>
        )}
        {obj.currency === 'MIOTA' && (
          <div>
            <strong>KEY: {obj.keyObject.key}</strong>
            <br />
            <Button
              onClick={() =>
                getNewAddress(
                  _.assign({}, obj, {
                    key: obj.keyObject.key,
                    type: 'INCREMENT',
                  })
                )
              }
            >
              Next Address
            </Button>
            <Button
              onClick={() =>
                getNewAddress(
                  _.assign({}, obj, {
                    key: obj.keyObject.key,
                    type: 'DECREMENT',
                  })
                )
              }
            >
              Previous Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const accountData = () => (
    <div style={{ padding: '0.5em', marginTop: '2em' }}>
      <Table compact size="small" striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}>Name</Table.HeaderCell>
            <Table.HeaderCell width={1}>Currency</Table.HeaderCell>
            <Table.HeaderCell width={2}>Value</Table.HeaderCell>
            <Table.HeaderCell width={2}>AccountID</Table.HeaderCell>
            <Table.HeaderCell width={3}>UserID</Table.HeaderCell>
            <Table.HeaderCell width={3}>Address</Table.HeaderCell>
            <Table.HeaderCell width={2}>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body style={{ overflow: 'scroll' }}>
          {(admin.allAccounts || []).map((ele, key) => (
            <Table.Row key={key}>
              <Table.Cell>{_.get(ele, 'user.fullName', '')}</Table.Cell>
              <Table.Cell>{ele.currency}</Table.Cell>
              <Table.Cell>{ele.value}</Table.Cell>
              <Table.Cell>{ele.id}</Table.Cell>
              <Table.Cell>{ele.userId}</Table.Cell>
              <Table.Cell>{ele.address}</Table.Cell>
              <Table.Cell textAlign="center">
                <Button positive fluid icon onClick={() => handleEdit(ele)}>
                  <Icon name="edit" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  return (
    <div className="users-wrapper">
      <b className="active-item">{admin.activeItem}</b>
      <div className="search-box">
        {/* <div className="inp-wrapper">
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
          <option value="objectId">ObjectId</option>
          <option value="userId">UserId</option>
        </select> */}
        <Select
          placeholder="Search By"
          options={filterOptions}
          onChange={handleSelectFilter}
          value={selectedFilter}
        />
        &nbsp;
        <Input
          placeholder="Enter search value"
          onChange={handleInputChange}
          value={filterValue}
        />
        &nbsp;
        <Button primary onClick={handleAccountSearch}>
          Search
          {/* {this.state.filterLoader ? <Icon loading name="spinner" /> : null} */}
        </Button>
        &nbsp;
        <Button color="red" onClick={handleResetFilter}>
          Reset
        </Button>
      </div>
      {_.isEmpty(editObject) ? accountData() : editMethod(editObject)}
    </div>
  );
};

export default accountComponent;
