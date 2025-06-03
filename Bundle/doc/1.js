let obj = {};
let ageValue = 10;
Object.defineProperty(obj, 'age', {
  get: () => ageValue,
  set: (val) => {
    ageValue = val;
    return ageValue;
  }
})