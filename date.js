//module.exports.getDate= exports.getDate;
exports.getDate = function () {
  const today = new Date();
  // sunday-saturday: 0-6
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return  today.toLocaleDateString("en-US", options);
};
exports.getDay = function () {
  const today = new Date();
  // sunday-saturday: 0-6
  const options = {
    weekday: "long",
  };
  return today.toLocaleDateString("en-US", options);
};
