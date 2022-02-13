import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: 'src/index.js',
  output: {
    dir: './',
    format: 'cjs'
  },
  plugins: [
    nodeResolve(),
    babel(),
    commonjs()
  ]
};