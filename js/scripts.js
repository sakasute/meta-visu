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
      left: 225,
    },

    width: 1400,
    height: 1000,

    animationDuration: 750,
    nodeSize: 10,
  };

  const treeSVG = d3.select('body').append('svg');

  const treeChart = new TreeChart(thlData, treeSVG, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  treeChart.collapseLevel(2);

  // ***** Timelines *****

  const timelineConfig = {
    width: 400,
    height: 100,
  };

  let singleTimelineData = thlData.registers[1].categories[0].samplings;
  const parentsData = singleTimelineData.filter(el => el.parents);
  const subjectsData = singleTimelineData.filter(el => !el.parents);
  singleTimelineData = [
    {
      type: 'parents',
      data: parentsData,
    },
    {
      type: 'subjects',
      data: subjectsData,
    },
  ];
  console.log(singleTimelineData);

  const categoryTimeline = new CategoryTimeline(singleTimelineData, treeSVG, timelineConfig);
  categoryTimeline.update();

  categoryTimeline.moveTo(825, 70);
}

main();
