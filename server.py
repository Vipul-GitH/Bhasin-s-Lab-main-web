from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
HOST="0.0.0.0"
PORT=2010
if __name__=="__main__":
    print(f"Server running at http://localhost:{PORT}")
    ThreadingHTTPServer((HOST,PORT),SimpleHTTPRequestHandler).serve_forever()
