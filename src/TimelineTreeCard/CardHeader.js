import React from 'react';
import PropTypes from 'prop-types';
import YearSlider from './YearSlider';

function CardHeader({ name, yearSelected }) {
  return (
    <div className="card__header">
      <a href={`#${name}`} className="title card__title">
        {name}
      </a>
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
