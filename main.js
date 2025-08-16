import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import fetch from 'node-fetch';
import 'dotenv/config';

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

ipcMain.handle('download-images', async (event, query, page) => {
  const apiKey = "apikey";
  const downloadsDir = path.join('downloads');

  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
  }

  try {
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=illustration&per_page=10&page=${page}`);
    const data = await response.json();
    const images = data.hits;

    if (images.length === 0) return `Aucune image trouvée pour "${query}" (page ${page}).`;

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i].webformatURL;
      const imagePath = path.join(downloadsDir, `image_${i + 1}_${query}_${Date.now()}.jpg`);

      const res = await fetch(imageUrl);
      const buffer = await res.buffer();
      fs.writeFileSync(imagePath, buffer);
    }

    return `${images.length} images téléchargées dans "${downloadsDir}".`;
  } catch (error) {
    console.error(error);
    return 'Erreur : ' + error.message;
  }
});

app.whenReady().then(createWindow);
