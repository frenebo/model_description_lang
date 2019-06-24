var gulp = require("gulp");
var ts = require("gulp-typescript");
var del = require("del");
var connect = require('gulp-connect');
var gulpTslint = require("gulp-tslint");
var tslint = require("tslint");

gulp.task("clean", () => del(["build"]));

gulp.task("copy", () => gulp.src(["app/**/*", "!app/**/*.ts"]).pipe(gulp.dest("build")));

gulp.task("ace_copy", () => {
  return gulp.src("node_modules/ace-builds/src-noconflict/**/*")
    .pipe(gulp.dest("build/dependencies/ace-src"));
});

gulp.task("start_server", () => {
  return connect.server({
    root: "build",
    port: 3000,
  });
});

var project = ts.createProject('tsconfig.json');

gulp.task("ts", function() {
  return gulp.src(["app/**/*.ts", "node_modules/types/@types/**/*.d.ts"])
    .pipe(project()).js
    .pipe(gulp.dest("build"));
});


gulp.task("serve", gulp.series(
  "clean",
  "ts",
  "copy",
  "ace_copy",
  "start_server",
));

gulp.task("tslint", function() {
  var program = tslint.Linter.createProgram("./tsconfig.json");

  return gulp.src(["app/**/*.ts"])
    .pipe(gulpTslint({ program: program }))
    .pipe(gulpTslint.report({
      configuration: {},
      rulesDirectory: null,
      emitError: true,
      reportLimit: 0,
      summarizeFailureOutput: true
    }));;
});
