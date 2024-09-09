const express = require('express');
const { Sequelize } = require('sequelize');
const path = require('path');
const { Pessoa } = require('./models');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'public')));

// pagina unicial
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

// Cadastro de pessoa
app.post('/api/pessoas', (req, res) => {
    const { nome, cpf, telefone } = req.body;

    Pessoa.create({ nome, cpf, telefone })
        .then((novaPessoa) => {
            res.status(201).json({ message: 'Pessoa cadastrada com êxito.', pessoa: novaPessoa });
        })
        .catch((error) => {
            console.error('Erro ao cadastrar pessoa:', error);
            res.status(500).send('Erro no servidor.');
        });
});


// iniciar servidor
app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
