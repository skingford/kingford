/*
 * @Author: kingford
 * @Date: 2021-04-17 19:40:40
 * @LastEditTime: 2021-04-17 20:15:29
 */
import { nodeResolve } from "@rollup/plugin-node-resolve"; // 解析 node_modules 中的模块
import commonjs from "@rollup/plugin-commonjs"; // cjs => esm
import alias from "@rollup/plugin-alias"; // alias 和 reslove 功能
import replace from "@rollup/plugin-replace";
import eslint from "@rollup/plugin-eslint";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";
import json from "@rollup/plugin-json"; // 支持在源码中直接引入json文件，不影响下面的
import { name, version, author } from "../package.json";

const pkgName = name;
const filePath = "index";

const banner =
  "/*!\n" +
  ` * ${name} v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} ${author}\n` +
  " * Released under the MIT License.\n" +
  " */";

export default {
  input: "src/index.js",
  // 同时打包多种规范的产物
  output: [
    {
      file: `dist/${filePath}.umd.js`,
      format: "umd",
      name: pkgName,
      banner,
    },
    {
      file: `dist/${filePath}.umd.min.js`,
      format: "umd",
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      file: `dist/${filePath}.cjs.js`,
      format: "cjs",
      name: pkgName,
      banner,
    },
    {
      file: `dist/${filePath}.esm.js`,
      format: "es",
      banner,
    },
  ],
  // 注意 plugin 的使用顺序
  plugins: [
    json(),
    clear({
      targets: ["dist"],
    }),
    alias(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      preventAssignment: true,
    }),
    nodeResolve(),
    commonjs({
      include: "node_modules/**",
    }),
    eslint({
      throwOnError: true, // 抛出异常并阻止打包
      include: ["src/**"],
      exclude: ["node_modules/**"],
    }),
    babel({ babelHelpers: "bundled" }),
  ],
};