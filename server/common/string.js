module.exports.escape2Html = function (str) {
  const arrEntities = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    quot: '"',
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => arrEntities[t]);
};
