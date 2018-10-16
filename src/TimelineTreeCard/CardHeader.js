import React from 'react';
import PropTypes from 'prop-types';
import YearSlider from './YearSlider';

function CardHeader({
  lang, name, handleYearSelection, selectedYears,
}) {
  return (
    <div className="card__header">
      <h2 className="title card__title">{name[lang]}</h2>
      <div className="card__year-control">
        <h3 className="year-control-title">Set years:</h3>
        <YearSlider handleYearSelection={handleYearSelection} selectedYears={selectedYears} />
      </div>
    </div>
  );
}

CardHeader.propTypes = {
  lang: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired,
  handleYearSelection: PropTypes.func.isRequired,
  selectedYears: PropTypes.object.isRequired,
};

export default CardHeader;
