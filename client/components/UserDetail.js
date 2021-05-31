import React, { Component } from 'react';
import {
  Button,
  Table,
  Card,
  Image,
  Select,
  Icon,
  Input,
  Form,
} from 'semantic-ui-react';

import AppConstants from '../constants/AppConstants';
import asyncActions from '../actions/asyncActions';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kycStatus: this.props.user.kycVerified,
      updateLoader: false,
      rejectReason: '',
    };
    this.handleGridRender = this.handleGridRender.bind(this);
    this.handleKycStatus = this.handleKycStatus.bind(this);
    this.handleKycVerified = this.handleKycVerified.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleKycStatus(event, selectedValue) {
    this.setState({ kycStatus: selectedValue.value });
  }

  handleKycVerified() {
    const { kycStatus, rejectReason } = this.state;
    const { user } = this.props;
    const updateObj = {
      userId: user.userId,
      kycVerified: kycStatus,
    };
    if (kycStatus === 'REJECTED') {
      updateObj.kycReason = rejectReason === '' ? null : rejectReason;
    }
    if (kycStatus === this.props.user.kycVerified) {
      alert('Select different kyc status');
    } else {
      this.setState(state => ({ updateLoader: !state.updateLoader }));
      this.props.handleKycStatusUpdate(updateObj, () => {
        this.setState(state => ({ updateLoader: !state.updateLoader }));
      });
    }
  }

  handleGridRender(userDoc) {
    const { idProof } = userDoc;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <Card>
            <Card.Content>
              <Card.Header>Photo</Card.Header>
            </Card.Content>
            <Image src={userDoc.photo} wrapped ui={false} />
          </Card>
        </div>
        <div>
          <Card>
            <Card.Content>
              <Card.Header>Front of ID Proof</Card.Header>
            </Card.Content>
            <Image
              src={idProof ? idProof.frontUrl : userDoc.identity}
              wrapped
              ui={false}
            />
          </Card>
        </div>
        {idProof &&
          idProof.backUrl && (
            <div>
              <Card>
                <Card.Content>
                  <Card.Header>Back of ID Proof</Card.Header>
                </Card.Content>
                <Image src={idProof.backUrl} wrapped ui={false} />
              </Card>
            </div>
          )}
      </div>
    );
  }

  handleInputChange(event) {
    const { value } = event.target;
    let { rejectReason } = this.state;
    rejectReason = value;
    this.setState({ rejectReason });
  }

  render() {
    const { user, userDoc, goBack } = this.props;
    const { kycStatus, updateLoader, rejectReason } = this.state;
    console.log(rejectReason);
    return (
      <div>
        <Button onClick={goBack}>BACK</Button>
        <Table celled size="small" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Phone</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">UserId</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">
                Document Id
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Created At</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Updated At</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row key={user.userId}>
              <Table.Cell textAlign="center">{user.fullName}</Table.Cell>
              <Table.Cell textAlign="center">{user.email}</Table.Cell>
              <Table.Cell textAlign="center">{user.phone}</Table.Cell>
              <Table.Cell textAlign="center">{user.userId}</Table.Cell>
              <Table.Cell textAlign="center">{userDoc.id}</Table.Cell>
              <Table.Cell textAlign="center">{userDoc.createdAt}</Table.Cell>
              <Table.Cell textAlign="center">{userDoc.updatedAt}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {this.handleGridRender(userDoc)}
        <hr />
        <div>
          <label> KYC Status </label>&nbsp;
          <Select
            placeholder="Select KYC status"
            options={AppConstants.kycStatus}
            onChange={this.handleKycStatus}
            value={kycStatus}
          />
          &nbsp;
          {kycStatus === 'REJECTED' ? (
            <Input
              placeholder="Enter reject reason here"
              onChange={this.handleInputChange}
              value={rejectReason}
            />
          ) : null}
          &nbsp;
          <Button
            disabled={updateLoader}
            primary
            onClick={this.handleKycVerified}
          >
            Update {updateLoader ? <Icon loading name="spinner" /> : null}
          </Button>
        </div>
      </div>
    );
  }
}

export default UserDetail;
