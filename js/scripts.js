function createNavbar(fileNames) {
  fileNames
    .map(name => name.split('.')[0])
    .sort()
    .forEach((name) => {
      const navItem = document.createElement('li');
      navItem.classList.add('nav__item');
      navItem.innerHTML = `<button class="nav-btn js-nav-btn" data-nav=${name}>${name}</button>`;
      document.getElementsByClassName('js-nav-list')[0].appendChild(navItem);
    });
}

async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const fileNames = await getData('data/filenames.json');
  const thlData = await getData('data/National Institute for Health and Welfare.json');

  createNavbar(fileNames);

  // ***** TreeChart *****

  const treeConfig = {
    width: 500,
    height: 800,
    posX: 125,
    posY: 50,
    childrenNames: ['registers', 'categories'],
    animationDuration: 750,
    nodeSize: 7.5,
  };

  const svg = d3
    .select('body')
    .append('svg')
    .attr('height', 900)
    .attr('width', 1050)
    .attr('class', 'timeline-tree');

  const treeChart = new TreeChart(thlData, svg, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  treeChart.collapseLevel(2);

  // ***** Timelines *****

  const timelineConfig = {
    width: 200,
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
      const categoryTimeline = new CategoryTimeline(timelineData, svg, timelineConfigExt);
      categoryTimeline.moveTo(categoryNode.y + 300, categoryNode.x + 12.5); // NOTE: the tree structure kind of swap x and y coords
      categoryTimeline.update();
    });
  });
}

main();
