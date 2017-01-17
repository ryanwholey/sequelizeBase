const env = require('./.env');
const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const shell = require('gulp-shell');

const MODELS_PATH = `${env.MODEL_DIR}/_models`;

gulp.task('autoModel', shell.task([
        [
            'mkdir -p env.MODEL_DIR &&',
            `${env.NODE_MODULES_BIN}/sequelize-auto`,
            `--host ${env.HOST}` ,
            `--port ${env.PORT}`,
            `--user ${env.USER}`,
            (env.PASSWORD ? `--pass ${env.PASSWORD}` : ''),
            `--database ${env.DATABASE}`,
            `--output ${MODELS_PATH}`,
            '--dialect mysql',
            '--camel'
        ].join(' ')
    ])
);

gulp.task('testDB', () => {
    return gulp.src('db/tests/**/*spec.js')
        .pipe(jasmine());
});

