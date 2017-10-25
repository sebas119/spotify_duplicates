var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
//Se implmenta gulp para que el desarrollo sea mas rapido
gulp.task('default', function(){
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 8888
        },
        ignore: ['./node_modules/**']
    })
    .on('restart', function(){
        console.log('Reiniciando');
    });
})