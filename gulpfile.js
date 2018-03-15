// 引入 gulp及组件
var gulp=require('gulp'),  //gulp基础库
    minifycss=require('gulp-minify-css'),   //css压缩
    concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    rename=require('gulp-rename'),   //文件重命名
    notify=require('gulp-notify');   //提示
    clean=require('gulp-clean');   //清理
 
//css处理
gulp.task('minifycss',function(){
    var arr = [
        'src/css/mui.css',
        'src/css/mobile.css',
    ];
   return gulp.src(arr)      //设置css
       .pipe(concat('app.css'))      //合并css文件到"app.css"
       .pipe(gulp.dest('dist/css'))           //设置输出路径
       .pipe(rename({suffix:'.min'}))         //修改文件名
       .pipe(minifycss())                    //压缩文件
       .pipe(gulp.dest('dist/css'))            //输出文件目录
       .pipe(notify({message:'css task ok'}));   //提示成功
});

//JS处理
gulp.task('minifyjs',function(){
    var arr = [
        'src/js/jquery.js',
        'src/js/jquery-ui.js',
        'src/js/mui.js',
        'src/js/common.js',
        'src/js/headerConfig.js',
        'src/js/ajaxService.js',
        'src/js/q.js'
    ];
   return gulp.src(arr)  //选择合并的JS
       .pipe(concat('app.js'))   //合并js
       .pipe(gulp.dest('dist/js'))         //输出
       .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest('dist/js'))            //输出 
       .pipe(notify({message:"js task ok"}));    //提示
});

gulp.task('clean', function () {
	return gulp.src("dist")
		.pipe(clean());
});

gulp.task('default',function(){
    gulp.start('clean','minifycss','minifyjs');
});