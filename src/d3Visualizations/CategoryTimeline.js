import * as d3 from 'd3';
import './CategoryTimeline.css';

class CategoryTimeline {
  constructor(data, svgElement, config) {
    this.config = {
      width: config.width ? config.width : 400,
      height: config.height ? config.height : 200,
      posX: config.posX ? config.posX : 0,
      posY: config.posY ? config.posY : 0,
      scaleStartDate: config.scaleStartDate ? config.scaleStartDate : new Date('1987-01-01'),
      scaleEndDate: config.scaleEndDate ? config.scaleEndDate : new Date(),
      xAxisOrientation: config.xAxisOrientation ? config.xAxisOrientation : 'bottom',
      showXAxis: config.showXAxis != null ? config.showXAxis : true,
      showLegend: config.showLegend != null ? config.showLegend : true,
      categories: config.categories ? config.categories : ['parents', 'subjects'],
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

  static createYearLabel(d) {
    const startDate = new Date(d.startDate);
    const endDate = new Date(d.endDate);
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const startStr = startMonth === 0 ? startYear : `${startMonth + 1}/${startYear}`;
    const endStr = endMonth === 11 ? endYear : `${endDate.getMonth() + 1}/${endYear}`;

    if (startYear === endYear) {
      if (startMonth === endMonth) {
        return startStr;
      }
      if (startMonth === 0 && endMonth === 11) {
        return startYear;
      }
    }

    return `${startStr}—${endStr}`;
  }

  drawXAxis() {
    let xAxis;
    if (this.config.xAxisOrientation === 'top') {
      xAxis = d3.axisTop(this.x);
    } else {
      xAxis = d3.axisBottom(this.x);
    }

    xAxis.ticks(d3.timeYear.every(10));

    this.svg
      .append('g')
      .attr('class', 'timeline__axis')
      .call(xAxis)
      .attr('transform', () => {
        if (this.config.xAxisOrientation === 'top') {
          return 'translate(0, -2.5)';
        }
        return `translate(0, ${this.config.height - this.xAxisPadding + 2.5})`;
      });
  }

  // FIXME: quite a clumsy way of doing this
  drawLegend() {
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
      .attr('transform', `translate(${this.y.bandwidth() / 2 + 5}, ${this.y.bandwidth() / 2 - 5})`);

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

  calculateScaleBoundDates(startDateStr, endDateStr) {
    let startDate = new Date(startDateStr);
    let endDate = new Date(endDateStr);
    const { scaleStartDate, scaleEndDate } = this.config;
    // NOTE: handle cases where time sections go out of scales
    if (startDate < scaleStartDate) {
      startDate = scaleStartDate;
    } else if (startDate > scaleEndDate) {
      startDate = scaleEndDate;
    }

    if (endDate > scaleEndDate) {
      endDate = scaleEndDate;
    } else if (endDate < scaleStartDate) {
      endDate = scaleStartDate;
    }

    return [startDate, endDate];
  }

  calculateSectionWidth(sectionData) {
    const [startDate, endDate] = this.calculateScaleBoundDates(
      sectionData.startDate,
      sectionData.endDate,
    );

    return this.x(endDate) - this.x(startDate);
  }

  calculateSectionXPos(sectionData) {
    const startDate = this.calculateScaleBoundDates(sectionData.startDate)[0];

    return this.x(startDate);
  }

  positionYearLabel(d) {
    if (this.calculateSectionWidth(d) <= 0) {
      // if section is out of scales, throw the label way off screen
      return `translate(${1000}, ${this.y.bandwidth() / 2 - 4})`;
    }

    const [startDate, endDate] = this.calculateScaleBoundDates(d.startDate, d.endDate);
    const xStart = this.x(startDate);
    const xEnd = this.x(endDate);
    let xCentre = (xStart + xEnd) / 2 - 2;

    const xEndScale = this.x(this.config.scaleEndDate);
    const limit = 20;
    const offset = 15;

    xCentre = xCentre < limit ? xCentre + offset : xCentre;
    xCentre = Math.abs(xCentre - xEndScale) < limit ? xCentre - offset : xCentre;

    return `translate(${xCentre}, ${this.y.bandwidth() / 2 - 4})`;
  }

  moveTo(x, y) {
    this.svg.attr('transform', `translate(${x}, ${y})`);
  }

  update() {
    if (this.config.showXAxis) {
      this.drawXAxis();
    }

    if (this.config.showLegend) {
      this.drawLegend();
    }
    // enter
    const categoryEnter = this.svg
      .selectAll('.timeline')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'timeline');

    categoryEnter.attr('transform', d => `translate(0, ${this.y(d.type) - this.xAxisPadding})`);

    this.config.categories.forEach((category, i) => {
      if (i < this.config.categories.length - 1) {
        categoryEnter
          .filter(d => d.type === category)
          .append('line')
          .attr('class', 'timeline__separator')
          .attr('x1', this.x(this.config.scaleStartDate) - 60)
          .attr('y1', this.y.bandwidth() + 5)
          .attr('x2', this.x(this.config.scaleEndDate))
          .attr('y2', this.y.bandwidth() + 5);
      }
    });

    categoryEnter
      .append('text')
      .attr('class', 'timeline__title')
      .text(d => d.type)
      .attr('dy', '1.5em')
      .attr('dx', '-5em'); // FIXME: set text anchor correctly and change layout to position labels inside chart

    const sectionEnter = categoryEnter
      .selectAll('timeline__section')
      .data(d => d.data)
      .enter()
      .append('g')
      .attr('class', 'timeline__section');

    // enter multiyear sections => rectangles
    sectionEnter
      .filter(d => new Date(d.startDate).getFullYear() !== new Date(d.endDate).getFullYear())
      .append('rect')
      .attr('class', 'timeline__rect')
      .attr('x', d => this.calculateSectionXPos(d))
      .attr('height', this.y.bandwidth() / 2)
      .attr('width', d => this.calculateSectionWidth(d));

    // enter 1 year sections => circles
    sectionEnter
      .filter(d => new Date(d.startDate).getFullYear() === new Date(d.endDate).getFullYear())
      .append('circle')
      .attr('r', (d) => {
        const calculatedWidth = this.calculateSectionWidth(d);
        // NOTE: if width would be 0, the section is out of scales and shouldn't be visible,
        // else it should be constant.
        return calculatedWidth === 0 ? calculatedWidth : this.y.bandwidth() / 4;
      })
      .attr('class', 'timeline__rect')
      .attr('cx', d => this.calculateSectionXPos(d))
      .attr('cy', 7.5);

    // IDEA: if short timespans become a problem
    // (ie. sections consisting of several small pieces leading to year labels overflowing),
    // they could be combined before reaching this point
    sectionEnter
      .append('text')
      .attr('class', 'timeline__year-label')
      .text(d => this.constructor.createYearLabel(d))
      .attr('text-anchor', 'middle')
      .attr('transform', d => this.positionYearLabel(d));

    sectionEnter
      .filter(d => d.cohort === '1997')
      .attr('transform', `translate(0, ${this.y.bandwidth() / 2})`)
      .select('.timeline__rect')
      .attr('class', 'timeline__rect timeline__rect--97');
  }
}

export default CategoryTimeline;