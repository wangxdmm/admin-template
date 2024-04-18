#!/bin/bash

pnpm clear
pnpm exec vue-tsc -p tsconfig.dts.json 
cp tsconfig.temp.json ./temp/tsconfig.json 
rollup -c rollup.dts.ts --configPlugin rollup-plugin-esbuild