# Project Guidelines

## JavaScript Coding Style

### Function Declarations

**Always use arrow functions (`const func = () => {}`) instead of function declarations (`function func() {}`).**

Good:
```javascript
export const myFunction = (arg) => {
  return arg * 2;
};

const helperFunction = () => {
  // ...
};
```

Bad:
```javascript
export function myFunction(arg) {
  return arg * 2;
}

function helperFunction() {
  // ...
}
```

This rule applies to:
- All exported functions
- All internal helper functions
- Test utilities
- Configuration files
