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

function collapse(d) {
  if (d.children) {
    d.childrenStored = d.children;
    d.childrenStored.forEach(collapse);
    d.children = null;
  }
}

function clickNode(d) {
  console.log(d);
  const { source } = d;
  if (source.children) {
    source.childrenStored = source.children;
    source.children = null;
  } else {
    source.children = source.childrenStored;
    source.childrenStored = null;
  }
  console.log({ ...d, source });
  updateTree({ ...d, source });
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

  // const i = 0;
  const duration = 750;

  const treeSVG = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const treeLayout = d3.tree().size([height, width]);

  const root = d3.hierarchy(data, d => findChildArr(d));
  root.x0 = height / 2;
  root.y0 = 0;

  const tree = treeLayout(root);

  return {
    source: root,
    root,
    treeSVG,
    treeLayout,
    duration,
    tree,
  };
}

function updateTree(sourceObj) {
  console.log(sourceObj);
  const { source } = sourceObj;
  const { root } = sourceObj;
  const { duration } = sourceObj;
  const { treeSVG } = sourceObj;
  const { tree } = sourceObj;

  const nodes = tree.descendants().map(d => ({ ...d, y: d.depth * 260 }));
  const links = tree.descendants().slice(1);

  // ******** nodes ********

  // TODO: add custom key-function (adding d.id)
  const node = treeSVG.selectAll('g.node').data(nodes);

  // enter
  const nodeEnter = node
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', () => `translate(${source.y0}, ${source.x0})`)
    .on('click', (d) => {
      console.log(d);
      clickNode({
        source: d,
        root,
        duration,
        treeSVG,
        tree,
      });
    });

  nodeEnter
    .append('circle')
    .attr('class', 'node__circle')
    .attr('r', 1e-6)
    .style('fill', d => (d.childrenStored ? 'lightsteelblue' : 'white'));

  nodeEnter
    .append('text')
    .attr('class', 'node__label')
    .attr('dy', '0.35em')
    .attr('x', d => (d.children || d.childrenStored ? -13 : 13))
    .attr('text-anchor', d => (d.children || d.childrenStored ? 'end' : 'start'))
    .text(d => d.data.name);

  // update
  const nodeUpdate = nodeEnter.merge(node);

  nodeUpdate
    .transition()
    .duration(duration)
    .attr('transform', d => `translate(${d.y}, ${d.x})`);

  nodeUpdate
    .select('.node__circle')
    .attr('r', 10)
    .style('fill', d => (d.childrenStored ? 'lightsteelblue' : 'white'));

  // exit

  const nodeExit = node
    .exit()
    .transition()
    .duration(duration)
    .attr('transform', () => `translate(${root.y}, ${root.x})`)
    .remove();

  nodeExit.select('.node__circle').attr('r', 1e-6);

  nodeExit.select('.node__label').style('fill-opacity', 1e-6);

  // ******** links ********
  // TODO: add ids
  const link = treeSVG.selectAll('path.link').data(links);

  // enter
  const linkEnter = link
    .enter()
    .insert('path', 'g')
    .attr('class', 'link')
    .attr('d', () => {
      const o = { x: root.x, y: root.y };
      return diagonal(o, o);
    });

  // update
  const linkUpdate = linkEnter.merge(link);

  linkUpdate
    .transition()
    .duration(duration)
    .attr('d', d => diagonal(d, d.parent));

  // TODO: exit
}

async function main() {
  const sourceData = await getData('poiminnat.json');

  const sourceObj = initializeTree(sourceData);
  updateTree(sourceObj);

  // ********** timeline prototype ************
  const width = 460;
  const height = 75;

  const dataShard = sourceData.registerAdmins[0].registers[0].samplings; // one set of samplings
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
