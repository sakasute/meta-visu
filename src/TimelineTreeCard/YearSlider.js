import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/input-range/input-range.css';
import './YearSlider.css';

function YearSlider({ handleYearSelection, selectedYears }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="year-control">
      <InputRange
        className="year-control__slider"
        minValue={1900}
        maxValue={currentYear}
        value={selectedYears}
        onChange={years => handleYearSelection(years, 'change')}
        onChangeComplete={years => handleYearSelection(years, 'afterChange')}
      />
    </div>
  );
}

YearSlider.propTypes = {
  handleYearSelection: PropTypes.func.isRequired,
  selectedYears: PropTypes.object.isRequired,
};

export default YearSlider;
