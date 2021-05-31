import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Message, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import asyncActions from '../actions/asyncActions';

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');

class NotificationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: { type: 'RELOAD_PAGE', json: '{"type": "RELOAD_PAGE"}' },
      errorMsg: null,
      isValidJSON: null,
    };
  }
  handleChange(e, f) {
    const that = this;
    that.setState({ notification: _.assign({}, that.state.notification, { [f.name]: f.value }) });
  }
  verifyJSON() {
    try {
      console.log('Send', JSON.parse(this.state.notification.json));
      this.setState({ errorMsg: null, isValidJSON: true });
    } catch (e) {
      this.setState({ errorMsg: e });
      console.log('Caught error', e);
    }
  }
  sendNotification() {
    const json = JSON.parse(this.state.notification.json);
  }
  render() {
    const that = this;
    const { notification, errorMsg, isValidJSON } = that.state;
    return (
      <div style={{ padding: '5em', marginTop: '2em' }}>
        {errorMsg && <Message error header="Some JSON error" content={JSON.stringify(errorMsg)} /> }
        {isValidJSON && <Message positive header="JSON is valid" /> }
        <Form>
          <Form.Group>
            <Form.Dropdown
              inline
              label="List of Notification Types"
              name="type" selection defaultValue={notification.type}
              options={[
              { key: 'GOT_NEW_ORDER', value: 'GOT_NEW_ORDER', text: 'GOT_NEW_ORDER' },
              { key: 'CANCEL_USER_ORDER', value: 'CANCEL_USER_ORDER', text: 'CANCEL_USER_ORDER' },
              { key: 'TRADE_UPDATE', value: 'TRADE_UPDATE', text: 'TRADE_UPDATE' },
              { key: 'ACCOUNT_UPDATE', value: 'ACCOUNT_UPDATE', text: 'ACCOUNT_UPDATE' },
              { key: 'MARKET_TICKER', value: 'MARKET_TICKER', text: 'MARKET_TICKER' },
              { key: 'RELOAD_PAGE', value: 'RELOAD_PAGE', text: 'RELOAD_PAGE' },
              { key: 'GOT_ANNOUNCEMENT', value: 'GOT_ANNOUNCEMENT', text: 'GOT_ANNOUNCEMENT' },
              ]}
            />
            <Button floated="right" positive onClick={that.sendNotification.bind(that)}>TEST</Button>
            <Button floated="right" onClick={that.sendNotification.bind(that)}>SEND</Button>
          </Form.Group>
          <Form.Group>
            <Form.Field width={16}>
              <label>JSON Value</label>
              <CodeMirror
                value={`{\n\t"type": "${notification.type}"\n}`}
                options={{
                  mode: { name: 'javascript', json: true },
                  theme: 'material',
                  lineNumbers: true,
                }}
                onChange={(editor, data, value) => {
                  that.setState({ isValidJSON: false, errorMsg: null, notification: _.assign({}, notification, { json: value }) });
                }}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
export default NotificationContainer;
