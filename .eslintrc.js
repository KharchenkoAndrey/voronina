module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "htmlacademy/es6",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
    },
    "plugins": [
         "jsx-a11y",
         "react",
         "import"
  ]
};
