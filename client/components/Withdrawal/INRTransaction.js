import React, { Component } from 'react';
import moment from 'moment';
import { Form, Table, Button, Dropdown } from 'semantic-ui-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import AppConstants from '../../constants/AppConstants';

class INRTransaction extends Component {
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
              <label>Name</label>
              <span>{txnObj.name}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Email</label>
              <span>{txnObj.email}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Currency</label>
              <span>{txnObj.currency}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Mode</label>
              <span>{txnObj.mode}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Transfered Amount</label>
              <span>
                <b>{txnObj.misc && txnObj.misc.transfer_amount}</b>
              </span>
            </Form.Field>
            <Form.Field inline>
              <label>Server Fee</label>
              <span>
                <b>{txnObj.serverFee}</b>
              </span>
            </Form.Field>
            <Form.Field inline>
              <label>API Fee</label>
              <span>
                <b>{txnObj.apiFee}</b>
              </span>
            </Form.Field>
            <Form.Field inline>
              <label>Net Amount</label>
              <span>
                <b>{txnObj.amount}</b>
              </span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Customer ID</label>
              <span>{txnObj.userId}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Txn Ref</label>
              <span>{txnObj.txnRef}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Credit Time</label>
              <span>{txnObj.misc && txnObj.misc.credited_at}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Status</label>
              <span>{txnObj.status}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Deposit Status</label>
              <span>{txnObj.depositStatus}</span>
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field inline>
              <label>Type</label>
              <span>{txnObj.type}</span>
            </Form.Field>
            <Form.Field inline>
              <label>ID</label>
              <span>{txnObj._id}</span>
            </Form.Field>
            <Form.Field inline>
              <label>Server TxnRef </label>
              <span>{txnObj.serverTxnRef}</span>
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
                onChange={(editor, data, value) => {}}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default INRTransaction;
