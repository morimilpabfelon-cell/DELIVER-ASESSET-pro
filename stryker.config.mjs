export default {
  mutate: ['src/routing.ts', 'src/motion.ts'],
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress', 'html', 'json'],
  thresholds: { high: 90, low: 80, break: 80 },
  concurrency: 2,
  timeoutMS: 10000,
  vitest: { configFile: 'vitest.config.ts' },
};
