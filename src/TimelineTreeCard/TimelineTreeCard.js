import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CardHeader from './CardHeader';
import TimelineTreeSVG from './TimelineTreeSVG';

import './TimelineTreeCard.css';

class TimelineTreeCard extends Component {
  constructor(props) {
    super(props);
    this.yearSelected = this.yearSelected.bind(this);
    this.currentYear = new Date().getFullYear();
    this.state = {
      scaleYears: [1987, this.currentYear],
    };
  }

  yearSelected(yearArr) {
    this.setState({ scaleYears: yearArr });
  }

  render() {
    const {
      show, filename, data, fileFilter, treeConfig, timelineConfig,
    } = this.props;

    const { scaleYears } = this.state;
    const scaleStartDate = new Date(`${scaleYears[0]}-01-01`);
    const scaleEndDate = new Date(`${scaleYears[1]}-12-31`);
    const timelineConfigExtended = { ...timelineConfig, scaleStartDate, scaleEndDate };

    const classes = show
      ? 'timeline-tree-wrapper card'
      : 'card--collapsed timeline-tree-wrapper card';
    const registerFilter = fileFilter.registers;
    // NOTE: this key updates depending on the registerFilter prop to force remounting
    // the TimelineTree with updated filters
    const key = Object.keys(registerFilter).join('')
      + Object.values(registerFilter)
        .map(reg => reg.isSelected)
        .join('')
      + scaleYears.join('');
    return (
      <div className={classes}>
        <CardHeader filename={filename} name={fileFilter.name} yearSelected={this.yearSelected} />
        <TimelineTreeSVG
          data={data}
          registerFilter={registerFilter}
          treeConfig={treeConfig}
          timelineConfig={timelineConfigExtended}
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
