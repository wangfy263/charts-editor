module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: name => `element-plus/lib/theme-chalk/${name}.css`,
      },
    ],
  ],
};
