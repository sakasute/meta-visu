import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardHeader from './CardHeader';
import TimelineTreeSVG from './TimelineTreeSVG';

import './TimelineTreeCard.css';

class TimelineTreeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      show, filename, data, fileFilter, treeConfig, timelineConfig,
    } = this.props;

    const classes = show ? 'timeline-tree-wrapper card' : 'vanish timeline-tree-wrapper card';
    const registerFilter = fileFilter.registers;
    // NOTE: this key updates depending on the registerFilter prop to force remounting
    // the d3-visualization with updated filters
    const key = Object.keys(registerFilter).join('')
      + Object.values(registerFilter)
        .map(reg => reg.isSelected)
        .join('');
    return (
      <div className={classes}>
        <CardHeader filename={filename} name={fileFilter.name} />
        <TimelineTreeSVG
          data={data}
          registerFilter={registerFilter}
          treeConfig={treeConfig}
          timelineConfig={timelineConfig}
          filename={filename}
          key={key}
        />
      </div>
    );
  }
}

TimelineTreeCard.propTypes = {
  show: PropTypes.bool.isRequired,
  filename: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  fileFilter: PropTypes.object.isRequired,
  treeConfig: PropTypes.object.isRequired,
  timelineConfig: PropTypes.object.isRequired,
};

export default TimelineTreeCard;
