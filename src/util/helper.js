const helper = {};
helper.str_dot_walk_obj = async (obj, str) => {
  try {
    str = str.split(".");
    for (const i in str) {
      if (obj[str[i]]) {
        obj = obj[str[i]];
      } else {
        obj = null;
        break;
      }
    }
    console.log('returning - ' + obj);
    return obj;
  } catch (error) {
    console.log('error ' + error);
    return null;
  }
};
module.exports = helper;
