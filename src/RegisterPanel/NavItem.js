import React from 'react';
import RegisterSelector from './RegisterSelector';

function NavItem(props) {
  const { adminData, handleAdminBtnClick } = props;

  return (
    <li className="nav__item">
      <button type="button" id={adminData.name} className="btn" onClick={handleAdminBtnClick}>
        {adminData.name}
      </button>
      <RegisterSelector adminName={adminData.name} registers={adminData.registers} />
    </li>
  );
}

export default NavItem;
