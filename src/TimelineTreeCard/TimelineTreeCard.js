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
    const { filename, treeConfig, timelineConfig } = this.props;
    return (
      <div>
        <CardHeader filename={filename} />
        <TimelineTreeSVG
          filename={filename}
          treeConfig={treeConfig}
          timelineConfig={timelineConfig}
        />
      </div>
    );
  }
}

export default TimelineTreeCard;
