async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const thlData = await getData('data/National Institute for Health and Welfare.json');

  // ***** TreeChart *****

  const treeConfig = {
    margin: {
      top: 25,
      right: 625,
      bottom: 25,
      left: 150,
    },
    width: 1200,
    height: 900,
    childrenNames: ['registers', 'categories'],
    animationDuration: 750,
    nodeSize: 7.5,
  };

  const treeSVG = d3
    .select('body')
    .append('svg')
    .attr('class', 'timeline-tree');

  const treeChart = new TreeChart(thlData, treeSVG, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  treeChart.collapseLevel(2);

  // ***** Timelines *****

  const timelineConfig = {
    width: 300,
    height: 100,
    showXAxis: false,
    showLegend: false,
  };
  treeChart.treeData.children.forEach((registerNode, registerIdx) => {
    registerNode.children.forEach((categoryNode, categoryIdx) => {
      let timelineConfigExt = timelineConfig;
      if (
        registerIdx === treeChart.treeData.children.length - 1 &&
        categoryIdx === registerNode.children.length - 1
      ) {
        timelineConfigExt = { ...timelineConfig, showXAxis: true, showLegend: true };
      }
      let timelineData = categoryNode.data.samplings;
      const parentsData = timelineData.filter(el => el.parents);
      const subjectsData = timelineData.filter(el => !el.parents);
      timelineData = [
        {
          type: 'parents',
          data: parentsData,
        },
        {
          type: 'subjects',
          data: subjectsData,
        },
      ];
      const categoryTimeline = new CategoryTimeline(timelineData, treeSVG, timelineConfigExt);
      categoryTimeline.moveTo(categoryNode.y + 350, categoryNode.x - 15); // NOTE: the tree structure kind of swap x and y coords
      categoryTimeline.update();
    });
  });
}

main();
