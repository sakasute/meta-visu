function createNavbar(filenames) {
  filenames
    .map(name => name.split('.')[0])
    .sort()
    .forEach((name) => {
      const navItem = document.createElement('li');
      navItem.classList.add('nav__item');
      navItem.innerHTML = `<button class="nav-btn js-nav-btn" data-filename="${name}.json">${name}</button>`;
      document.getElementsByClassName('js-nav-list')[0].appendChild(navItem);
    });
}

function activateNavbar() {
  Array.from(document.getElementsByClassName('js-nav-btn')).forEach((el) => {
    el.addEventListener('click', (ev) => {
      const { filename } = el.dataset;
      console.log(filename);
      if (!Array.from(el.classList).includes('nav-btn--selected')) {
        el.classList.add('nav-btn--selected');
        drawTimelineTree(filename);
      } else {
        removeTimelineTree(filename);
        el.classList.remove('nav-btn--selected');
      }
    });
  });
}

function calculateCategoryCount(data) {
  let categoryCount = 0;
  data.registers.forEach(register => register.categories.forEach(category => (categoryCount += 1)));
  return categoryCount;
}

async function drawTimelineTree(filename) {
  const data = await getData(`data/${filename}`);
  const categoryCount = calculateCategoryCount(data);
  const treeHeight = categoryCount * 100;
  // ***** TreeChart *****

  const treeConfig = {
    width: 500,
    height: treeHeight,
    posX: 125,
    posY: 50,
    childrenNames: ['registers', 'categories'],
    animationDuration: 750,
    nodeSize: 7.5,
  };

  const svg = d3
    .select('body')
    .append('svg')
    .attr('data-filename', filename)
    .attr('height', treeHeight + 100)
    .attr('width', 1050)
    .attr('class', 'timeline-tree js-timeline-tree');

  const treeChart = new TreeChart(data, svg, treeConfig);
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

function removeTimelineTree(filename) {
  const elToRemove = document.querySelector(`.js-timeline-tree[data-filename="${filename}"]`);
  elToRemove.remove();
}

async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const filenames = await getData('data/filenames.json');

  createNavbar(filenames);
  activateNavbar();
}

main();
