import React, { Component } from 'react';
import PropTypes from 'prop-types';

import d3 from '../_js/d3Visualizations/d3imports';
// NOTE: CategoryTimelines are currently created with an external helper function
// import CategoryTimeline from '../d3Visualizations/CategoryTimeline';
import TreeChart from '../_js/d3Visualizations/TreeChart';
import CategoryTimeline from '../_js/d3Visualizations/CategoryTimeline';
import { sortTreeData, calculateCategoryCount, idRef } from '../_js/helpers';

class TimelineTreeSVG extends Component {
  constructor(props) {
    super(props);
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
      scaleEndDate: new Date(),
    };
    this.state = {};
  }

  // FIXME: could/should be broken into smaller pieces
  componentDidMount() {
    const { data: dataProp } = this.props;
    // NOTE: this makes sure that we are not modifying the original data in the App-component
    let data = { ...dataProp };
    const {
      filename, cohortFilter, registerFilter, treeConfig, timelineConfig,
    } = this.props;

    // ***** TreeChart *****
    const filteredRegisterData = data.registers.filter(
      register => registerFilter[register.name.en].isSelected,
    );

    const selectedCohorts = Object.values(cohortFilter).filter(cohort => cohort.isSelected);
    const cohortNum = selectedCohorts.length;
    const categoryTimelineHeight = 2 * (20 * cohortNum) + 30;

    data.registers = filteredRegisterData;
    data = sortTreeData(data);
    const categoryCount = calculateCategoryCount(data);
    const treeHeight = categoryCount * categoryTimelineHeight;
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
    const timelineConfigCohorts = {
      height: categoryTimelineHeight,
      cohorts: selectedCohorts.map(cohort => cohort.name),
    };
    const timelineConfigExtended = {
      ...this.timelineConfigDefault,
      ...timelineConfig,
      ...timelineConfigCohorts,
    };
    if (treeChart.treeData.children) {
      treeChart.treeData.children.forEach((registerNode, registerIdx) => {
        registerNode.children.forEach((categoryNode, categoryIdx) => {
          let timelineConfigModified = timelineConfigExtended;

          if (registerIdx === 0 && categoryIdx === 0) {
            timelineConfigModified = {
              ...timelineConfigExtended,
              showXAxis: true,
              showLegend: true,
              xAxisOrientation: 'top',
            };
          }

          const filteredCohortData = categoryNode.data.samplings.filter(
            sampling => cohortFilter[sampling.cohort].isSelected,
          );
          const categoryTimeline = new CategoryTimeline(
            filteredCohortData,
            svg,
            timelineConfigModified,
          );
          // NOTE: the tree structure kind of swaps x and y coords
          categoryTimeline.moveTo(
            categoryNode.y + 300,
            categoryNode.x + 50 + 10 - categoryTimelineHeight / 2,
          );
          categoryTimeline.update();
        });
      });
    }
  }

  componentWillUnmount() {
    const { filename } = this.props;
    const nodeToEmpty = document.querySelector(`.js-timeline-tree#${idRef(filename)}`);
    while (nodeToEmpty.firstChild) {
      nodeToEmpty.removeChild(nodeToEmpty.firstChild);
    }
  }

  render() {
    const { filename } = this.props;
    return <svg id={idRef(filename)} className="js-timeline-tree timeline-tree" />;
  }
}

TimelineTreeSVG.propTypes = {
  data: PropTypes.object.isRequired,
  registerFilter: PropTypes.object.isRequired,
  treeConfig: PropTypes.object.isRequired,
  timelineConfig: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
};

export default TimelineTreeSVG;
