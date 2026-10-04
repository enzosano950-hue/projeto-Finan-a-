document.addEventListener('DOMContentLoaded', () => {
    const CHAVE = 'financaTransacoes';
    const formulario = document.getElementById('formulario-transacao');
    const lista = document.getElementById('lista-transacoes');
    const exibicaoEntradas = document.getElementById('exibicao-entradas');
    const exibicaoSaidas = document.getElementById('exibicao-saidas');
    const exibicaoTotal = document.getElementById('exibicao-total');

    function carregar() {
        try {
            const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
            return Array.isArray(dados) ? dados : [];
        } catch (e) {
            return [];
        }
    }

    function salvar() {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(transacoes));
        } catch (e) {
            console.warn('Não foi possível salvar as transações:', e);
        }
    }

    function formatarReal(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    function escapeHtml(texto) {
        return String(texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    let transacoes = carregar();

    function atualizarInterface() {
        lista.innerHTML = '';
        let entradas = 0;
        let saidas = 0;

        transacoes.forEach(transacao => {
            const valor = Number(transacao.valor);
            if (transacao.tipo === 'entrada') entradas += valor;
            else saidas += valor;

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${escapeHtml(transacao.descricao)}</td>
                <td class="${transacao.tipo === 'entrada' ? 'valor-entrada' : 'valor-saida'}">${formatarReal(valor)}</td>
                <td>${transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}</td>
                <td>
                    <button class="btn-remover" onclick="removerTransacao(${transacao.id})">Remover</button>
                </td>
            `;
            lista.appendChild(linha);
        });

        const total = entradas - saidas;
        exibicaoEntradas.textContent = formatarReal(entradas);
        exibicaoSaidas.textContent = formatarReal(saidas);
        exibicaoTotal.textContent = formatarReal(total);
        exibicaoTotal.className = `valor ${total >= 0 ? 'positivo' : 'negativo'}`;
    }

    if (formulario) {
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const descricao = document.getElementById('descricao').value.trim();
            const valor = parseFloat(document.getElementById('valor').value);
            const tipo = document.getElementById('tipo').value;

            if (!descricao || !Number.isFinite(valor) || valor <= 0) return;

            transacoes.push({ id: Date.now(), descricao, valor, tipo });
            salvar();
            atualizarInterface();
            formulario.reset();
        });
    }

    window.removerTransacao = (id) => {
        transacoes = transacoes.filter(transacao => transacao.id !== id);
        salvar();
        atualizarInterface();
    };

    atualizarInterface();
});
