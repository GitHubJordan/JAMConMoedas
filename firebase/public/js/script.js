document.getElementById('converterBtn').addEventListener('click', function() {
    const valor = parseFloat(document.getElementById('valor').value);
    const deMoeda = document.getElementById('deMoeda').value;
    const paraMoeda = document.getElementById('paraMoeda').value;

    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const resultadoDiv = document.getElementById('resultado');
    const historico = document.getElementById('historico');

    resultadoDiv.innerText = "";

    if (!valor || valor <= 0) {
        resultadoDiv.innerText = "Por favor, insira um valor válido.";
        return;
    }

    progressBarContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#0B5ED7';
    progressBar.setAttribute('aria-valuenow', 0);

    const API_KEY = 'd4ef642e74df5e11658c9fd7';
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${deMoeda}`;

    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
    }, 200);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const taxa = data.conversion_rates[paraMoeda];
            const valorConvertido = valor * taxa;

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressBar.setAttribute('aria-valuenow', 100);

            resultadoDiv.innerText = `${valor} ${deMoeda} é equivalente a ${valorConvertido.toFixed(2)} ${paraMoeda}`;

             const itemHistorico = document.createElement('li');
             itemHistorico.classList.add('list-group-item');
             itemHistorico.innerText = `${valor} ${deMoeda} -> ${valorConvertido.toFixed(2)} ${paraMoeda}`;
             historico.appendChild(itemHistorico);

            setTimeout(() => {
                progressBarContainer.style.display = 'none';
            }, 1000);
        })
        .catch(error => {
            clearInterval(progressInterval);
            progressBarContainer.style.display = 'none';
            resultadoDiv.innerText = "Erro na conversão. Verifique as moedas ou conexão com a API.";
        });
});
