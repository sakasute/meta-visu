import CategoryTimeline from "./d3Visualizations/CategoryTimeline";

export function parseNameFromFilename(filename) {
  return filename.split(".")[0];
}

export function calculateregisterDetailCount(data) {
  let registerDetailCount = 0;
  data.registers.forEach(register =>
    register.registerDetails.forEach(() => (registerDetailCount += 1))
  );
  return registerDetailCount;
}

export function categoryTimelineHelper(samplingData, svg, config) {
  const timelineData = [];
  config.categories.forEach(category => {
    timelineData.push({
      category,
      data: samplingData.filter(el => el.category.en === category.en)
    });
  });

  return new CategoryTimeline(timelineData, svg, config);
}

// forcedFirstStr is an optional string that forces a given name placed as
// the first element of the array
export function compareByName(a, b, lang, forcedFirstStr) {
  if (forcedFirstStr) {
    if (a.name[lang] === forcedFirstStr[lang]) {
      return -1;
    }
    if (b.name[lang] === forcedFirstStr[lang]) {
      return 1;
    }
  }

  if (a.name[lang] < b.name[lang]) {
    return -1;
  }
  if (a.name[lang] > b.name[lang] || b.name[lang]) {
    return 1;
  }
  return 0;
}

export function idRef(filename) {
  return parseNameFromFilename(filename).replace(/ /g, "");
}

export function sortTreeData(data) {
  data.registers.sort((a, b) => compareByName(a, b));
  data.registers.forEach(register =>
    register.registerDetails.sort((a, b) => compareByName(a, b))
  );
  return data;
}
