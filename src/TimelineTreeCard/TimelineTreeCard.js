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
      filename, data, treeConfig, timelineConfig,
    } = this.props;
    return (
      <div className="timeline-tree-wrapper card">
        <CardHeader filename={filename} name={data.name} />
        <TimelineTreeSVG
          data={data}
          treeConfig={treeConfig}
          timelineConfig={timelineConfig}
          filename={filename}
        />
      </div>
    );
  }
}

export default TimelineTreeCard;
