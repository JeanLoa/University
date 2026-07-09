import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist/SmartLocation/browser');
const port = 4202;
const host = '127.0.0.1';
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${host}`);
  const pathname = decodeURIComponent(url.pathname);
  let filePath = join(root, pathname);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (pathname.endsWith('/')) {
    filePath = join(filePath, 'index.html');
  }

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      filePath = join(root, 'index.html');
    }
  } catch {
    filePath = join(root, 'index.html');
  }

  try {
    const data = await readFile(filePath);

    response.writeHead(200, {
      'Content-Type': types[extname(filePath)] ?? 'application/octet-stream',
    });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`SmartLocation static server: http://${host}:${port}`);
});

