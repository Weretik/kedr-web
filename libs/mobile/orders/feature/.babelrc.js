module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        '@nx/react/babel',
        {
          runtime: 'automatic',
          useBuiltIns: 'usage',
        },
      ],
    ],
    plugins: [],
    env: {
      test: {
        presets: ['babel-preset-expo'],
        // Tests run the same React Compiler output as the app (experiments.reactCompiler in app.json).
        plugins: [
          [
            'babel-plugin-react-compiler',
            // App code only: test files and jest.mock factories must stay as written.
            { sources: (file) => !/[.]spec[.]|[/]testing[/]|test-setup/.test(file), target: '19' },
          ],
        ],
      },
    },
  };
};
