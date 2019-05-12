const Koa = require('koa');
const json = require('koa-json');
const KoaRouter = require('koa-router');
const path = require('path');
const render = require('koa-ejs');
const serve = require('koa-static')
const bodyParser = require('koa-bodyparser');

const Sequelize = require('sequelize');

//изменить на свой путь
const db = new Sequelize('postgres://qggphiqa:ENw4vvFkHD_HvOWCLyVjK-bq7IYu_zf5@balarama.db.elephantsql.com:5432/qggphiqa');

const app = new Koa();
const router = KoaRouter();

var login_access = 0; // Токен служит для подтверждения входа
var arrUsers = []; // для отображения всех юзеров на странице /data
var userName = 'null';

const users = db.define('users',{ //определение таблицы
    login: Sequelize.STRING,
    password: Sequelize.STRING
});

db // проверка подключения
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(json());

render(app, { //шаблоны ejs
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})

//routes
router.get('/', index);

router.get('/auth', auth_page);
router.post('/register', toRegister);
router.get('/register', toRegister);
router.post('/login', toLogin);
router.get('/login', toLogin);
router.get('/data', data_db);
async function index(ctx){
    await ctx.render('index', {
        der: userName
    });
}
async function auth_page(ctx){
    await ctx.render('auth', {
        der: login_access
    });
}
async function data_db(ctx){
    //получение всех юзеров
    var arrUsersModel = await users.findAll({}).then(user => {
        arrUsers = user;
    })
    await ctx.render('data',{
        users: arrUsers
    });
}
async function register_page(ctx){
    await ctx.render('register');
}
async function toLogin(ctx){
    const body = ctx.request.body;
    var user = await users.findOne({ //поиск в бд по требованиям
        where:{
            login: body.login,
            password: body.password
        }
    }).then(user => {
        login_access = 1;// для нотификейшена на стороне клиента
        userName = user.login;
        console.log(`Selected user: "${user.login}" with password: "${user.password}"`);
    });
    ctx.redirect('/auth/');
}
async function toRegister(ctx){
    const body = ctx.request.body;
    
    users.create({//добавление нового пользователя в базу данных
        login: `${body.login_register}`,
        password: `${body.pass_register}`
    }).then(newUser => {
        console.log(`New user ${newUser.login}, with pass ${newUser.password} has been created.`);
      });

    ctx.redirect('/auth/');
}

//bodyparser middleware
app.use(bodyParser());

// поддержка статичных файлов
app.use(router.routes()).use(router.allowedMethods());
app.use(serve('./public'));

//регистрация порта 3000 для сервера
app.listen(3000, () => console.log('Server started...'));
