const Aop = {
  around: function (fnName, advice, fnObj) {
    let originalFn = fnObj[fnName];
    fnObj[fnName] = function (...arguments) {
      return advice.call(this, {
        fn: originalFn,
        args: arguments,
      });
    };
  },
  next: function (targetInfo) {
    return targetInfo.fn.apply(this, targetInfo.args);
  },
};
