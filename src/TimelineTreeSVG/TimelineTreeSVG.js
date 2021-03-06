import React, { Component } from "react";
import PropTypes from "prop-types";

import InfoBox from "../InfoBox/InfoBox";

import d3 from "../_js/d3Visualizations/d3imports";

import TreeChart from "../_js/d3Visualizations/TreeChart";
import CategoryTimeline from "../_js/d3Visualizations/CategoryTimeline";
import {
  //sortTreeData,
  calculateregisterDetailCount,
  idRef
} from "../_js/helpers";

import "./TimelineTreeSVG.css";

class TimelineTreeSVG extends Component {
  constructor(props) {
    super(props);

    this.hasManyCohortsSelected = Object.values(props.cohortFilter).filter(cohort => cohort.isSelected).length > 4

    this.showInfoBox = this.showInfoBox.bind(this);
    this.hideInfoBox = this.hideInfoBox.bind(this);
    this.treeConfigDefault = {
      width: 350,
      height: 100,
      posX: 125,
      posY: 50,
      childrenNames: ["registers", "registerDetails"],
      nodeSize: 7.5
    };
    this.timelineConfigDefault = {
      width: 250,
      height: 100,
      showXAxis: this.hasManyCohortsSelected ? true : false,
      showLegend: this.hasManyCohortsSelected ? true : false,
      xAxisOrientation: this.hasManyCohortsSelected ? "top" : "bottom",
      scaleEndDate: new Date()
    };
    this.state = {
      infoBoxes: []
    };
  }

  // FIXME: could/should be broken into smaller pieces
  componentDidMount() {
    const { data: dataProp, lang } = this.props;
    // NOTE: this makes sure that we are not modifying the original data in the App-component
    const {
      filename,
      cohortFilter,
      treeFilter,
      treeConfig,
      timelineConfig
    } = this.props;

    // ***** TreeChart *****
    const selectedNodes = dataProp.registers
      .filter(register => treeFilter[register.name.en].isSelected)
      .map(register => ({ ...register }));
    // NOTE: the map() above is important step! It replaces the reference to the original register with a copy.

    selectedNodes.forEach(register => {
      register.registerDetails = register.registerDetails
        .filter(
          registerDetail =>
            treeFilter[register.name.en].registerDetails[registerDetail.name.en]
              .isSelected
        )
        .map(registerDetail => ({ ...registerDetail }));
    });

    const selectedCohorts = Object.values(cohortFilter).filter(
      cohort => cohort.isSelected
    );
    const cohortNum = selectedCohorts.length;
    const categoryTimelineHeight = 2 * (20 * cohortNum) + 30;

    const data = { ...dataProp, registers: selectedNodes };
    // data = sortTreeData(data);
    const registerDetailCount = calculateregisterDetailCount(data);
    const treeHeight = registerDetailCount * categoryTimelineHeight;
    this.treeConfigDefault.height = treeHeight;

    const treeConfigExtended = { ...this.treeConfigDefault, ...treeConfig };

    const svg = d3
      .select(`.js-timeline-tree#${idRef(filename)}`)
      .attr("height", treeHeight + 100)
      .attr("width", 1050);

    const treeChart = new TreeChart(data, svg, treeConfigExtended);
    treeChart.updateNodes();
    treeChart.updateLinks();

    // ***** Timelines *****
    const timelineConfigCohorts = {
      height: categoryTimelineHeight,
      width: 350,
      cohorts: selectedCohorts.map(cohort => cohort.name)
    };
    const timelineConfigExtended = {
      ...this.timelineConfigDefault,
      ...timelineConfig,
      ...timelineConfigCohorts
    };

    if (treeChart.treeData.children) {
      treeChart.treeData.children.forEach((registerNode, registerIdx) => {
        const { infoBoxes } = this.state;
        registerNode.children
          .filter(node => node.data.notes[lang] !== "")
          .forEach(node =>
            infoBoxes.push({
              isShown: false,
              text: node.data.notes,
              x: node.y,
              y: node.x
            })
          );
        this.setState({ infoBoxes });

        registerNode.children.forEach(
          (registerDetailNode, registerDetailIdx) => {
            let timelineConfigModified = timelineConfigExtended;

            if (registerIdx === 0 && registerDetailIdx === 0) {
              timelineConfigModified = {
                ...timelineConfigExtended,
                showXAxis: true,
                showLegend: true,
                xAxisOrientation: "top"
              };
            }

            const filteredCohortData = registerDetailNode.data.samplings.filter(
              sampling => cohortFilter[sampling.cohort].isSelected
            );
            const categoryTimeline = new CategoryTimeline(
              filteredCohortData,
              svg,
              timelineConfigModified
            );
            // NOTE: the tree structure kind of swaps x and y coords
            categoryTimeline.moveTo(
              registerDetailNode.y + 300,
              registerDetailNode.x + 50 + 10 - categoryTimelineHeight / 2
            );
            categoryTimeline.update();
          }
        );
      });
    }
  }

  componentWillUnmount() {
    const { filename } = this.props;
    const nodeToEmpty = document.querySelector(
      `.js-timeline-tree#${idRef(filename)}`
    );
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

    const infoBoxEls = infoBoxes
      .filter(infoData => infoData.isShown)
      .map(infoData => {
        const styles = {
          position: "absolute",
          left: `${infoData.x + 125}px`,
          top: `${infoData.y + 60}px`,
          width: "175px"
        };
        return (
          <InfoBox
            layoutStyles={styles}
            key={`${Object.values(infoData).join("")}Els`}
          >
            {infoData.text[lang]}
          </InfoBox>
        );
      });

    const infoBoxBtns = infoBoxes.map((infoData, idx) => {
      const styles = {
        position: "absolute",
        left: `${infoData.x + 200}px`,
        top: `${infoData.y + 32}px`
      };

      return (
        <img
          key={`${Object.values(infoData).join("")}Btns`}
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
  cohortFilter: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  filename: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
  treeFilter: PropTypes.object.isRequired,
  treeConfig: PropTypes.object.isRequired,
  timelineConfig: PropTypes.object.isRequired
};

export default TimelineTreeSVG;
