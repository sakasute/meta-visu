import React from 'react';
import './CohortItem.css';

export default function CohortItem({ selected, name, handleClick }) {
  const classNames = selected ? 'cohortItem cohortItem--selected' : 'cohortItem';
  return (
    <button className={classNames} type="button" onClick={() => handleClick(name)}>
      {name}
    </button>
  );
}
