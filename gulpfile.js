const gulp 		= require('gulp');
const jshint	= require('gulp-jshint');
const concat  = require('gulp-concat');
const babel   = require('gulp-babel');

gulp.task('es6', function(){
	return gulp.src('public/es6.js').pipe(babel({presets:['es2016']})).pipe(gulp.dest('public/es6'));
});
gulp.task('es6-watch', function(){
	return gulp.watch('public/es6.js', ['es6']);
})
/* FRONT END TASKS*/
gulp.task('build-gantt', function(){
	var js = getJsSources('gantt');
	return gulp.src(js)
			.pipe(babel({ presets:['es2016'] }))
			.pipe(concat('gantt_bundle.js'))
			.pipe(gulp.dest('public/gantt/dist/'));
});

gulp.task('build-gantt-watch', ['build-gantt', 'lint-gantt'], function(){
	var js = getJsSources('gantt');
	return gulp.watch(js, ['build-gantt', 'lint-gantt']);
});

gulp.task('lint-gantt', function(){
	var js = getJsSources('gantt');
	return gulp.src('public/gantt/data/gantt/gantt.js')
					.pipe(jshint())
          .pipe(jshint.reporter('default'));
});

gulp.task('build-flow', function(){
	var js = getJsSourcesAlt('flow');
	return gulp.src(js)
			.pipe(babel({ presets:['es2016'] }))
			.pipe(concat('flow_bundle.js'))
			.pipe(gulp.dest('public/flow/dist/'));
});

gulp.task('build-flow-watch', ['build-flow'], function(){
	var js = getJsSourcesAlt('flow');
	return gulp.watch(js, ['build-flow']);
});

gulp.task('lint-flow', function(){
	var js = getJsSourcesAlt('flow');
	return gulp.src('public/flow/data/flow/flow.js')
					.pipe(jshint())
          .pipe(jshint.reporter('default'));
});

/*BACK END TASKS*/
gulp.task('lint-server', function () {
	var js = getJsSourcesServer();
	return gulp.src(js)
						.pipe(jshint())
						.pipe(jshint.reporter('default'));
});

function getJsSources(app){
	var sources = [];
	//application data classes
	sources.push('public/' + app + '/data/**/*.js');
	//application draw classes
	sources.push('public/' + app + '/draw/**/*.js');
	//application start code
	sources.push('public/' + app + '/' + app + '.js');
	return sources;
}

function getJsSourcesAlt(app){
	var sources = [];
	sources.push('public/' + app + '/modules/**/*.js');
	sources.push('public/' + app + '/utils/**/*.js');
	sources.push('public/' + app + '/setup/*.js');
	sources.push('public/' + app + '/' + app + '.js');
	return sources;
}

function getJsSourcesServer(){
	var sources = [];
	sources.push('controllers/**/*.js');
	sources.push('models/**/*.js');
	sources.push('routes/**/*.js');
	sources.push('routes/**/**/*.js');
	sources.push('server.js');
	return sources;
}