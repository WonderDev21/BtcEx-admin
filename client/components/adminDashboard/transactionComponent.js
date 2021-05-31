import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import isJSON from 'validator/lib/isJSON';
import { Controlled as CodeMirror } from 'react-codemirror2';
import {
  Icon,
  Table,
  Form,
  Dropdown,
  Button,
  Select,
  Input,
} from 'semantic-ui-react';
// import SendCurrency from '../SendCurrency/SendCurrency';
import './common.scss';

const filterOptions = [
  { key: 'userId', value: 'userId', text: 'UserId' },
  { key: 'transactionId', value: 'transactionId', text: 'Transaction Id' },
  { key: 'customerId', value: 'customerId', text: 'Customer Id' },
];

const transactionComponent = ({
  admin,
  handleSearch,
  onEnter,
  onSelect,
  onChange,
  state,
  onTransXAmtChange,
  handleEdit,
  editObject,
  onChangeEdit,
  handleBack,
  onSave,
  handleSelectFilter,
  handleTransactionSearch,
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
      <Form>
        <Form.Group style={{ float: 'right' }}>
          <Form.Button error onClick={() => handleBack()}>
            Back
          </Form.Button>
          <Form.Button primary onClick={() => onSave(admin.activeItem)}>
            Save
          </Form.Button>
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Customer ID</label>
            <span>{obj.customerId}</span>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Currency</label>
            <span>{obj.currency}</span>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Amount</label>
            <span>{obj.amount}</span>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Address</label>
            <span>{obj.address}</span>
          </Form.Field>
          {obj.tag && (
            <Form.Field inline>
              <label>Tag</label>
              <span>{obj.tag}</span>
            </Form.Field>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Type</label>
            <span>{obj.type}</span>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field inline>
            <label>Status</label>
            <Dropdown
              selection
              value={obj.status}
              options={[
                { key: 'PENDING', value: 'PENDING', text: 'PENDING' },
                { key: 'DECLINED', value: 'DECLINED', text: 'DECLINED' },
                { key: 'DEFERRED', value: 'DEFERRED', text: 'DEFERRED' },
                { key: 'COMPLETE', value: 'COMPLETE', text: 'COMPLETE' },
                { key: 'CANCELLED', value: 'CANCELLED', text: 'CANCELLED' },
              ]}
              onChange={(e, f) => onChangeEdit('status', f.value)}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field width={16}>
            <label>Tranasaction Info</label>
            <CodeMirror
              className="codemirror"
              value={JSON.stringify(obj.transactionInfo)}
              options={{
                mode: { name: 'javascript', json: true },
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                onChangeEdit('transactionInfo', value);
              }}
              onChange={(editor, data, value) => {}}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  );
  const transactionData = () => (
    <div style={{ padding: '0.5em', marginTop: '2em' }}>
      <Table compact size="small" striped fixed celled>
        <Table.Header>
          <Table.Row>
            {(admin.transaAttr || []).map((ele, key) => (
              <Table.HeaderCell textAlign="center" key={key}>
                {ele}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(admin.allTransactions || []).map((ele, key) => (
            <Table.Row key={key}>
              <Table.Cell>{ele.customerId}</Table.Cell>
              <Table.Cell textAlign="center">{ele.currency}</Table.Cell>
              <Table.Cell textAlign="right">{ele.amount}</Table.Cell>
              <Table.Cell textAlign="center">{ele.address || '-'}</Table.Cell>
              <Table.Cell textAlign="center">
                {ele.type === 'ADD_TO_PLATFORM' ? 'ADD' : 'WITHDRAW'}
              </Table.Cell>
              <Table.Cell textAlign="center">{ele.status}</Table.Cell>
              <Table.Cell>
                {moment(ele.updatedAt).format('Do, MMM HH:MM a')}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {ele.status !== 'COMPLETE' && (
                  <Button positive fluid icon onClick={() => handleEdit(ele)}>
                    <Icon name="edit" />
                  </Button>
                )}
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
            value={state.searchText}
            type="search"
            onChange={handleInputChange}
            onKeyPress={onEnter}
            placeholder="Search"
          />
          <Icon name="search" onClick={handleSearch} />
        </div>
        <select onChange={onSelect}>
          <option value="">Search By</option>
          <option value="tradeId">CustomerId</option>
          <option value="buyerId">Address</option>
          <option value="sellerId">Status</option>
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
        <Button primary onClick={handleTransactionSearch}>
          Search
          {/* {this.state.filterLoader ? <Icon loading name="spinner" /> : null} */}
        </Button>
        &nbsp;
        <Button color="red" onClick={handleResetFilter}>
          Reset
        </Button>
      </div>
      {_.isEmpty(editObject) ? transactionData() : editMethod(editObject)}
    </div>
  );
};

export default transactionComponent;
