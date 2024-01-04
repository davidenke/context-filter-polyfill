import { parseArgs } from 'node:util';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';

const { values } = parseArgs({ options: { ci: { type: 'boolean' } }, strict: false });
const { ci } = values;

export default {
  files: ['src/**/*.spec.ts'],
  coverage: true,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true })],
  reporters: ci ? [junitReporter({ outputPath: './reports/junit.xml' })] : [defaultReporter()],
};
