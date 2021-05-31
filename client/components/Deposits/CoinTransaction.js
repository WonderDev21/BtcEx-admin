import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Form, Table, Button, Dropdown } from 'semantic-ui-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import AppConstants from '../../constants/AppConstants';

class CoinTransaction extends Component {
  handleChange() {}
  render() {
    const { txnObj } = this.props;
    return (
      <div className="edit-object">
        <Form>
          <Form.Group style={{ float: 'right' }}>
            <Form.Button error onClick={this.props.onCancel}>
              Back
            </Form.Button>
            <Form.Button
              negative
              onClick={this.props.onProcess.bind(this, txnObj)}
            >
              Process
            </Form.Button>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Customer ID</label>
              <span>{txnObj.userId}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Name</label>
              <span>{txnObj.name}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Email</label>
              <span>{txnObj.email}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Currency</label>
              <span>{txnObj.currency}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Amount</label>
              <span>{txnObj.amount}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Address</label>
              <span>{txnObj.wallet.address}</span>
            </Form.Field>
            {txnObj.tag && (
              <Form.Field inline>
                <label>Tag</label>
                <span>{txnObj.tag}</span>
              </Form.Field>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Server TxnId</label>
              <span>{txnObj.serverTxnRef}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Job TxnId</label>
              <span>{txnObj._id}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Type</label>
              <span>{txnObj.type}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Status</label>
              <span>{txnObj.status}</span>
            </Form.Field>
            <Form.Field inline>
              <label>URL</label>
              <a
                target="_blank"
                href={_.get(
                  txnObj,
                  'transactionInfo.link',
                  'javascript:void(0);' // eslint-disable-line no-script-url
                )}
              >
                Link
              </a>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>Tranasaction Info</label>
              <CodeMirror
                className="codemirror"
                value={JSON.stringify(txnObj.misc, null, '\t')}
                options={{
                  mode: { name: 'javascript', json: true },
                  theme: 'material',
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {}}
                onChange={(editor, data, value) => {}}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default CoinTransaction;
