import React from 'react';
import PropTypes from 'prop-types';
import YearSlider from './YearSlider';

function CardHeader({
  lang, name, handleYearSelection, defaultStartYear,
}) {
  return (
    <div className="card__header">
      <h2 className="title card__title">{name[lang]}</h2>
      <div className="card__year-control">
        <h3 className="year-control-title">Set years:</h3>
        <YearSlider slideStopped={handleYearSelection} defaultStartYear={defaultStartYear} />
      </div>
    </div>
  );
}

CardHeader.propTypes = {
  lang: PropTypes.string.isRequired,
  name: PropTypes.object.isRequired,
  handleYearSelection: PropTypes.func.isRequired,
  defaultStartYear: PropTypes.number.isRequired,
};

export default CardHeader;
