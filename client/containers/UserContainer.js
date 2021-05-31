import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Select, Input, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import asyncActions from '../actions/asyncActions';
import Statement from '../components/Statement';
import UserDetail from '../components/UserDetail';
import './adminContainer.scss';
import AppConstants from '../constants/AppConstants';

const views = {
  STATEMENT: 'STATEMENT',
  USER_DETAILS: 'USER_DETAILS',
  DEFAULT: 'DEFAULT',
};

const filterOptions = [
  { key: 'email', value: 'email', text: 'Email' },
  { key: 'phone', value: 'phone', text: 'Phone' },
  { key: 'userId', value: 'userId', text: 'User ID' },
  { key: 'kycStatus', value: 'kycStatus', text: 'KYC Status' },
];

class UserContainer extends Component {
  constructor() {
    super();
    this.state = {
      currentView: views.DEFAULT,
      currentUser: null,
      offset: 0,
      updateLoader: false,
      selectedFilter: '',
      filterLoader: false,
      filterValue: '',
      kycStatus: '',
      email: '',
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleKycStatusUpdate = this.handleKycStatusUpdate.bind(this);
    this.handleSelectFilter = this.handleSelectFilter.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKycStatus = this.handleKycStatus.bind(this);
  }

  showAccountStatement(currentUser) {
    const that = this;
    const { statements } = that.props;
    if (!statements[currentUser.userId]) {
      that.props.dispatch(
        asyncActions.getUserAccountStatement(currentUser.userId)
      );
    }
    that.setState({ currentUser, currentView: views.STATEMENT });
  }

  showUserDetails(user) {
    this.props
      .dispatch(asyncActions.getUserDocument(user.userId))
      .then(() => {
        this.setState({ currentView: views.USER_DETAILS, currentUser: user });
      })
      .catch(console.log);
  }

  reset() {
    this.setState({ currentView: views.DEFAULT, currentUser: null });
  }

  handleLoadMore() {
    const { offset } = this.state;
    const newOffset = offset + 10;
    const data = {
      offset: newOffset,
    };
    this.setState({ offset: newOffset }, () =>
      this.props.dispatch(asyncActions.fetchAllUsers(data))
    );
  }

  handleSelectFilter(event, selectedValue) {
    this.setState({ selectedFilter: selectedValue.value });
  }

  handleSearch() {
    const {
      selectedFilter,
      email,
      offset,
      filterValue,
      kycStatus,
    } = this.state;
    console.log(selectedFilter, offset, filterValue, kycStatus);
    const data = {
      [selectedFilter]: filterValue || null,
      offset: 0,
    };
    if (kycStatus) {
      data.kycStatus = kycStatus;
    }
    if (email) {
      data.email = email;
    }
    this.props.dispatch(asyncActions.fetchAllUsers(data));
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleKycStatus(event, selectedValue) {
    this.setState({ kycStatus: selectedValue.value });
  }

  getDefaultView(users) {
    return (
      <div>
        <Select
          placeholder="Search By"
          options={filterOptions}
          onChange={this.handleSelectFilter}
          value={this.state.selectedFilter}
        />
        &nbsp;
        {this.state.selectedFilter === 'kycStatus' ? (
          <span>
            <Select
              placeholder="Select KYC status"
              options={AppConstants.kycStatus}
              onChange={this.handleKycStatus}
              value={this.state.kycStatus}
            />
            &nbsp;
            <Input
              placeholder="Enter email (optional)"
              onChange={this.handleInputChange}
              name="email"
              value={this.state.email}
            />
          </span>
        ) : (
          <Input
            placeholder="Enter search value"
            name="filterValue"
            onChange={this.handleInputChange}
            value={this.state.filterValue}
          />
        )}
        &nbsp;
        <Button
          disabled={this.state.filterLoader}
          primary
          onClick={this.handleSearch}
        >
          Search
          {this.state.filterLoader ? <Icon loading name="spinner" /> : null}
        </Button>
        &nbsp;
        <Button
          color="red"
          onClick={() =>
            this.setState({
              selectedFilter: '',
              filterValue: '',
              kycStatus: '',
            })
          }
        >
          Reset
        </Button>
        <Table celled size="small" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Name</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Phone</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">UserId</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Ref-Id</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">KYC Status</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map(user => (
              <Table.Row key={user.userId}>
                <Table.Cell textAlign="center">{user.fullName}</Table.Cell>
                <Table.Cell textAlign="center">{user.email}</Table.Cell>
                <Table.Cell textAlign="center">{user.phone}</Table.Cell>
                <Table.Cell textAlign="center">{user.userId}</Table.Cell>
                <Table.Cell textAlign="center">{user.kycVerified}</Table.Cell>
                <Table.Cell textAlign="center">{user.customerId}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Button.Group>
                    <Button
                      onClick={this.showAccountStatement.bind(this, user)}
                    >
                      Statement
                    </Button>
                    <Button
                      onClick={this.showUserDetails.bind(this, user)}
                      positive
                    >
                      View
                    </Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.handleLoadMore} primary>
            Load More
          </Button>
        </div>
      </div>
    );
  }

  handleView(view) {
    this.setState({ currentView: view });
  }

  handleKycStatusUpdate(data, cb) {
    this.props
      .dispatch(asyncActions.updateUser(data))
      .then(() => {
        cb();
        if (data.kycVerified === 'APPROVED') {
          this.props.dispatch(asyncActions.cretaVirtualAccount(data));
        }
      })
      .catch(err => {
        console.log(err);
        cb();
      });
  }

  render() {
    const that = this;
    const { users, statements, userDoc } = that.props;
    const { currentView, currentUser } = that.state;
    return (
      <div style={{ padding: '0.5em', marginTop: '2em' }}>
        {currentView === views.DEFAULT && that.getDefaultView(users)}
        {currentView === views.USER_DETAILS && (
          <UserDetail
            user={currentUser}
            userDoc={userDoc}
            goBack={that.reset.bind(that)}
            handleKycStatusUpdate={this.handleKycStatusUpdate}
          />
        )}
        {currentView === views.STATEMENT && (
          <Statement
            statements={statements[currentUser.userId]}
            goBack={that.reset.bind(that)}
          />
        )}
      </div>
    );
  }
}
export default connect(s => ({
  statements: s.statements,
  userDoc: s.adminReducer.userDoc,
}))(UserContainer);
