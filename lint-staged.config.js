module.exports = {
  '*.{js,ts,json,md}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ]
};
