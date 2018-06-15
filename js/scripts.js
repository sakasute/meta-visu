async function getData(file) {
  return fetch(file)
    .then(res => res.json())
    .then(dataJson => dataJson);
}

async function main() {
  const data = await getData('poiminnat.json');
  console.log(data);
}

main();
