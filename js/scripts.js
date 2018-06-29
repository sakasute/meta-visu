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

  drawNodeCircles(nodeEnter) {
    nodeEnter
      .append('circle')
      .attr('class', 'node__circle')
      .attr('r', this.config.nodeSize)
      .style('fill', 'gray');
  }

  updateNodes() {
    const nodesData = this.treeData.descendants();
    const nodeSelection = this.svg
      .selectAll('g.node')
      .data(nodesData, d => (d.parent ? d.parent.data.name + d.data.name : d.data.name));

    // enter
    const nodeEnter = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', () => `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`)
      .on('click', (d) => {
        this.clickNode(d);
      });

    this.drawNodeCircles(nodeEnter);

    nodeEnter
      .transition()
      .duration(this.config.animationDuration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`);

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

function findChildArr(object) {
  const childArrNames = ['registerAdmins', 'registers', 'samplings'];
  const childrenName = childArrNames.filter(name => object[name] !== undefined)[0];
  if (childrenName !== undefined) {
    return object[childrenName];
  }
  return null;
}

function diagonal(s, d) {
  const path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;

  return path;
}

function initializeTree(data) {
  const margin = {
    top: 20,
    right: 90,
    bottom: 20,
    left: 90,
  };
  const width = 960 - margin.right - margin.left;
  const height = 600 - margin.top - margin.bottom;

  const treeSVG = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const treeLayout = d3.tree().size([height, width]);

  const hierarchy = d3.hierarchy(data, d => findChildArr(d));

  const sourcePoint = {
    x0: height / 2,
    y0: 0,
  };

  const treeData = treeLayout(hierarchy);

  return { treeData, treeSVG, sourcePoint };
}

function updateNodes(treeData, treeSVG, sourcePoint) {
  const nodesData = treeData.descendants();
  const nodeSelection = treeSVG
    .selectAll('g.node')
    .data(nodesData, d => (d.parent ? d.parent.data.name + d.data.name : d.data.name));

  const nodeEnter = nodeSelection
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', () => `translate(${sourcePoint.y0}, ${sourcePoint.x0})`)
    .on('click', (d) => {
      if (d.children) {
        d.childrenStored = d.children;
        d.children = null;
      } else {
        d.children = d.childrenStored;
        d.childrenStored = null;
      }
      // NOTE: Changing d implicitly changes nodesData which implicitly changes treeData.
      updateNodes(treeData, treeSVG, {
        x0: d.x,
        y0: d.y,
      });
      updateLinks(treeData, treeSVG, {
        x0: d.x,
        y0: d.y,
      });
    });

  nodeEnter
    .append('circle')
    .attr('class', 'node__circle')
    .attr('r', 10)
    .style('fill', 'gray');

  nodeEnter
    .transition()
    .duration(750)
    .attr('transform', d => `translate(${d.y}, ${d.x})`);

  const nodeExit = nodeSelection
    .exit()
    .transition()
    .duration(750)
    .attr('transform', `translate(${sourcePoint.y0}, ${sourcePoint.x0})`)
    .remove();
}

function updateLinks(treeData, treeSVG, sourcePoint) {
  const linksData = treeData.descendants().slice(1);
  const linkSelection = treeSVG
    .selectAll('path.link')
    .data(linksData, d => (d.parent ? d.parent.data.name + d.data.name : d.data.name));

  // enter
  const linkEnter = linkSelection
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('d', () => {
      const o = { x: sourcePoint.x0, y: sourcePoint.y0 };
      return diagonal(o, o);
    });

  linkEnter
    .transition()
    .duration(750)
    .attr('d', d => diagonal(d, d.parent));

  const linkExit = linkSelection
    .exit()
    .transition()
    .duration(750)
    .attr('d', () => {
      const o = { y: sourcePoint.y0, x: sourcePoint.x0 };
      return diagonal(o, o);
    })
    .remove();
}

async function main() {
  const data = await getData('poiminnat.json');

  const treeConfig = {
    margin: {
      top: 20,
      right: 90,
      bottom: 20,
      left: 90,
    },
    size: {
      width: 960,
      height: 600,
    },
    animationDuration: 750,
    nodeSize: 10,
  };

  const treeSVG = d3.select('body').append('svg');

  const treeChart = new TreeChart(data, treeSVG, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();
  // ***** timeline prototype *****
  const width = 460;
  const height = 75;

  const dataShard = data.registerAdmins[0].registers[0].samplings; // one set of samplings
  const timeStart = new Date(1987, 0, 1); // TODO: calculate from data
  const timeEnd = new Date(2017, 11, 31);

  const x = d3
    .scaleTime()
    .domain([timeStart, timeEnd])
    .range([0, width]);

  // **** TIMELINE ****
  const timeChart = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  timeChart
    .selectAll('rect')
    .data(dataShard)
    .enter()
    .append('rect')
    .attr('class', 'time-chart__bar')
    .attr('height', 15)
    .attr('width', d => x(new Date(d.endDate)) - x(new Date(d.startDate)))
    .attr('x', d => x(new Date(d.startDate)))
    .attr('y', height - 50);

  const xAxis = d3.axisBottom(x);

  timeChart
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - 30})`);
}

main();
