async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const data = await getData('poiminnat.json');
  console.log(data);

  const margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120,
  };
  const width = 960 - margin.right - margin.left;
  const height = 800 - margin.top - margin.bottom;

  let i = 0;
  const duration = 750;

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const treemap = d3.tree().size([height, width]);

  const root = d3.hierarchy(data, d => d.children);
  root.x0 = height / 2;
  root.y0 = 0;

  function diagonal(s, d) {
    const path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

    return path;
  }

  function update(source) {
    console.log(source);
    const treeData = treemap(source);
    const nodes = treeData.descendants();
    const links = nodes.slice(1);

    nodes.forEach((d) => {
      d.y = d.depth * 180;
    });

    const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++i));

    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', () => `translate(${source.y0}, ${source.x0})`);
    /* .on('click',...) */

    nodeEnter
      .append('circle')
      .attr('class', 'node')
      .attr('r', 10)
      .style('fill', 'black');

    const nodeUpdate = nodeEnter.merge(node);

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`);

    const link = svg.selectAll('path.link').data(links, d => d.id);

    const linkEnter = link
      .enter()
      .insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal(o, o);
      });

    const linkUpdate = linkEnter.merge(link);

    linkUpdate
      .transition()
      .duration(duration)
      .attr('d', d => diagonal(d, d.parent));
  }

  update(root);
}

main();
