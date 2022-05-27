const convertCurrencyToNumber = (val) => {
  const data = val && val.split(",").join("");
  return val && data;
};

const formartToCurrency = (item) => {
  const result = (+item).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  const dotIndex = result.indexOf(".");
  return result.toString().slice(0, dotIndex);
};

const getToListName = (arr) => {
  let dataResult = [];
  arr.map((item) => {
    let name = item.name;
    dataResult = [...dataResult, name];
  });
  return dataResult.length > 0 && dataResult;
};

function removeDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

const convertToDate = d => {
  const [day, month, year] = d.split('-');
  return new Date(year, month - 1, day);
};

function isFloat(n){
  return Number(n) === n && n % 1 !== 0;
}


module.exports = {
  convertCurrencyToNumber,
  formartToCurrency,
  getToListName,
  removeDuplicates,
  convertToDate,
  isFloat
};
