import React, { Component } from 'react';
import * as d3 from 'd3';
import CategoryTimeline from '../d3Visualizations/CategoryTimeline';
import TreeChart from '../d3Visualizations/TreeChart';
import { sortTreeData, calculateCategoryCount } from '../helpers';
import './TimelineTreeSVG.css';

class TimelineTreeSVG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CATEGORY_HEIGHT: 100,
    };
  }

  // FIXME: could/should be broken into smaller pieces
  componentDidMount() {
    // TODO: registerFilter
    const { CATEGORY_HEIGHT } = this.state;
    let {
      filename, data, treeConfig, timelineConfig,
    } = this.props;
    data = sortTreeData(data);

    const categoryCount = calculateCategoryCount(data);
    const treeHeight = categoryCount * CATEGORY_HEIGHT;

    const treeConfigDefault = {
      width: 450,
      height: treeHeight,
      posX: 125,
      posY: 50,
      childrenNames: ['registers', 'categories'],
      nodeSize: 7.5,
    };

    const treeConfigExtended = { ...treeConfigDefault, ...treeConfig };
    const svg = d3
      .select(`#js-timeline-tree-${filename}`)
      .attr('height', treeHeight + 100)
      .attr('width', 1050);
  }

  componentWillUnmount() {}

  render() {
    const { filename, data } = this.props;
    return <svg id={`js-timeline-tree-${filename}`} className="timeline-tree" />;
  }
}

export default TimelineTreeSVG;
