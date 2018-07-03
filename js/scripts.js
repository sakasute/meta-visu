class TimelineRegister {
  constructor(data, svgElement, config) {
    this.scaleStart = config.scaleStartDate
      ? config.scaleStartDate
      : d3.min(data.map(el => this.constructor.findEarliestStartDate(el.samplings)));
    this.scaleEnd = config.scaleEndDate
      ? config.scaleEndDate
      : d3.max(data, el => this.constructor.findLatestEndDate(el.samplings));
    this.data = data;
    this.svg = svgElement
      .append('g')
      .attr('class', 'timeline-chart')
      .attr('width', config.size.width)
      .attr('height', config.size.height)
      .attr('transform', `translate(${config.pos.x}, ${config.pos.y})`);
    this.x = d3
      .scaleTime()
      .domain([this.scaleStart, this.scaleEnd])
      .range([0, config.size.width]);
    this.xAxisPadding = 30;
    this.y = d3
      .scaleBand()
      .domain(data.map(el => el.name))
      .range([this.xAxisPadding, config.size.height])
      .round(true)
      .padding(0.25);
    this.config = config;
  }

  static findEarliestStartDate(dataArr) {
    return d3.min(dataArr, el => new Date(el.startDate));
  }

  static findLatestEndDate(dataArr) {
    return d3.max(dataArr, el => new Date(el.endDate));
  }

  calculateSectionWidth(sectionData) {
    return this.x(new Date(sectionData.endDate)) - this.x(new Date(sectionData.startDate));
  }

  calculateSectionXPos(sectionData) {
    return this.x(new Date(sectionData.startDate));
  }

  update() {
    const xAxis = d3.axisBottom(this.x);

    this.svg
      .append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${this.config.size.height - this.xAxisPadding})`);

    // enter
    const timelineEnter = this.svg
      .selectAll('.timeline')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'timeline');

    timelineEnter.attr('transform', d => `translate(0, ${this.y(d.name) - this.xAxisPadding})`);

    const sectionEnter = timelineEnter
      .selectAll('timeline__section')
      .data(d => d.samplings)
      .enter()
      .append('rect')
      .attr('class', 'timeline__section');

    sectionEnter
      .attr('x', d => this.calculateSectionXPos(d))
      .attr('height', this.y.bandwidth())
      .attr('width', d => this.calculateSectionWidth(d));
  }

  moveTo(x, y) {
    this.svg.attr('transform', `translate(${x}, ${y})`);
  }
}

class TreeChart {
  constructor(data, svgElement, config) {
    const treeHeight = config.size.height - config.margin.top - config.margin.bottom;
    const treeWidth = config.size.width - config.margin.left - config.margin.right;
    const treeLayout = d3.tree().size([treeHeight, treeWidth]);

    const hierarchy = d3.hierarchy(data, d => this.constructor.findChildArr(d));

    this.treeData = treeLayout(hierarchy);

    this.svg = svgElement
      .attr('width', config.size.width)
      .attr('height', config.size.height)
      .append('g')
      .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

    this.config = config;

    this.sourceCoord = { x: treeHeight / 2, y: 0 };
  }

  // FIXME: this is just an ugly ugly function, probs should use recursion
  collapseLevel(lvl) {
    switch (lvl) {
      case 0:
        if (this.treeData.children) {
          this.treeData.childrenStored = this.treeData.children;
          this.treeData.children = null;
          this.updateNodes();
          this.updateLinks();
        }
        break;
      case 1:
        this.treeData.children.forEach((el) => {
          if (el.children) {
            el.childrenStored = el.children;
            el.children = null;
            this.updateNodes();
            this.updateLinks();
          }
        });
        break;
      case 2:
        this.treeData.children.forEach(el =>
          el.children.forEach((el2) => {
            if (el2.children) {
              el2.childrenStored = el2.children;
              el2.children = null;
              this.updateNodes();
              this.updateLinks();
            }
          }));
        break;
      default:
    }
  }

  // NOTE: Changing d implicitly changes nodesData which implicitly changes this.treeData.
  clickNode(d) {
    if (d.children) {
      d.childrenStored = d.children;
      d.children = null;
    } else {
      d.children = d.childrenStored;
      d.childrenStored = null;
    }

    this.sourceCoord = {
      x: d.x,
      y: d.y,
    };
    this.updateNodes();
    this.updateLinks();
  }

  drawNodeCircles(nodeGroup) {
    nodeGroup
      .append('circle')
      .attr('class', 'node__circle')
      .attr('r', this.config.nodeSize)
      .style('fill', d => (d.childrenStored ? 'lightsteelblue' : 'white'));
  }

  moveNodesInPlace(nodeGroup) {
    nodeGroup
      .transition()
      .duration(this.config.animationDuration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`);
  }

  /* eslint-disable class-methods-use-this */
  addNodeLabels(nodeGroup) {
    nodeGroup
      .append('text')
      .attr('class', 'node__label')
      .attr('dy', '.35em')
      .attr('x', d => (d.children || d.childrenStored ? -13 : 13))
      .attr('text-anchor', d => (d.children || d.childrenStored ? 'end' : 'start'))
      .text(d => d.data.name);
  }
  /* eslint-enable class-methods-use-this */

  updateNodes() {
    const nodesData = this.treeData.descendants();
    const nodeSelection = this.svg
      .selectAll('g.node')
      .data(nodesData, d => (d.parent ? d.parent.data.name + d.data.name : d.data.name));

    // enter
    const nodeEnter = nodeSelection
      .enter()
      .filter(d => d.depth > 0)
      .append('g')
      .attr('class', 'node')
      .attr('transform', () => `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`)
      .on('click', (d) => {
        this.clickNode(d);
      });

    this.drawNodeCircles(nodeEnter.merge(nodeSelection));
    this.moveNodesInPlace(nodeEnter);
    this.addNodeLabels(nodeEnter);

    // exit
    nodeSelection
      .exit()
      .transition()
      .duration(this.config.animationDuration)
      .attr('transform', `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`)
      .remove();
  }

  updateLinks() {
    const linksData = this.treeData.descendants().slice(1);
    const linkSelection = this.svg
      .selectAll('path.link')
      .data(linksData, d => (d.parent ? d.parent.data.name + d.data.name : d.data.name));

    // enter
    const linkEnter = linkSelection
      .enter()
      .filter(d => d.depth > 1) // don't draw links to root element
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        const o = { x: this.sourceCoord.x, y: this.sourceCoord.y };
        return this.constructor.diagonal(o, o);
      });

    linkEnter
      .transition()
      .duration(750)
      .attr('d', d => this.constructor.diagonal(d, d.parent));

    // exit
    linkSelection
      .exit()
      .transition()
      .duration(750)
      .attr('d', () => {
        const o = { y: this.sourceCoord.y, x: this.sourceCoord.x };
        return this.constructor.diagonal(o, o);
      })
      .remove();
  }

  static findChildArr(object) {
    const childArrNames = ['registerAdmins', 'registers', 'samplings'];
    const childrenName = childArrNames.filter(name => object[name] !== undefined)[0];
    if (childrenName !== undefined) {
      return object[childrenName];
    }
    return null;
  }

  static diagonal(s, d) {
    const path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;

    return path;
  }
}

async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const data = await getData('poiminnat.json');

  const treeConfig = {
    margin: {
      top: 20,
      right: 400,
      bottom: 20,
      left: 0,
    },
    size: {
      width: 1000,
      height: 800,
    },
    animationDuration: 750,
    nodeSize: 7.5,
  };

  const treeSVG = d3.select('body').append('svg');

  const treeChart = new TreeChart(data, treeSVG, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  treeChart.collapseLevel(2);

  console.log(treeChart.treeData);

  // ***** TIMELINE *****

  // ***** TIMELINE TEST *****
  const timelineConfig = {
    size: {
      width: 400,
      height: 250,
    },
    pos: {
      x: 0,
      y: 0,
    },
    barHeight: 15,
  };
  // const timelineSVG = d3
  //   .select('body')
  //   .append('svg')
  //   .attr('height', timelineConfig.size.height)
  //   .attr('width', timelineConfig.size.width);
  // const registerData = data.registerAdmins[1].registers;
  // const timeline = new TimelineRegister(registerData, timelineSVG, timelineConfig);
  // timeline.update();
}

main();
