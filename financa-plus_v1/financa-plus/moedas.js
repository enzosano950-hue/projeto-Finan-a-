const MOEDAS_PADRAO = [
    ['AED', 'Dirham dos Emirados Árabes Unidos'],
    ['ARS', 'Peso argentino'],
    ['AUD', 'Dólar australiano'],
    ['BRL', 'Real brasileiro'],
    ['CAD', 'Dólar canadense'],
    ['CHF', 'Franco suíço'],
    ['CLP', 'Peso chileno'],
    ['CNY', 'Yuan chinês'],
    ['COP', 'Peso colombiano'],
    ['EUR', 'Euro'],
    ['GBP', 'Libra esterlina'],
    ['JPY', 'Iene japonês'],
    ['MXN', 'Peso mexicano'],
    ['NZD', 'Dólar neozelandês'],
    ['USD', 'Dólar americano']
];

function nomeMoeda(codigo) {
    const moeda = MOEDAS_PADRAO.find(item => item[0] === codigo);
    return moeda ? moeda[1] : codigo;
}

function formatarMoeda(valor, codigo) {
    try {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: codigo,
            maximumFractionDigits: 2
        }).format(valor);
    } catch {
        return `${valor.toFixed(2)} ${codigo}`;
    }
}

function formatarData(data) {
    if (!data) return 'Data não informada';
    const partes = data.split('-');
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function preencherSelect(select, moedas) {
    if (!select) return;

    select.innerHTML = '<option value="">Selecione uma moeda</option>';

    moedas.forEach(([codigo, nome]) => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = `${codigo} - ${nome}`;
        select.appendChild(option);
    });
}

async function carregarMoedas(selectores) {
    const moedas = [...MOEDAS_PADRAO].sort((a, b) =>
        a[1].localeCompare(b[1], 'pt-BR')
    );

    selectores.forEach(select => preencherSelect(select, moedas));

    return moedas;
}

async function obterCotacao(origem, destino) {
    if (!origem || !destino) {
        throw new Error('Selecione as duas moedas.');
    }

    if (origem === destino) {
        return {
            rate: 1,
            date: new Date().toISOString().slice(0, 10)
        };
    }

    const url = `https://api.frankfurter.dev/v2/rate/${origem.toLowerCase()}/${destino.toLowerCase()}`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error('Cotação não disponível para este par de moedas.');
    }

    const dados = await resposta.json();
    return {
        rate: Number(dados.rate),
        date: dados.date
    };
}
