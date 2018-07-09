/* eslint-disable-next-line */
class TreeChart {
  constructor(data, svgElement, config) {
    this.config = {
      width: config.width ? config.width : 400,
      height: config.height ? config.height : 200,
      margin: config.margin
        ? config.margin
        : {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      nodeSize: config.nodeSize ? config.nodeSize : 10,
      animationDuration: config.animationDuration ? config.animationDuration : 750,
    };
    const treeHeight = this.config.height - this.config.margin.top - this.config.margin.bottom;
    const treeWidth = this.config.width - this.config.margin.left - this.config.margin.right;
    const treeLayout = d3.tree().size([treeHeight, treeWidth]);

    const hierarchy = d3.hierarchy(data, d => this.constructor.findChildArr(d));

    this.treeData = treeLayout(hierarchy);

    this.svg = svgElement
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .append('g')
      .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

    this.sourceCoord = { x: treeHeight / 2, y: 0 };
    this.idCounter = 0;
  }

  addColorScheme(scheme) {}

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
    const nodeSelection = this.svg.selectAll('g.node').data(nodesData, (d) => {
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

  // TODO: restructure this function into a class constructor parameter /
  // optional parameter in config
  static findChildArr(object) {
    const childArrNames = ['registerAdmins', 'registers', 'samplings', 'categories'];
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
