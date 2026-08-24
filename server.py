import http.server
import socketserver
import os
import urllib.parse

PORT = 3000
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
    with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Servidor rodando em http://localhost:{PORT}")
        httpd.serve_forever()
