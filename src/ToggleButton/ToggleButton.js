import React from 'react';
import classNames from 'classnames';
import './ToggleButton.css';

export default function ToggleButton({
  children,
  handleClick,
  isSelected,
  mixClasses,
  size,
  type,
}) {
  const TYPES = {
    BASIC: 'toggleButtonBasic',
    TAG: 'toggleButtonTag',
    TEXT: 'toggleButtonText',
  };

  const classes = classNames('toggleButton', TYPES[type], { '-selected': isSelected }, mixClasses);

  return (
    <button className={classes} type="button" onClick={handleClick}>
      {children}
    </button>
  );
}
