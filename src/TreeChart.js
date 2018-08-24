class TreeChart {
  constructor(data, svgElement, config) {
    this.config = {
      width: config.width ? config.width : 400,
      height: config.height ? config.height : 200,
      posX: config.posX ? config.posX : 0,
      posY: config.posY ? config.posY : 0,
      childrenNames: config.childrenNames
        ? config.childrenNames
        : ['registerAdmins', 'registers', 'categories', 'samplings'],
      nodeSize: config.nodeSize ? config.nodeSize : 10,
      animationDuration: config.animationDuration ? config.animationDuration : 750,
    };
    const treeHeight = this.config.height;
    const treeWidth = this.config.width;
    const treeLayout = d3
      .tree()
      .size([treeHeight, treeWidth])
      .separation(() => 1); // NOTE: this seems to spread all the leaf nodes equally far apart

    const hierarchy = d3.hierarchy(data, d => this.findChildArr(d));

    this.treeData = treeLayout(hierarchy);

    this.svg = svgElement
      .append('g')
      .attr('class', 'tree')
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('transform', `translate(${this.config.posX}, ${this.config.posY})`)
      .append('g');

    this.sourceCoord = { x: treeHeight / 2, y: 0 };
    this.idCounter = 0;
  }

  static diagonal(s, d) {
    const path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`;

    return path;
  }

  static calculateLabelPlacement(d) {
    try {
      if (Math.ceil(d.x) > Math.ceil(d.parent.x)) {
        d.labelPosition = 'under';
      } else if (Math.ceil(d.x) < Math.ceil(d.parent.x)) {
        d.labelPosition = 'top';
      } else {
        d.labelPosition = d.parent.labelPosition ? d.parent.labelPosition : 'top';
      }
    } finally {
      switch (d.labelPosition) {
        case 'top':
          return '-1em';
        case 'under':
          return '1.5em';
        default:
          return '0em';
      }
    }
  }

  findChildArr(object) {
    const childArrNames = this.config.childrenNames;
    const childrenName = childArrNames.filter(name => object[name] !== undefined)[0];
    if (childrenName !== undefined) {
      return object[childrenName];
    }
    return null;
  }

  drawNodeCircles(nodeGroup) {
    nodeGroup
      .append('circle')
      .attr('class', 'tree__node-marker')
      .attr('r', this.config.nodeSize);
    // .style('fill', d => (d.childrenStored ? 'lightsteelblue' : 'white'));
  }
  /* eslint-disable class-methods-use-this */
  moveNodesInPlace(nodeGroup) {
    nodeGroup
      // .transition()
      // .duration(this.config.animationDuration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`);
  }

  addNodeLabels(nodeGroup) {
    nodeGroup
      .filter(d => d.parent)
      .append('text')
      .attr('class', 'tree__node-label')
      .attr('dy', d => this.constructor.calculateLabelPlacement(d))
      .attr('x', -13)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name);

    // NOTE: handle root node separately to support text wrapping
    this.addRootLabel(nodeGroup.filter(d => !d.parent));
  }

  addRootLabel(rootNode) {
    const fo = rootNode.append('foreignObject').attr('class', 'tree__html-object');

    const rootLabel = fo
      .append('xhtml:p')
      .attr('class', 'tree__html-label')
      .html(d => d.data.name);

    const boundingRect = rootLabel.node().getBoundingClientRect();
    fo.attr('transform', `translate(${-1 * boundingRect.width}, ${boundingRect.height / -2})`);
  }
  /* eslint-enable class-methods-use-this */

  updateNodes() {
    const nodesData = this.treeData.descendants();
    const nodeSelection = this.svg.selectAll('.node').data(nodesData, (d) => {
      const id = d.id ? d.id : this.idCounter;
      d.id = id;
      this.idCounter += 1;
      return id;
    });

    // enter
    const nodeEnter = nodeSelection
      .enter()
      // .filter(d => d.depth > 0)
      .append('g')
      .attr('class', 'tree__node')
      .attr('transform', () => `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`);
    // .on('click', (d) => {
    //   this.clickNode(d);
    // });

    // this.drawNodeCircles(nodeEnter.merge(nodeSelection));
    this.moveNodesInPlace(nodeEnter);
    this.addNodeLabels(nodeEnter);

    // exit
    nodeSelection
      .exit()
      // .transition()
      // .duration(this.config.animationDuration)
      .attr('transform', `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`)
      .remove();
  }

  updateLinks() {
    const linksData = this.treeData.descendants().slice(1);
    const linkSelection = this.svg.selectAll('path.link').data(linksData, (d) => {
      const id = d.id ? d.id : this.idCounter;
      d.id = id;
      this.idCounter += 1;
      return id;
    });

    // enter
    const linkEnter = linkSelection
      .enter()
      // .filter(d => d.depth > 1) // don't draw links to root element
      .insert('path', 'g')
      .attr('class', 'tree__link')
      .attr('d', () => {
        const o = { x: this.sourceCoord.x, y: this.sourceCoord.y };
        return this.constructor.diagonal(o, o);
      });

    linkEnter
      // .transition()
      // .duration(this.config.duration)
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
}

export default TreeChart;
