import React, { Component } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import InfoBox from '../InfoBox/InfoBox';

import d3 from '../_js/d3Visualizations/d3imports';
// NOTE: CategoryTimelines are currently created with an external helper function
// import CategoryTimeline from '../d3Visualizations/CategoryTimeline';
import TreeChart from '../_js/d3Visualizations/TreeChart';
import CategoryTimeline from '../_js/d3Visualizations/CategoryTimeline';
import { sortTreeData, calculateCategoryCount, idRef } from '../_js/helpers';

import './TimelineTreeSVG.css';

class TimelineTreeSVG extends Component {
  constructor(props) {
    super(props);
    this.showInfoBox = this.showInfoBox.bind(this);
    this.hideInfoBox = this.hideInfoBox.bind(this);
    this.treeConfigDefault = {
      width: 450,
      height: 100,
      posX: 125,
      posY: 50,
      childrenNames: ['registers', 'categories'],
      nodeSize: 7.5,
    };
    this.timelineConfigDefault = {
      width: 225,
      height: 100,
      showXAxis: false,
      showLegend: false,
      scaleEndDate: new Date(),
    };
    this.state = {
      infoBoxes: [],
    };
  }

  // FIXME: could/should be broken into smaller pieces
  componentDidMount() {
    const { data: dataProp, lang } = this.props;
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
        const { infoBoxes } = this.state;
        registerNode.children.filter(node => node.data.note[lang] !== '').forEach(node => infoBoxes.push({
          isShown: false,
          text: node.data.note,
          x: node.y,
          y: node.x,
        }));
        this.setState({ infoBoxes });

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

  showInfoBox(idx) {
    const { infoBoxes } = this.state;
    infoBoxes[idx].isShown = true;
    this.setState({ infoBoxes });
  }

  hideInfoBox(idx) {
    const { infoBoxes } = this.state;
    infoBoxes[idx].isShown = false;
    this.setState({ infoBoxes });
  }

  render() {
    const { infoBoxes } = this.state;
    const { filename, lang } = this.props;

    const infoBoxEls = infoBoxes.filter(infoData => infoData.isShown).map((infoData) => {
      const styles = {
        position: 'absolute',
        left: `${infoData.x + 125}px`,
        top: `${infoData.y + 60}px`,
        width: '175px',
      };
      return (
        <InfoBox layoutStyles={styles} key={`${Object.values(infoData).join('')}Els`}>
          {infoData.text[lang]}
        </InfoBox>
      );
    });

    const infoBoxBtns = infoBoxes.map((infoData, idx) => {
      const styles = {
        position: 'absolute',
        left: `${infoData.x + 200}px`,
        top: `${infoData.y + 32}px`,
      };

      return (
        <img
          key={`${Object.values(infoData).join('')}Btns`}
          style={styles}
          className="openInfoBtn"
          src="assets/material-info-gray.svg"
          alt="cohort info"
          onMouseEnter={() => this.showInfoBox(idx)}
          onMouseLeave={() => this.hideInfoBox(idx)}
        />
      );
    });

    return (
      <div className="svgContainer">
        <svg id={idRef(filename)} className="js-timeline-tree timeline-tree" />
        {infoBoxBtns}
        {infoBoxEls}
      </div>
    );
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
