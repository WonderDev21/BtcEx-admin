import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Form,
  Message,
  Button,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import asyncActions from '../actions/asyncActions';

class RequestsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestObj: null,
    };
  }
  componentDidMount() {
    this.props.dispatch(asyncActions.getAllRequests());
  }
  handleRequestChange(e, f) {
    const that = this;
    that.setState({
      notification: _.assign({}, that.state.notification, {
        [f.name]: f.value,
      }),
    });
  }
  handleStatusChange(e, f) {
    this.setState({
      requestObj: _.assign({}, this.state.requestObj, { status: f.value }),
    });
  }
  handleEdit(ele) {
    this.setState({ requestObj: ele });
  }
  onCancel() {
    this.setState({ requestObj: null });
  }
  updateRequest(requestObj) {
    const that = this;
    that.props
      .dispatch(asyncActions.updateRequest(requestObj.requestId, requestObj))
      .then(x => that.setState({ requestObj: null }));
  }
  render() {
    const that = this;
    const { requests } = that.props;
    const { requestObj } = that.state;
    return (
      <div style={{ padding: '5em', marginTop: '2em' }}>
        {requestObj ? (
          <div>
            <Form>
              <Form.Group>
                <Form.Field inline>
                  <label>Date</label>
                  <span>
                    {moment(requestObj.createdAt).format('Do, MMM HH:MM a')}
                  </span>
                </Form.Field>
                <Form.Field inline>
                  <label>Amount</label>
                  <span>{requestObj.amount}</span>
                </Form.Field>
                <Form.Field inline>
                  <label>Currency</label>
                  <span>{requestObj.currency}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group inline>
                <Form.Field>
                  <label>User ID</label>
                  <span>{requestObj.userId}</span>
                </Form.Field>
                <Form.Field>
                  <label>User Name</label>
                  <span>{_.get(requestObj, 'user.fullName', '')}</span>
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <span>{_.get(requestObj, 'user.email', '')}</span>
                </Form.Field>
                <Form.Field>
                  <label>Phone</label>
                  <span>{_.get(requestObj, 'user.phone', '')}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field inline>
                  <label>Request ID</label>
                  <span>{requestObj.requestId}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group inline>
                <Form.Field>
                  <label>Ref No.</label>
                  <span>{requestObj.refNo}</span>
                </Form.Field>
                <Form.Field>
                  <label>Mode</label>
                  <span>{requestObj.mode || '-'}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>Transaction Ref No.</label>
                  <span>{requestObj.transactionNo}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>Address</label>
                  <span>{requestObj.address || '-'}</span>
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field>
                  <label>Remarks</label>
                  <span>{requestObj.remarks || '-'}</span>
                </Form.Field>
              </Form.Group>
              <Form.Field inline>
                <label>Status</label>
                <Dropdown
                  selection
                  value={requestObj.status}
                  options={[
                    { key: 'PENDING', value: 'PENDING', text: 'PENDING' },
                    { key: 'DECLINED', value: 'DECLINED', text: 'DECLINED' },
                    { key: 'DEFERRED', value: 'DEFERRED', text: 'DEFERRED' },
                    { key: 'COMPLETE', value: 'COMPLETE', text: 'COMPLETE' },
                    { key: 'CANCELLED', value: 'CANCELLED', text: 'CANCELLED' },
                  ]}
                  onChange={that.handleStatusChange.bind(that)}
                />
              </Form.Field>
              <Form.Group>
                <Form.Button onClick={that.onCancel.bind(that)}>
                  Cancel
                </Form.Button>
                <Form.Button
                  positive
                  onClick={that.updateRequest.bind(that, requestObj)}
                >
                  Save
                </Form.Button>
              </Form.Group>
            </Form>
          </div>
        ) : (
          <Table compact size="small" striped fixed celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Amount</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Currency</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">UserId</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  RequestId
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">refNo</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(requests || []).map(ele => (
                <Table.Row key={ele.refNo}>
                  <Table.Cell>
                    {moment(ele.createdAt).format('Do, MMM HH:MM a')}
                  </Table.Cell>
                  <Table.Cell textAlign="right">{ele.amount}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.currency}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {_.get(ele, 'user.fullName', '')}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{ele.userId}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.requestId}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.refNo}</Table.Cell>
                  <Table.Cell textAlign="center">{ele.status}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {ele.status !== 'COMPLETE' && (
                      <Button
                        positive
                        fluid
                        icon
                        onClick={that.handleEdit.bind(that, ele)}
                      >
                        <Icon name="edit" />
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </div>
    );
  }
}
export default connect(s => ({ requests: s.requests }))(RequestsContainer);
