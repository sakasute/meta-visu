import React, { Component } from 'react';
import * as d3 from 'd3';
import CategoryTimeline from '../d3Visualizations/CategoryTimeline';
import TreeChart from '../d3Visualizations/TreeChart';
import {
  sortTreeData, calculateCategoryCount, categoryTimelineHelper, idRef,
} from '../helpers';
import './TimelineTreeSVG.css';

class TimelineTreeSVG extends Component {
  constructor(props) {
    super(props);
    this.CATEGORY_HEIGHT = 100;
    this.treeConfigDefault = {
      width: 450,
      height: 100,
      posX: 125,
      posY: 50,
      childrenNames: ['registers', 'categories'],
      nodeSize: 7.5,
    };
    this.timelineConfigDefault = {
      width: 250,
      height: 100,
      showXAxis: false,
      showLegend: false,
      scaleStartDate: new Date('1950-01-01'),
      scaleEndDate: new Date(),
    };
    this.state = {};
  }

  // FIXME: could/should be broken into smaller pieces
  componentDidMount() {
    // TODO: registerFilter
    let {
      filename, data, treeConfig, timelineConfig,
    } = this.props;

    // ***** TreeChart *****
    data = sortTreeData(data);
    const categoryCount = calculateCategoryCount(data);
    const treeHeight = categoryCount * this.CATEGORY_HEIGHT;
    this.treeConfigDefault.height = treeHeight;

    const treeConfigExtended = { ...this.treeConfigDefault, ...treeConfig };

    const svg = d3
      .select(`.js-timeline-tree#${idRef(filename)}`)
      .attr('height', treeHeight + 100)
      .attr('width', 1050);

    const treeChart = new TreeChart(data, svg, treeConfigExtended);
    treeChart.updateNodes();
    treeChart.updateLinks();

    // ***** Timelines *****
    const timelineConfigExtended = { ...this.timelineConfigDefault, ...timelineConfig };
    treeChart.treeData.children.forEach((registerNode, registerIdx) => {
      registerNode.children.forEach((categoryNode, categoryIdx) => {
        let timelineConfigModified = timelineConfigExtended;
        if (registerIdx === 0 && categoryIdx === 0) {
          timelineConfigModified = { ...timelineConfigExtended, showXAxis: true, showLegend: true };
        }
        const categoryTimeline = categoryTimelineHelper(
          categoryNode.data.samplings,
          svg,
          timelineConfigModified,
        );
        // NOTE: the tree structure kind of swaps x and y coords
        categoryTimeline.moveTo(categoryNode.y + 300, categoryNode.x + 12.5);
        categoryTimeline.update();
      });
    });
  }

  componentWillUnmount() {}

  render() {
    const { filename, data } = this.props;
    return <svg id={idRef(filename)} className="js-timeline-tree timeline-tree" />;
  }
}

export default TimelineTreeSVG;
