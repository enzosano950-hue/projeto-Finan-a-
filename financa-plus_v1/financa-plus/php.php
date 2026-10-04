<?php
session_start();
$conexao = mysqli_connect('localhost', 'root', '', 'banco_sistema_financeiro');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: tela_login.html');
    exit;
}

$acao = $_POST['acao'] ?? '';

if ($acao === 'login') {
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    $busca = mysqli_query($conexao, "SELECT * FROM usuarios WHERE email='$email' AND senha='$senha'");
    $contagem = mysqli_num_rows($busca);
    
    if ($contagem == 1) {
        $_SESSION['logado'] = 1;
        header('Location: tela_principal.html');
    } else {
        $_SESSION['logado'] = 0;
        header('Location: tela_login.html');
    }
    exit;
}

if ($acao === 'cadastrar') {
    $nome = $_POST['nome'];
    $idade = $_POST['idade'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Verifica se email já existe
    $busca = mysqli_query($conexao, "SELECT * FROM usuarios WHERE email='$email'");
    $contagem = mysqli_num_rows($busca);
    
    if ($contagem == 0) {
        $insercao = mysqli_query($conexao, "INSERT INTO usuarios (nome, idade, email, senha) VALUES ('$nome', $idade, '$email', '$senha')");
        if ($insercao) {
            $_SESSION['logado'] = 1;
            header('Location: tela_login.html');
        } else {
            $_SESSION['logado'] = 0;
            header('Location: tela_cadastro.html');
        }
    } else {
        $_SESSION['logado'] = 0;
        header('Location: tela_cadastro.html');
    }
    exit;
}

header('Location: tela_login.html');
exit;
?>
