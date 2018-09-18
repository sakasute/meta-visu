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
  const timelineData = [];

  config.categories.forEach((category) => {
    timelineData.push({
      type: category,
      data: samplingData.filter(el => el.category === category),
    });
  });

  return new CategoryTimeline(timelineData, svg, config);
}

// forcedFirstStr is an optional string that forces a given name placed as
// the first element of the array
export function compareByName(a, b, forcedFirstStr) {
  if (a.name === forcedFirstStr) {
    return -1;
  }
  if (b.name === forcedFirstStr) {
    return 1;
  }

  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name || b.name) {
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