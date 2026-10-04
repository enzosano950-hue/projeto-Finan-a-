# Finança+

**Controle financeiro pessoal, conversor de moedas, cotações e simulador de investimentos em uma única aplicação web.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

O **Finança+** nasceu para reunir, em um só lugar, as ferramentas que uma pessoa usa no dia a dia para organizar o próprio dinheiro: registrar o que entra e o que sai, conferir o câmbio antes de uma compra ou viagem e simular quanto um aporte mensal pode render ao longo dos anos.

A interface é escura, responsiva e foi pensada para ser simples de navegar, com uma página inicial que apresenta o projeto.
---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Telas do sistema](#telas-do-sistema)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Como funciona por dentro](#como-funciona-por-dentro)
- [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)

---

## Funcionalidades

### Página inicial
- Apresentação do projeto com chamadas para criar conta e entrar.
- Resumo das quatro ferramentas, com link direto para cada uma.
- Passo a passo de como começar.

### Painel de transações
- Cadastro de **entradas** e **saídas** com descrição, valor e tipo.
- Cartões com o total de entradas, total de saídas e **saldo atualizado em tempo real**.
- O saldo muda de cor conforme o resultado: verde quando positivo, vermelho quando negativo.
- Remoção individual de lançamentos.
- Dados salvos no navegador (`localStorage`), então continuam ali após recarregar a página.

### Conversor de moedas
- Converte um valor entre 15 moedas, entre elas real, dólar, euro, libra, iene e peso argentino.
- Botão para inverter origem e destino com um clique.
- Mostra o resultado formatado na moeda de destino, a cotação usada (`1 BRL = x USD`) e a data da cotação.
- Mensagens de erro claras para valores inválidos ou pares sem cotação disponível.

### Cotações
- Consulta de quanto uma moeda vale em relação a outra.
- Exibe a taxa e a data de referência, com uma explicação do que é a cotação e de onde vêm os dados.

### Previsão de investimentos
- Simulação de **juros compostos** com aportes mensais.
- Campos: investimento inicial, aporte mensal, taxa anual estimada e prazo em anos.
- Resultado com **valor final estimado**, **total investido** e **rendimento estimado**.
- Aviso de que se trata de uma simulação matemática e de que rentabilidade futura não é garantida.

### Autenticação
- Telas de **cadastro** (nome, idade, e-mail e senha) e **login**, integradas a um back-end em PHP com banco MySQL.

---

## Telas do sistema

| Tela | Arquivo | Descrição |
|---|---|---|
| Início | `index.html` | Apresentação do projeto|
| Login | `tela_login.html` | Entrada com e-mail e senha |
| Cadastro | `tela_cadastro.html` | Criação de conta |
| Painel | `tela_principal.html` | Controle de entradas, saídas e saldo |
| Conversor | `tela_conversor.html` | Conversão de valores entre moedas |
| Cotações | `tela_cotacao.html` | Consulta de cotação entre duas moedas |
| Investimentos | `tela_previsao.html` | Simulação de aportes e rendimento |

> 📸 **Dica:** adicione capturas de tela em uma pasta `docs/` ou `screenshots/` e referencie aqui:
> `![Página inicial](docs/inicio.png)`

---

## Tecnologias utilizadas

- **HTML5** e **CSS3** puros, sem frameworks, com variáveis CSS, Grid e Flexbox.
- **JavaScript** (ES6+) no front-end, sem dependências.
- **PHP** para cadastro e login, com sessões.
- **MySQL** para armazenar os usuários.
- **[API Frankfurter](https://frankfurter.dev/)** para as cotações de câmbio, uma API pública e gratuita.
- **Intl.NumberFormat** para formatação de moeda no padrão brasileiro.

---

## Estrutura do projeto

```
financa-plus/
├── index.html           # Página inicial
├── tela_login.html      # Login
├── tela_cadastro.html   # Cadastro
├── tela_principal.html  # Painel de transações
├── tela_conversor.html  # Conversor de moedas
├── tela_cotacao.html    # Cotações
├── tela_previsao.html   # Previsão de investimentos
├── style.css            # Estilos de todo o projeto
├── javascript.js        # Lógica do painel de transações
├── moedas.js            # Lista de moedas e consulta à API de câmbio
└── php.php              # Back-end de login e cadastro
```

---

## Como executar

### Requisitos
- Um navegador moderno.
- Para login e cadastro: **PHP 7.4+** e **MySQL/MariaDB** (por exemplo, via [XAMPP](https://www.apachefriends.org/) ou Laragon).
- Conexão com a internet para as cotações de câmbio.

### Só o front-end (sem login)
O painel, o conversor, as cotações e o simulador funcionam sem back-end. Basta abrir o arquivo `index.html` no navegador.

### Com login e cadastro

1. **Copie o projeto** para a pasta do servidor local, por exemplo `htdocs/` no XAMPP.

2. **Crie o banco de dados.** O `php.php` espera um banco chamado `banco_sistema_financeiro` com uma tabela `usuarios`:

   ```sql
   CREATE DATABASE banco_sistema_financeiro CHARACTER SET utf8mb4;
   USE banco_sistema_financeiro;

   CREATE TABLE usuarios (
       id    INT AUTO_INCREMENT PRIMARY KEY,
       nome  VARCHAR(100) NOT NULL,
       idade INT          NOT NULL,
       email VARCHAR(150) NOT NULL UNIQUE,
       senha VARCHAR(255) NOT NULL
   );
   ```

3. **Confira a conexão** no início do `php.php`. O padrão é `localhost`, usuário `root` e senha vazia:

   ```php
   $conexao = mysqli_connect('localhost', 'root', '', 'banco_sistema_financeiro');
   ```

4. **Acesse** `http://localhost/financa-plus/index.html` e crie sua conta.

---

## Como funciona por dentro

**Transações.** Cada lançamento é um objeto `{ id, descricao, valor, tipo }` guardado em um array e persistido no `localStorage` sob a chave `financaTransacoes`. A cada alteração, a tabela e os três cartões de resumo são redesenhados.

**Câmbio.** O arquivo `moedas.js` mantém a lista de moedas e consulta a API Frankfurter para obter a taxa entre dois códigos. Quando origem e destino são iguais, a taxa é 1 e nenhuma requisição é feita.

**Juros compostos.** A taxa anual informada é convertida em taxa mensal equivalente e aplicada mês a mês, somando o aporte ao final de cada período:

```
taxa_mensal = (1 + taxa_anual)^(1/12) − 1
saldo       = saldo × (1 + taxa_mensal) + aporte
```

A página inicial e a tela de Investimentos usam essa mesma lógica.

**Menu.** A página atual é destacada com fundo, cor e uma barra indicadora completa, enquanto o hover mostra um estado mais discreto, para que os dois nunca se confundam.

---

## Limitações conhecidas e próximos passos

O projeto tem fins de estudo e portfólio. Antes de qualquer uso real, estes pontos precisam de atenção:

- [ ] **Senhas em texto puro:** usar `password_hash()` e `password_verify()` do PHP.
- [ ] **SQL Injection:** trocar as consultas concatenadas por *prepared statements* (`mysqli_prepare` ou PDO).
- [ ] **Proteção de páginas:** as telas internas são `.html` e não verificam a sessão. Convertê-las para `.php` e validar `$_SESSION['logado']`.
- [ ] **Transações no banco:** hoje ficam apenas no navegador. Salvá-las por usuário no MySQL permitiria acessar de qualquer dispositivo.
- [ ] Botão "Sair" que realmente encerra a sessão (`session_destroy()`).
- [ ] Edição de transações e filtros por período ou categoria.
- [ ] Gráficos de gastos por categoria.
- [ ] Exportação dos lançamentos para CSV.
- [ ] Histórico de cotações em gráfico.

---

## Como contribuir

Contribuições são bem-vindas.

1. Faça um *fork* do repositório.
2. Crie uma branch: `git checkout -b minha-melhoria`
3. Faça o commit: `git commit -m "Adiciona minha melhoria"`
4. Envie para o seu fork: `git push origin minha-melhoria`
5. Abra um *Pull Request* descrevendo o que mudou.

---

## Licença

Defina a licença do seu projeto. Se quiser permitir uso livre, o [MIT](https://choosealicense.com/licenses/mit/) é uma boa escolha. Crie um arquivo `LICENSE` e atualize esta seção.

---

## Autor

Feito por **[Seu Nome](https://github.com/seu-usuario)**. Fique à vontade para abrir uma *issue* com dúvidas ou sugestões.
