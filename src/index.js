import TreeChart from './TreeChart';
import CategoryTimeline from './CategoryTimeline';

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

function compareByName(a, b) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function sortTreeData(data) {
  data.registers.sort((a, b) => compareByName(a, b));
  data.registers.forEach(register => register.categories.sort((a, b) => compareByName(a, b)));
  return data;
}

async function drawTimelineTree(
  filename,
  filteredRegisters = [],
  treeConfigMod = {},
  timelineConfigMod = {},
) {
  let data = await getData(`data/${filename}`);
  const filteredRegisterData = data.registers.filter(register => !filteredRegisters.includes(register.name));
  data.registers = filteredRegisterData;
  data = sortTreeData(data);
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
    .select(`main.chart-area>div[data-filename="${filename}"]`)
    .append('svg')
    .attr('data-filename', filename)
    .attr('height', treeHeight + 100)
    .attr('width', 1050)
    .attr('class', 'timeline-tree js-timeline-tree');

  const treeChart = new TreeChart(data, svg, treeConfig);
  treeChart.updateNodes();
  treeChart.updateLinks();

  // ***** Timelines *****
  console.log(timelineConfigMod.scaleEndDate);
  const timelineConfig = {
    width: 250,
    height: 100,
    showXAxis: false,
    showLegend: false,
    scaleStartDate: timelineConfigMod.scaleStartDate
      ? timelineConfigMod.scaleStartDate
      : new Date('1950-01-01'),
    scaleEndDate: timelineConfigMod.scaleEndDate ? timelineConfigMod.scaleEndDate : new Date(),
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

function activateSidebar() {
  document.querySelectorAll('.js-register-btn').forEach((el) => {
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

function activateRegisterSelector(selectorEl) {
  const { filename } = selectorEl.dataset;

  selectorEl.querySelectorAll('.js-register-select').forEach((checkboxEl) => {
    checkboxEl.addEventListener('change', () => {
      const filterList = getFilterList(filename);
      removeTimelineTree(filename);
      drawTimelineTree(filename, filterList);
    });
  });
}

function activateYearSelectControls(filename) {
  const timelineTree = document.querySelector(`.js-timeline-tree-card[data-filename="${filename}"]`);
  const setYearsBtn = timelineTree.querySelector('.js-set-years-btn');
  setYearsBtn.addEventListener('click', () => {
    let startYear = parseInt(timelineTree.querySelector('.js-start-year').value, 10);
    startYear = !isNaN(startYear) ? startYear : 1950;
    let endYear = parseInt(timelineTree.querySelector('.js-end-year').value, 10);
    endYear = !isNaN(endYear) && endYear > startYear ? endYear : new Date().getFullYear();

    startYear = `${startYear}-01-01`;
    endYear = `${endYear}-12-31`;
    console.log(endYear);
    const timelineConfigMod = {
      scaleStartDate: new Date(startYear),
      scaleEndDate: new Date(endYear),
    };
    const filteredRegisters = getFilterList(filename);
    removeTimelineTree(filename);
    drawTimelineTree(filename, filteredRegisters, {}, timelineConfigMod);
  });
}

function getFilterList(filename) {
  const selectorEl = document.querySelector(`.js-register-list[data-filename="${filename}"]`);
  const filterList = [...selectorEl.querySelectorAll('.js-register-select')]
    .filter(checkbox => !checkbox.checked)
    .map(checkbox => checkbox.dataset.identifier.split('/')[1]);

  return filterList;
}

function createSidebar(filenames) {
  filenames
    .map(name => name.split('.')[0])
    .sort()
    .forEach((name) => {
      const navItem = document.createElement('li');
      navItem.classList.add('nav__item');
      navItem.innerHTML = `<button class="btn js-register-btn" data-filename="${name}.json">${name}</button>`;
      document.querySelector('.js-nav-list').appendChild(navItem);
    });
}

async function createRegisterSelector(navItem, filename) {
  let data = await getData(`data/${filename}`);
  data = sortTreeData(data);
  const registerList = document.createElement('ul');
  registerList.classList.add('register-selector', 'js-register-list');
  registerList.dataset.filename = filename;
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

function createYearSelector(startYear, endYear, optionText = '--year--') {
  const select = document.createElement('select');
  select.classList.add('year-selector');
  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.textContent = optionText;
  select.appendChild(firstOption);
  for (let year = startYear; year <= endYear; year += 1) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }

  return select;
}

function createTimelineTreeCards(filenames) {
  filenames.forEach((filename) => {
    const placeholder = document.createElement('div');
    placeholder.classList.add('timeline-tree-wrapper', 'card', 'js-timeline-tree-card');
    placeholder.dataset.filename = filename;
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card__header');
    cardHeader.innerHTML = `
    <h2 class="title card__title">${filename.slice(0, -5)}</h2>
    <div class="year-control card__year-control js-year-control">
      <label class="year-form__label">Timeline years: </label>
    </div>`;
    const startYearSelector = createYearSelector(1900, new Date().getFullYear(), '--start year--');
    startYearSelector.classList.add('js-start-year');
    const endYearSelector = createYearSelector(1900, new Date().getFullYear(), '--end year--');
    endYearSelector.classList.add('js-end-year');
    const setYearsBtn = document.createElement('button');
    setYearsBtn.classList.add('js-set-years-btn');
    setYearsBtn.dataset.filename = filename;
    setYearsBtn.textContent = 'Set';
    const yearForm = cardHeader.querySelector('.js-year-control');
    yearForm.appendChild(startYearSelector);
    yearForm.appendChild(document.createTextNode(' — '));
    yearForm.appendChild(endYearSelector);
    yearForm.appendChild(setYearsBtn);

    placeholder.appendChild(cardHeader);
    document.querySelector('main.chart-area').appendChild(placeholder);
    activateYearSelectControls(filename);
  });
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

async function main() {
  const filenames = await getData('data/filenames.json');
  filenames.sort();
  createTimelineTreeCards(filenames);
  createSidebar(filenames);
  activateSidebar();

  const toggleBtn = document.querySelector('.js-toggle-menu');
  toggleBtn.addEventListener('click', () => {
    document.querySelector('.js-nav-card').classList.toggle('nav--closed');
    toggleBtn.classList.toggle('nav__toggle-btn--rotate');
  });

  document
    .querySelector('.js-register-btn[data-filename="National Institute for Health and Welfare.json"]')
    .click();
}

main();
