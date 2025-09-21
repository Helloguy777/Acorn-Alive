function runStealthMode() {
  const title = "Google";
  const icon = "https://www.google.com/favicon.ico";
  const src = window.location.href;

  const popup = window.open("about:blank", "_blank");

  if (!popup || popup.closed) {
    alert("Popup blocked. Please allow popups for stealth mode to work.");
    return;
  }

  popup.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <link rel="icon" type="image/x-icon" href="${icon}">
        <style>
          html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${src}"></iframe>
      </body>
    </html>
  `);
  popup.document.close();

  window.location.href = "https://www.google.com";
}

window.onload = function () {
  // Сначала прячем загрузчик и показываем контент
  document.getElementById('loader').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  // Затем проверяем, нужно ли включить Stealth Mode
  const stealth = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
  const checkbox = document.getElementById("blankMode");
  checkbox.checked = stealth;

  if (stealth) {
    runStealthMode();
  }

  checkbox.addEventListener("change", function () {
    const isChecked = checkbox.checked;
    localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
    if (isChecked) {
      runStealthMode();
    }
  });
};

document.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    // Эта проверка нужна, чтобы не запускать загрузчик для переключателя
    if (link.closest('.stealth-mode-container')) return;
    
    var gameName = link.textContent.trim();
    if (gameName) {
        console.log("Loading " + gameName + "...");
    }

    document.getElementById('loader').style.display = 'flex';
    document.getElementById('content').style.display = 'none';

    var iframe = document.getElementById('gameFrame');
    if (iframe) {
      iframe.onload = function () {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('content').style.display = 'block';
      };
    }
  });
});

document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  let query = document.getElementById('urlInput').value.trim();
  if (!query) return;

  const rawUrl = generateSearchUrl(query);
  const encoded = self.__uv$config.encodeUrl(rawUrl);
  const proxyUrl = self.__uv$config.prefix + encoded;

  document.getElementById('loader').style.display = 'flex';
  document.getElementById('content').style.display = 'none';

  window.location.href = proxyUrl;
});

function generateSearchUrl(query) {
  try {
    new URL(query);
    return query.startsWith('http') ? query : `https://${query}`;
  } catch {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
}
