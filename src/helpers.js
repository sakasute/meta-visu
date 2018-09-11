import CategoryTimeline from './d3Visualizations/CategoryTimeline';

export function parseNameFromFilename(filename) {
  return filename.split('.')[0];
}

export function calculateCategoryCount(data) {
  let categoryCount = 0;
  data.registers.forEach(register => register.categories.forEach(category => (categoryCount += 1)));
  return categoryCount;
}

export function categoryTimelineHelper(samplingData, svg, config) {
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

export function compareByName(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export function idRef(filename) {
  return parseNameFromFilename(filename).replace(/ /g, '');
}

export function sortTreeData(data) {
  data.registers.sort((a, b) => compareByName(a, b));
  data.registers.forEach(register => register.categories.sort((a, b) => compareByName(a, b)));
  return data;
}
