import _ from 'lodash';
import type { IPluginList } from '../types.js';

const checkPluginValue = (plugins: IPluginList): void => {
  let flag;
  if (!_.isArray(plugins)) {
    flag = false;
  } else {
    flag = plugins.every((v) => {
      let correct = _.isArray(v) || _.isString(v) || _.isFunction(v);
      if (correct && _.isArray(v)) {
        correct = _.isString(v[0]);
      }

      return correct;
    });
  }

  if (!flag) {
    throw new Error('plugins did not pass validation');
  }
};

export default checkPluginValue;
