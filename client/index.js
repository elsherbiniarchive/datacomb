  Template.recordCount.count = function () {
    return BEEDATA.find().fetch().length;
  };