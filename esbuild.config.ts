import { parseArgs } from 'node:util';

import { build, type BuildOptions, context } from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '3500' },
    serve: { type: 'boolean' },
  },
});
const { port, serve } = values;

const options: BuildOptions = {
  entryPoints: [
    'src/index.ts',
    'src/index.html',
    'src/index.css',
    'src/polyfill.ts',
    'src/mocks/mock-1.jpg',
  ],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  target: ['es6'],
  loader: { '.html': 'copy', '.jpg': 'copy', '.png': 'copy' },
  plugins: [dtsPlugin()],
};

try {
  if (serve) {
    const ctx = await context(options);
    await ctx.watch();
    await ctx.serve({ servedir: 'dist', port: Number(port) });
    console.log(`> Serving on http://localhost:${port}`);
  } else {
    await build(options);
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
