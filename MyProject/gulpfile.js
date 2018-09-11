//включение модуля, который мы установили через npm i / модуля gulp
var gulp = require('gulp'),
//подключаем плагин sass в файл gulp
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer')
    ;

//Задание для галпа и функция котораябудет выполняться при запуске задания
//gulp mytask
gulp.task('sass', function () {
    return gulp.src('app/sass/*.sass') 
    //Команда плагина(преобразовали)
    //expanded для развернутого КСС
    //Обработка ошибки
    .pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
    .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'],{cascade: true}))
    //Вывели
    .pipe(gulp.dest('app/css'))
    //Будем "инжектить" наши стили
    .pipe(browserSync.reload({stream: true}))
    

});

//Таск для сборки и сжатия всех скриптов
gulp.task('scripts', function(){
   return gulp.src([
       'app/libs/jquery/dist/jquery.min.js',
       'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
   ]) 
    //Конкатинируем все файлы в один
    .pipe(concat('libs.min.js'))
    //Сжимаем
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

//Будет сжимать все либы
gulp.task('css-libs',['sass'],function(){
   return gulp.src('app/css/libs.css')
   //Сожмем его
    .pipe(cssnano())
    //Переименуем и добавим суффикс min
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('app/css'))
    
    
});


//Автоматическое обновление - рифалилоад
gulp.task('browser-sync',function(){
   //Выбираем папку-сервер
   browserSync({
       server: {
           baseDir: 'app'
       },
       //отключаем уведомления, если не нравится
       notify: false
   });
});


//Будем чистить папку dist
gulp.task('clean',function(){
    return del.sync('dist');
});

//Будем чистить Кэш
gulp.task('clear',function(){
    return cache.clearAll();
});


//Таск сжимаем картинки
gulp.task('img',function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        //imagemin на сайте можно почитать описание
        interlaced: true,
        progressive: true,
        svgoPlugins: [{remmoveViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});

//Метод Watch для проверки сохраняемых файлов
//В квадратных скобках перечисляем таски которые необходимо выполнить до запуска синка(до того как выполнится вотч)
gulp.task('watch', ['browser-sync','css-libs','scripts'], function () {
    //Автокомпиляция
    gulp.watch('app/sass/**/*.sass',['sass']);
    gulp.watch('app/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.js',browserSync.reload);
});


//Соберем все
gulp.task('build',['clean','img','sass','scripts'],function(){
    
    //Все css
    var buildCss = gulp.src([
        'app/css/topmenu.css',
		'app/css/topmenu_logo.css',
		'app/css/slider.css',
		'app/css/bottom_menu.css',
		'app/css/game_area.css',
		'app/css/footer.css',
        'app/css/libs.min.css',
    ])
    .pipe(gulp.dest('dist/css'));
    //Все шрифты
    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
    //JS файлы
    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));
    //HTML
    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});


//Еще немного теории (Шаблоны выборки): 
//'app/sass/**/*.sass' -все файлы типа sass в любой из подпапок любой вложенности от папки sass
//'!app/sass/main.sass' -исключая файл main.sass
//['!app/sass/main.sass','app/sass/**/*.sass'] -исключая файл main.sass все файлы sass
//'!app/sass/*.+(scss|sass)' -исключая все файлы scss и sass из выбранной директории
 


//gulp.task('mytask', function () {
    //Команда src файла котрая напрямую идет в выборку
//    return gulp.src('source-files')
    //pipe - вызов какой-то команды()плагина и его выполнение
//    .pipe(plugin())
    //Назначение, куда выгружаем результат
//    .pipe(gulp.dest('folder'))
//});
