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
    };

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
      .range([0, this.config.width]);

    this.y = d3
      .scaleBand()
      .domain(data.map(el => el.name))
      .range([this.xAxisPadding, this.config.height])
      .round(true)
      .padding(0.25);
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
      .attr('transform', `translate(0, ${this.config.height - this.xAxisPadding})`);

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
