import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json' assert { type: 'json' }
const name = pkg.main.replace(/\.js$/, '')

const bundle = config => ({
  ...config,
  external: id => !/^[./]/.test(id),
})

const input_paths = [{
  path: "",
  name: `${name}`
}, {
  path: "firestore",
  name: `firestore`
}, {
  path: "types",
  name: `types`
}]

const bundles = input_paths.reduce((acc, { path, name }) => {
  let input_path = `src/${path}/index.ts`
  let output_base = `dist/${path}/${name}`
  if (path === "") {
    // input_path = 'src/index.ts'
    output_base = name
  }
  console.log(input_path)
  return acc.concat([
    bundle({
      input: input_path,
      plugins: [esbuild()],
      output: [
        {
          file: `${output_base}.js`,
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: `${output_base}.mjs`,
          format: 'es',
          sourcemap: true,
        },
      ],
    }),
    bundle({
      input: input_path,
      plugins: [dts()],
      output: {
        file: `${output_base}.d.ts`,
        format: 'es',
      },
    }),
  ])

}, [])


export default bundles
