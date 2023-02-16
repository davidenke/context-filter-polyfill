import { parseArgs } from 'node:util';
import { type BuildOptions, build, context } from 'esbuild';

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '3500' },
    serve: { type: 'boolean' },
  },
});
const { port, serve } = values;

const options: BuildOptions = {
  entryPoints: ['src/index.ts', 'src/index.html'],
  outdir: 'dist',
  format: 'iife',
  bundle: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  target: ['es6'],
  loader: { '.html': 'copy' },
};

try {
  if (serve) {
    const ctx = await context({
      ...options,
      banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload())`,
      },
    });
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
