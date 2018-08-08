async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

function calculateCategoryCount(data) {
  let categoryCount = 0;
  data.registers.forEach(register => register.categories.forEach(category => (categoryCount += 1)));
  return categoryCount;
}

function categoryTimelineHelper(samplingData, svg, config) {
  let timelineData = samplingData;
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
  return new CategoryTimeline(timelineData, svg, config);
}

async function drawTimelineTree(filename, filteredRegisters = []) {
  const data = await getData(`data/${filename}`);
  const filteredRegisterData = data.registers.filter(register => !filteredRegisters.includes(register.name));
  data.registers = filteredRegisterData;
  const categoryCount = calculateCategoryCount(data);
  const treeHeight = categoryCount * 100;
  // ***** TreeChart *****

  const treeConfig = {
    width: 450,
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

  // ***** Timelines *****

  const timelineConfig = {
    width: 250,
    height: 100,
    showXAxis: false,
    showLegend: false,
    scaleStartDate: new Date('1950-1-1'),
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
      const categoryTimeline = categoryTimelineHelper(
        categoryNode.data.samplings,
        svg,
        timelineConfigExt,
      );
      // NOTE: the tree structure kind of swaps x and y coords
      categoryTimeline.moveTo(categoryNode.y + 300, categoryNode.x + 12.5);
      categoryTimeline.update();
    });
  });
}

function removeTimelineTree(filename) {
  const elToRemove = document.querySelector(`.js-timeline-tree[data-filename="${filename}"]`);
  if (elToRemove) {
    elToRemove.remove();
  }
}

function createNavbar(filenames) {
  filenames
    .map(name => name.split('.')[0])
    .sort()
    .forEach((name) => {
      const navItem = document.createElement('li');
      navItem.classList.add('nav__item');
      navItem.innerHTML = `<button class="btn js-btn" data-filename="${name}.json">${name}</button>`;
      document.querySelector('.js-nav-list').appendChild(navItem);
    });
}

function activateRegisterSelector(selectorEl) {
  selectorEl.querySelectorAll('.js-register-select').forEach((checkboxEl) => {
    checkboxEl.addEventListener('change', () => {
      const filename = checkboxEl.dataset.identifier.split('/')[0];
      const filterList = [...selectorEl.querySelectorAll('.js-register-select')]
        .filter(checkbox => !checkbox.checked)
        .map(checkbox => checkbox.dataset.identifier.split('/')[1]);

      removeTimelineTree(filename);
      drawTimelineTree(filename, filterList);
    });
  });
}

async function createRegisterSelector(navItem, filename) {
  const data = await getData(`data/${filename}`);
  const registerList = document.createElement('ul');
  registerList.classList.add('register-selector');
  data.registers.forEach((register) => {
    const identifier = `${filename}/${register.name}`;
    const listItem = document.createElement('li');
    listItem.classList.add('register__item');
    listItem.innerHTML = `<input class="js-register-select" type="checkbox" id="${identifier}" 
    data-identifier="${identifier}" checked/>
    <label for="${identifier}">${register.name}</label>`;
    registerList.appendChild(listItem);
  });
  navItem.appendChild(registerList);
  activateRegisterSelector(registerList);
}

async function showRegisterSelector(navItem, filename) {
  const registerSelector = navItem.querySelector('.register-selector');
  if (registerSelector === null) {
    createRegisterSelector(navItem, filename);
  } else {
    registerSelector.classList.remove('vanish');
  }
}

function hideRegisterSelector(navItem) {
  navItem.querySelector('.register-selector').classList.add('vanish');
}

function activateNavbar() {
  document.querySelectorAll('.js-btn').forEach((el) => {
    el.addEventListener('click', () => {
      const { filename } = el.dataset;
      if (![...el.classList].includes('btn--selected')) {
        el.classList.add('btn--selected');
        drawTimelineTree(filename);
        showRegisterSelector(el.parentElement, filename);
      } else {
        removeTimelineTree(filename);
        hideRegisterSelector(el.parentElement);
        el.classList.remove('btn--selected');
      }
    });
  });
}

async function main() {
  const filenames = await getData('data/filenames.json');

  createNavbar(filenames);
  activateNavbar();
  document.querySelector('.js-show-menu').addEventListener('click', () => {
    document.querySelector('.js-nav-menu').classList.remove('hidden');
  });

  document.querySelector('.js-hide-menu').addEventListener('click', () => {
    document.querySelector('.js-nav-menu').classList.add('hidden');
  });
}

main();
