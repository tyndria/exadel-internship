var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('start', function () {
  nodemon({
	    script: 'Server.js',
	    ext: 'js',
	    env: { 'NODE_ENV': 'development' },
		ignore: ['node_modules/']
	})
})

gulp.task('default', ['start']);