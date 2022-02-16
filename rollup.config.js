import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: 'src/index.js',
  output: {
    name: "index",
    dir: './',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};