document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pessoa-form');
    const listaPessoas = document.getElementById('lista-pessoas');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const telefone = document.getElementById('telefone').value;

        if (!validarCPF(cpf)) {
            alert('CPF inválido. Por favor, insira um CPF válido.');
            return;
        }

        if (!validarTelefone(telefone)) {
            alert('Telefone inválido. O número de telefone deve conter 11 dígitos.');
            return;
        }

        fetch('/api/pessoas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: nome, cpf: cpf, telefone: telefone })
        })   
        .then(response => response.json())
        .then(data => {
            alert(data.message); 
            adicionarPessoa(nome, cpf, telefone);
            form.reset(); 
        })
        .catch(error => console.error('Erro:', error));
    });

    function adicionarPessoa(nome, cpf, telefone) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `Nome: ${nome}, CPF: ${cpf}, Telefone: ${telefone}`;
        listaPessoas.appendChild(li); 
    }

    function validarCPF(cpf) { // tive que pegar de um fórum esse aqui, ô trem dificil
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        
        let soma = 0;
        let resto;

        // Calcula o primeiro dígito verificador
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        // Calcula o segundo dígito verificador
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    function validarTelefone(telefone) {
        telefone = telefone.replace(/[^\d]+/g, ''); // tirar caracteres nao numericos
        return telefone.length === 11;
    }
});
