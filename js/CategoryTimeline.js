/* eslint-disable-next-line */
class CategoryTimeline {
  constructor(data, svgElement, config) {
    this.config = {
      width: config.width ? config.width : 400,
      height: config.height ? config.height : 200,
      posX: config.posX ? config.posX : 0,
      posY: config.posY ? config.posY : 0,
      scaleStartDate: config.scaleStartDate ? config.scaleStartDate : new Date('1970-1-1'),
      scaleEndDate: config.scaleEndDate ? config.scaleEndDate : new Date(),
      showXAxis: config.showXAxis != null ? config.showXAxis : true,
      showLegend: config.showLegend != null ? config.showLegend : true,
    };
    console.log(this.config.showXAxis);
    console.log(this.config.showLegend);
    this.data = data;

    this.xAxisPadding = 30;

    this.svg = svgElement
      .append('g')
      .attr('class', 'timeline-chart')
      .attr('width', this.config.width)
      .attr('height', this.config.height + this.xAxisPadding)
      .attr('transform', `translate(${this.config.posX}, ${this.config.posY})`);

    this.x = d3
      .scaleTime()
      .domain([this.config.scaleStartDate, this.config.scaleEndDate])
      .range([0, this.config.width - 25]);

    this.y = d3
      .scaleBand()
      .domain(data.map(el => el.type))
      .range([this.xAxisPadding, this.config.height])
      .paddingInner(0.25)
      .round(true);
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

    this.svg.append('g').attr('class', 'category-timeline');

    if (this.config.showXAxis) {
      console.log('test');
      this.svg
        .select('.category-timeline')
        .call(xAxis)
        .attr('transform', `translate(0, ${this.config.height - this.xAxisPadding})`);
    }

    if (this.config.showLegend) {
      const legend = this.svg.append('g').attr('class', 'legend');
      legend.attr('transform', `translate(${this.config.width - 15}, 0)`);

      const category1 = legend.append('g').attr('class', 'legend__category');

      category1
        .append('rect')
        .attr('class', 'legend__color-1')
        .attr('width', this.y.bandwidth() / 2)
        .attr('height', this.y.bandwidth() / 2);

      category1
        .append('text')
        .attr('class', 'legend__label')
        .text('1987')
        .attr(
          'transform',
          `translate(${this.y.bandwidth() / 2 + 5}, ${this.y.bandwidth() / 2 - 5})`,
        );

      const category2 = legend.append('g').attr('class', 'legend__category');

      category2
        .append('rect')
        .attr('class', 'legend__color-2')
        .attr('width', this.y.bandwidth() / 2)
        .attr('height', this.y.bandwidth() / 2)
        .attr('transform', `translate(0, ${this.y.bandwidth() / 2})`);

      category2
        .append('text')
        .attr('class', 'legend__label')
        .text('1997')
        .attr('transform', `translate(${this.y.bandwidth() / 2 + 5}, ${this.y.bandwidth() - 5})`);
    }

    // enter
    const categoryEnter = this.svg
      .selectAll('.timeline')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'timeline');

    categoryEnter.attr('transform', d => `translate(0, ${this.y(d.type) - this.xAxisPadding})`);

    categoryEnter
      .filter(d => d.type === 'parents')
      .append('line')
      .attr('class', 'timeline__separator')
      .attr('x1', this.x(this.config.scaleStartDate) - 60)
      .attr('y1', this.y.bandwidth() + 5)
      .attr('x2', this.x(this.config.scaleEndDate))
      .attr('y2', this.y.bandwidth() + 5)
      .attr('stroke-width', 0.5)
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '4')
      .attr('shape-rendering', 'crispEdges');

    categoryEnter
      .append('text')
      .attr('class', 'timeline__label')
      .text(d => d.type)
      .attr('dy', '1.5em')
      .attr('dx', '-5em'); // FIXME: set text anchor correctly and change layout to position labels inside chart

    const sectionEnter = categoryEnter
      .selectAll('timeline__section')
      .data(d => d.data)
      .enter()
      .append('rect')
      .attr('class', 'timeline__section');

    sectionEnter
      .attr('x', d => this.calculateSectionXPos(d))
      .attr('height', this.y.bandwidth() / 2)
      .attr('width', d => this.calculateSectionWidth(d));

    sectionEnter
      .filter(d => d.cohort === '1997')
      .attr('transform', `translate(0, ${this.y.bandwidth() / 2})`);

    sectionEnter
      .filter(d => d.cohort === '1987')
      .attr('class', 'timeline__section timeline__section--87');
  }

  moveTo(x, y) {
    this.svg.attr('transform', `translate(${x}, ${y})`);
  }
}
