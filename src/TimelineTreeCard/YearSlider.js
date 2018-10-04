import React from 'react';
import PropTypes from 'prop-types';
import { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import './YearSlider.css';

function YearSlider({ slideStopped }) {
  const handle = (props) => {
    const {
      value, dragging, index, ...restProps
    } = props;
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="bottom"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="year-control">
      <span className="year-control__label">1900</span>
      <Range
        className="year-control__slider"
        // handle={handle}
        min={1900}
        max={currentYear}
        defaultValue={[1987, currentYear]}
        onAfterChange={slideStopped}
      />
      <span className="year-control__label">{currentYear}</span>
    </div>
  );
}

YearSlider.propTypes = {
  slideStopped: PropTypes.func.isRequired,
};

export default YearSlider;
