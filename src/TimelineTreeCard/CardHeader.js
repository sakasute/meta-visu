import React from 'react';
import PropTypes from 'prop-types';
import YearSlider from './YearSlider';

function CardHeader({ name, yearSelected }) {
  return (
    <div className="card__header">
      <h2 className="title card__title">{name}</h2>
      <div className="card__year-control">
        <h3 className="year-control-title">Set years:</h3>
        <YearSlider slideStopped={yearSelected} />
      </div>
    </div>
  );
}

CardHeader.propTypes = {
  name: PropTypes.string.isRequired,
  yearSelected: PropTypes.func.isRequired,
};

export default CardHeader;
