"use strict";

const { src, dest, series, watch } = require("gulp");
const $ = require("gulp-load-plugins")();
const nib = require("nib");
const through = require("through");
const isDev = process.argv.indexOf("watch") !== -1;
const wintersmith = require("run-wintersmith");
const postcss = require("gulp-postcss");
const PORT = 8080;
const baseDir = "./contents/";

wintersmith.settings.port = PORT;

function stylus() {
  return src([`${baseDir}stylus/main.styl`, `${baseDir}stylus/dark.styl`])
    .pipe(!isDev ? through() : $.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.stylus({
        use: nib(),
      })
    )
    .pipe(!isDev ? $.minifyCss() : through())
    .pipe($.sourcemaps.write())
    .pipe(dest(baseDir + "css/"));
}

function tailwind() {
  return src([`${baseDir}stylus/utilities.css`])
    .pipe(postcss([require("tailwindcss"), require("autoprefixer")]))
    .pipe(dest(baseDir + "css/"));
}

const styles = series(tailwind, stylus);

const html = wintersmith.build;

function dev() {
  watch([baseDir + "stylus/**/*.styl"], styles);
  wintersmith.preview();
}

const build = series(styles, html);

exports.dev = dev;
exports.build = build;
