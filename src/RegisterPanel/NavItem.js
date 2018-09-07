import React from 'react';
import RegisterSelector from './RegisterSelector';

function NavItem(props) {
  const { adminData } = props;

  return (
    <li className="nav__item">
      <button type="button" className="btn">
        {adminData.name}
      </button>
      <RegisterSelector adminName={adminData.name} registers={adminData.registers} />
    </li>
  );
}

export default NavItem;
