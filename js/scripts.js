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
      right: 400,
      bottom: 25,
      left: 375,
    },

    width: 1400,
    height: 800,

    animationDuration: 750,
    nodeSize: 7.5,
  };

  const treeSVG = d3.select('body').append('svg');

  const treeChart = new TreeChart(thlData, treeSVG, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  treeChart.collapseLevel(2);

  // ***** Timelines *****

  const timelineConfig = {
    size: {
      width: 400,
      height: 200,
    },
  };

  const categoryTimeline = new CategoryTimeline(
    thlData.registers[0].categories,
    treeSVG,
    timelineConfig,
  );
  categoryTimeline.update();
}

main();
