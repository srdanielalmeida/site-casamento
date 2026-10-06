import http.server
import socketserver
import os
import urllib.parse
import sys

DEFAULT_PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Remove query parameters para resolver o caminho do arquivo
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        
        if path == '':
            self.path = '/index.html' + ('?' + parsed.query if parsed.query else '')
        elif not os.path.splitext(path)[1]:
            # Se não tem extensão, verifica se existe arquivo .html
            full_path = os.path.join(DIRECTORY, path.lstrip('/'))
            if os.path.exists(full_path + '.html'):
                self.path = path + '.html' + ('?' + parsed.query if parsed.query else '')
            elif os.path.exists(os.path.join(full_path, 'index.html')):
                self.path = path + '/index.html' + ('?' + parsed.query if parsed.query else '')
                
        return super().do_GET()

if __name__ == '__main__':
    start_port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    candidate_ports = [start_port, 3333, 8080, 8081, 8082]
    
    server_started = False
    for p in candidate_ports:
        try:
            httpd = socketserver.TCPServer(("", p), CleanURLHandler)
            print(f"Servidor rodando em http://localhost:{p}", flush=True)
            server_started = True
            with httpd:
                httpd.serve_forever()
            break
        except OSError:
            continue

    if not server_started:
        print("Erro: nenhuma porta disponível.", flush=True)
        sys.exit(1)
