import { parseArgs } from 'node:util';

import { build, type BuildOptions, context } from 'esbuild';
import copyStaticFiles from 'esbuild-copy-static-files';
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
    'src/polyfill.ts',

    'src/example.ts',
    'src/example.css',
    'src/example.jpg',
  ],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  target: ['es6'],
  loader: { '.jpg': 'copy' },
  plugins: [
    dtsPlugin(),
    copyStaticFiles({ src: 'src/example.html', dest: 'dist/index.html' }),
  ],
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
