import React, { PropTypes } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Icon, Select, Input, Button } from 'semantic-ui-react';
import './common.scss';

const filterOptions = [
  // { key: 'userId', value: 'userId', text: 'UserId' },
  { key: 'tradeId', value: 'tradeId', text: 'Trade Id' },
  // { key: 'customerId', value: 'customerId', text: 'Customer Id' },
];

const tradeComponent = ({
  admin,
  search,
  handleSearch,
  onEnter,
  onSelect,
  onChange,
  handleTradeSearch,
  handleSelectFilter,
  handleInputChange,
  selectedFilter,
  filterValue,
  handleResetFilter,
}) => {
  // const handleInputChange = e => {
  //   onChange(e.target.value);
  // };

  const tradeData = () => (
    <div className="user-method">
      <div className="all-users">
        {(admin.tradeAttr || []).map((ele, key) => (
          <div className="attribute" key={key}>
            <strong>{ele}</strong>
          </div>
        ))}
      </div>
      {(admin.allTrades || []).map((ele, key) => (
        <div className="users-data" key={key}>
          <div className="attribute">{ele.tradeId}</div>
          <div className="attribute">{ele.price}</div>
          <div className="attribute">{ele.size}</div>
          <div className="attribute">{ele.costApplied}</div>
          <div className="attribute">{ele.buyUserId}</div>
          <div className="attribute">{ele.sellUserId}</div>
          <div className="attribute">
            {moment(ele.updatedAt).format('DD:MM HH:mm')}
          </div>
        </div>
      ))}
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
          <option value="tradeId">TradeId</option>
          <option value="buyerId">BuyerId</option>
          <option value="sellerId">SellerId</option>
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
        <Button primary onClick={handleTradeSearch}>
          Search
          {/* {this.state.filterLoader ? <Icon loading name="spinner" /> : null} */}
        </Button>
        &nbsp;
        <Button color="red" onClick={handleResetFilter}>
          Reset
        </Button>
      </div>
      {tradeData()}
    </div>
  );
};

export default tradeComponent;
