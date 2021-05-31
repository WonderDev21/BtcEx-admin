import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import './adminDashboardStyle.scss';

const items2 = [
  'AllUser',
  'Users',
  'Accounts',
  'Transactions',
  'Requests',
  'Coin Deposits',
  'Notification',
  'Email',
  'Announcement',
  'Orders',
  'Trades',
];
const items = [
  { label: 'AllUser', link: '' },
  { label: 'Users', link: '' },
  { label: 'Accounts', link: '' },
  { label: 'Transactions', link: '' },
  { label: 'Requests', link: '' },
  { label: 'Coin Deposits', link: '' },
  { label: 'Notification', link: '' },
  { label: 'Email', link: '' },
  { label: 'Announcement', link: '' },
  { label: 'Orders', link: '' },
  { label: 'Trades', link: '' },
  { label: 'Txns', link: '' },
  { label: 'Jobs', link: '' },
];
const AdminDashboard = ({ admin, server, onSelectItem }) => (
  <div className="admin-side-bar">
    <div className="title">
      <p>ADMIN</p>
      <div className="server-acc" style={{ display: 'none' }}>
        <span style={{ display: 'inherit' }}>Server Balance </span>
        {Object.keys(server).map((ac, ind) => (
          <small key={ind} style={{ display: 'inherit' }}>
            {ac}: {server[ac]}
          </small>
        ))}
      </div>
    </div>
    <div className="list">
      {items.map(
        (ele, key) =>
          ele.link ? (
            <Link
              className={
                ele.label === admin.activeItem
                  ? 'white active'
                  : 'white list-items'
              }
              key={key}
              to={ele.link}
            >
              {ele.label}
            </Link>
          ) : (
            <p
              className={
                ele.label === admin.activeItem ? 'active' : 'list-items'
              }
              key={key}
              onClick={() => onSelectItem(ele.label)}
            >
              {ele.label}
            </p>
          )
      )}
    </div>
  </div>
);
AdminDashboard.defaultProps = {
  admin: {},
  server: {},
  onSelectItem: () => {},
};
AdminDashboard.propTypes = {
  admin: PropTypes.object,
  server: PropTypes.object,
  onSelectItem: PropTypes.func,
};
export default AdminDashboard;
