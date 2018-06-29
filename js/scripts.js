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
  const sourceData = await getData('poiminnat.json');
  const tree = initializeTree(sourceData);

  updateNodes(tree.treeData, tree.treeSVG, tree.sourcePoint);
  updateLinks(tree.treeData, tree.treeSVG, tree.sourcePoint);

  // ***** timeline prototype *****
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
