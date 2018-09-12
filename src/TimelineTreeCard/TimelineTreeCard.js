import React, { Component } from 'react';
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
      filename, data, registerFilter, treeConfig, timelineConfig,
    } = this.props;
    // NOTE: this key updates depending on the registerFilter prop to force remounting
    // the d3-visualization with updated filters
    const key = Object.keys(registerFilter).join('')
      + Object.values(registerFilter)
        .map(reg => reg.isSelected)
        .join('');
    return (
      <div className="timeline-tree-wrapper card">
        <CardHeader filename={filename} name={data.name} />
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

export default TimelineTreeCard;
