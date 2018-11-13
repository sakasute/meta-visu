import d3 from './d3imports';

import './TreeChart.css';

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
      lang: config.lang ? config.lang : 'en',
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

  // NOTE: src: https://bl.ocks.org/mbostock/7555321
  // FIXME: make it better?
  static wrapText(textSelections, width) {
    textSelections.each(function wrap() {
      const text = d3.select(this);
      const words = text
        .text()
        .split(/\s+/)
        .reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.25;
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy'));
      const dx = parseFloat(text.attr('dx'));
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', `${dy}em`);
      /* eslint-disable */
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + 'em')
            .attr('dx', dx)
            .text(word);
        }
      }
      /* eslint enable */
    });
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
          return '-1.75em';
        case 'under':
          return '1.25em';
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
  }

  /* eslint-disable class-methods-use-this */
  moveNodesInPlace(nodeGroup) {
    nodeGroup.attr('transform', d => `translate(${d.y}, ${d.x})`);
  }

  addNodeLabels(nodeGroup) {
    nodeGroup
      .filter(d => d.parent)
      .append('a')
      .append('text')
      .attr('class', 'tree__node-label')
      .attr('dy', d => this.constructor.calculateLabelPlacement(d))
      .attr('dx', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.data.isHarmonized ? d.data.name[this.config.lang] + ' (*)' : d.data.name[this.config.lang])
      .call(this.constructor.wrapText, 205);

    // add actual links to nodes with URLs
    nodeGroup
      .selectAll('a')
      .filter(d => {
        const link = d.data.link ? d.data.link[this.config.lang] : '';
        if (link !== '') {
          return true;
        }
      })
      .attr('href', d => d.data.link[this.config.lang])
      .attr('rel', 'noopener noreferrer')
      .attr('target', '_blank')
      .attr('class', 'tree__url-link');

    // NOTE: handle root node separately to support text wrapping
    this.addRootLabel(nodeGroup.filter(d => !d.parent));
  }

  addRootLabel(rootNode) {
    const fo = rootNode.append('foreignObject').attr('class', 'tree__html-object');

    const rootLabel = fo
      .append('xhtml:p')
      .attr('class', 'tree__html-label')
      .html(d => d.data.name[this.config.lang]);

    const boundingRect = rootLabel.node().getBoundingClientRect();
    fo.attr('transform', `translate(${-1 * boundingRect.width}, ${boundingRect.height / -2})`);
  }
  /* eslint-enable class-methods-use-this */

  updateNodes() {
    const nodesData = this.treeData.descendants();
    const nodeSelection = this.svg.selectAll('.node').data(nodesData, d => {
      const id = d.id ? d.id : this.idCounter;
      d.id = id;
      this.idCounter += 1;
      return id;
    });

    // enter
    const nodeEnter = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'tree__node')
      .attr('transform', () => `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`);

    this.moveNodesInPlace(nodeEnter);
    this.addNodeLabels(nodeEnter);

    // exit
    nodeSelection
      .exit()
      .attr('transform', `translate(${this.sourceCoord.y}, ${this.sourceCoord.x})`)
      .remove();
  }

  updateLinks() {
    const linksData = this.treeData.descendants().slice(1);
    const linkSelection = this.svg.selectAll('path.link').data(linksData, d => {
      const id = d.id ? d.id : this.idCounter;
      d.id = id;
      this.idCounter += 1;
      return id;
    });

    // enter
    const linkEnter = linkSelection
      .enter()
      .insert('path', 'g')
      .attr('class', 'tree__link')
      .attr('d', () => {
        const o = { x: this.sourceCoord.x, y: this.sourceCoord.y };
        return this.constructor.diagonal(o, o);
      });

    linkEnter.attr('d', d => this.constructor.diagonal(d, d.parent));

    // exit
    linkSelection
      .exit()
      .attr('d', () => {
        const o = { y: this.sourceCoord.y, x: this.sourceCoord.x };
        return this.constructor.diagonal(o, o);
      })
      .remove();
  }
}

export default TreeChart;
