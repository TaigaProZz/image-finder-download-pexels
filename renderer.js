const { ipcRenderer } = require('electron');

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('query').value;
  const page = document.getElementById('page').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Téléchargement...';

  try {
    const message = await ipcRenderer.invoke('download-images', query, page);
    resultDiv.innerHTML = message;
  } catch (error) {
    resultDiv.innerHTML = 'Erreur : ' + error.message;
  }
});
