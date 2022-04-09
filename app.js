const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/conection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

// Porta pra rodar
app.listen(PORT, function(){
    console.log(`O express está rodando na porta ${PORT}`);
});

// Body parser
app.use(bodyParser.urlencoded({extended: false}));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// DB conection
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso!");
    })
    .catch(err => {
        console.log("Ocorreu um Erro!", err);
    });


// Routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';

    if(!search){
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            });
    
        })
        .catch(err => console.log(err));
    }else{
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
                ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            });
    
        })
        .catch(err => console.log(err));
    }
    
});

// Jobs routers
app.use('/jobs', require('./routes/jobs'));