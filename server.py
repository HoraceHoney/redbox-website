#!/usr/bin/env python3
"""
The Red Box - Localhost Web Application Server & CMS Engine
Serves the Red Box multi-page website on http://localhost:8080
Supports custom MIME types, CORS headers, full CMS REST endpoints, and asset uploads.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time
import json
import base64
import glob

DEFAULT_PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class RedBoxRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        # Route clean admin URLs and about URLs
        clean = path.split('?')[0].rstrip('/')
        if clean in ['/admin', '/admin/dashboard', '/admin/login']:
            return os.path.join(DIRECTORY, 'admin.html')
        elif clean in ['/about', '/about-us', '/our-story', '/story', '/the-box', '/thebox']:
            return os.path.join(DIRECTORY, 'about.html')
        elif clean in ['/branches', '/branches/', '/outlets', '/outlets/', '/locations']:
            return os.path.join(DIRECTORY, 'branches.html')
        elif clean in ['/blog', '/blogs', '/blog.html']:
            return os.path.join(DIRECTORY, 'blog.html')
        return super().translate_path(path)

    def end_headers(self):
        # Guarantee browsers never serve stale cached CSS, JS, or HTML
        headers_sent = [h.lower() for h in getattr(self, '_headers_buffer', []) if isinstance(h, str)]
        if not any('cache-control' in h for h in headers_sent):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2, ensure_ascii=False).encode('utf-8'))

    def read_json_file(self, filename, default_val=None):
        path = os.path.join(DIRECTORY, 'data', filename)
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
        return default_val if default_val is not None else []

    def write_json_file(self, filename, data):
        path = os.path.join(DIRECTORY, 'data', filename)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True

    def do_GET(self):
        clean = self.path.split('?')[0].rstrip('/')

        # 1. Homepage & Slides
        if clean in ['/api/homepage', '/api/homepage-content']:
            data = self.read_json_file('homepage_content.json', {})
            return self.send_json(data)
        elif clean in ['/api/slides', '/api/slider']:
            data = self.read_json_file('slides.json', [])
            return self.send_json(data)
        elif clean in ['/api/about', '/api/about-content']:
            data = self.read_json_file('about_content.json', {})
            return self.send_json(data)
        elif clean in ['/api/catering-content', '/api/catering/content']:
            data = self.read_json_file('catering_content.json', {})
            return self.send_json(data)
        elif clean in ['/api/franchise-content', '/api/franchises/content']:
            data = self.read_json_file('franchise_content.json', {})
            return self.send_json(data)

        # 2. Restaurant & Menu Management
        elif clean in ['/api/menu', '/api/menu-items', '/api/menu/list/']:
            data = self.read_json_file('menu.json', [])
            return self.send_json(data)
        elif clean in ['/api/branches', '/api/branches/list/']:
            data = self.read_json_file('branches.json', [])
            return self.send_json(data)

        # 3. Testimonials & Social Proof
        elif clean in ['/api/testimonials']:
            data = self.read_json_file('testimonials.json', [])
            return self.send_json(data)

        # 4. Blog Posts & Articles
        elif clean in ['/api/blogs', '/api/articles']:
            data = self.read_json_file('blogs.json', [])
            return self.send_json(data)

        # 5. Marketing & Promotions
        elif clean in ['/api/promotions', '/api/promos', '/api/offers']:
            data = self.read_json_file('promotions.json', {})
            return self.send_json(data)

        # 6. CRM Datasets (Reservations, Enquiries, Franchises, Catering)
        elif clean in ['/api/reservations', '/api/reservations/']:
            data = self.read_json_file('reservations.json', [])
            return self.send_json(data)
        elif clean in ['/api/enquiries', '/api/enquiries/']:
            data = self.read_json_file('enquiries.json', [])
            return self.send_json(data)
        elif clean in ['/api/franchises', '/api/franchise-enquiries', '/api/franchise-enquiries/']:
            data = self.read_json_file('franchises.json', [])
            return self.send_json(data)
        elif clean in ['/api/catering', '/api/catering-requests', '/api/catering-requests/']:
            data = self.read_json_file('catering.json', [])
            return self.send_json(data)

        # 7. Media Library Explorer Endpoint
        elif clean in ['/api/media', '/api/media-library']:
            media_items = []
            scan_dirs = [
                ('assets/images/dishes', 'Dishes'),
                ('assets/images', 'General'),
                ('assets/uploads', 'Uploads'),
                ('assets/videos', 'Videos')
            ]
            for rel_dir, category in scan_dirs:
                abs_dir = os.path.join(DIRECTORY, rel_dir)
                if os.path.exists(abs_dir):
                    for fname in os.listdir(abs_dir):
                        if fname.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.svg', '.mp4', '.webm')):
                            full_p = os.path.join(abs_dir, fname)
                            if os.path.isfile(full_p):
                                stat = os.stat(full_p)
                                item_cat = category
                                if category == 'General':
                                    fn_u = fname.upper()
                                    if fn_u.startswith(('FO', 'DISH', 'FOOD', 'MOMO', 'RICE', 'NOODLE', 'CHICKEN', 'PRAWN', 'PANEER')):
                                        item_cat = 'Dishes'
                                    elif fn_u.startswith(('HDR', 'BANNER', 'SLIDE', 'HERO', 'CAROUSEL')):
                                        item_cat = 'Banners'
                                media_items.append({
                                    'name': fname,
                                    'url': f"{rel_dir}/{fname}".replace('\\', '/'),
                                    'category': item_cat,
                                    'size': stat.st_size,
                                    'mtime': stat.st_mtime,
                                    'date': time.strftime('%Y-%m-%d %H:%M', time.localtime(stat.st_mtime))
                                })
            # Sort newest first
            media_items.sort(key=lambda x: x.get('mtime', 0), reverse=True)
            return self.send_json(media_items)

        try:
            return super().do_GET()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

    def do_POST(self):
        clean = self.path.split('?')[0].rstrip('/')
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            payload = json.loads(post_body.decode('utf-8')) if post_body else {}
        except Exception:
            payload = {}

        # 1. Media Upload (Base64)
        if clean in ['/api/upload', '/api/upload-media']:
            try:
                raw_filename = payload.get('filename', 'upload')
                base64_data = payload.get('data', '')
                media_type = payload.get('mediaType', 'image')
                
                if ';base64,' in base64_data:
                    base64_data = base64_data.split(';base64,')[1]
                
                file_bytes = base64.b64decode(base64_data)
                
                import re
                clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', os.path.basename(raw_filename))
                name_part, ext_part = os.path.splitext(clean_name)
                if not ext_part:
                    ext_part = '.mp4' if media_type == 'video' else '.jpg'
                
                uploads_dir = os.path.join(DIRECTORY, 'assets', 'uploads')
                os.makedirs(uploads_dir, exist_ok=True)
                
                target_filename = f"{name_part}{ext_part}"
                target_path = os.path.join(uploads_dir, target_filename)
                counter = 1
                while os.path.exists(target_path):
                    target_filename = f"{name_part}_{counter}{ext_part}"
                    target_path = os.path.join(uploads_dir, target_filename)
                    counter += 1
                
                with open(target_path, 'wb') as f:
                    f.write(file_bytes)
                
                file_url = f"assets/uploads/{target_filename}"
                return self.send_json({
                    'status': 'ok',
                    'url': file_url,
                    'filename': target_filename,
                    'size': len(file_bytes),
                    'mediaType': media_type
                })
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 2. Homepage Content
        elif clean in ['/api/homepage', '/api/homepage-content']:
            try:
                self.write_json_file('homepage_content.json', payload)
                if isinstance(payload, dict) and 'heroSlider' in payload:
                    self.write_json_file('slides.json', payload['heroSlider'])
                return self.send_json({'status': 'ok', 'message': 'Homepage content updated successfully'})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 3. About Us Content
        elif clean in ['/api/about', '/api/about-content']:
            try:
                self.write_json_file('about_content.json', payload)
                return self.send_json({'status': 'ok', 'message': 'About Us content updated successfully'})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        elif clean in ['/api/catering-content', '/api/catering/content']:
            try:
                self.write_json_file('catering_content.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Catering content updated successfully'})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        elif clean in ['/api/franchise-content', '/api/franchises/content']:
            try:
                self.write_json_file('franchise_content.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Franchise content updated successfully'})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 4. Hero Slides
        elif clean in ['/api/slides', '/api/slider']:
            try:
                self.write_json_file('slides.json', payload)
                return self.send_json({'status': 'ok', 'count': len(payload)})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 5. Menu Items (Add, Edit, Delete, Update)
        elif clean in ['/api/menu', '/api/menu-items']:
            try:
                self.write_json_file('menu.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Menu items persisted successfully', 'count': len(payload)})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 6. Branches
        elif clean in ['/api/branches']:
            try:
                self.write_json_file('branches.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Branches updated successfully', 'count': len(payload)})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 7. Testimonials
        elif clean in ['/api/testimonials']:
            try:
                self.write_json_file('testimonials.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Testimonials updated successfully', 'count': len(payload)})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 8. Blogs & Articles
        elif clean in ['/api/blogs', '/api/articles']:
            try:
                self.write_json_file('blogs.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Blog articles updated successfully', 'count': len(payload)})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 9. Promotions & Offers
        elif clean in ['/api/promotions', '/api/promos']:
            try:
                self.write_json_file('promotions.json', payload)
                return self.send_json({'status': 'ok', 'message': 'Promotions and offers updated successfully'})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        # 10. CRM Ingestion Endpoints (Reservations, Enquiries, Franchise Leads, Catering)
        elif clean in ['/api/reservations', '/api/reservations/']:
            try:
                existing = self.read_json_file('reservations.json', [])
                if isinstance(payload, list):
                    existing = payload
                else:
                    payload['id'] = payload.get('id', len(existing) + 1)
                    payload['status'] = payload.get('status', 'New')
                    payload['created_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
                    existing.insert(0, payload)
                self.write_json_file('reservations.json', existing)
                return self.send_json({'status': 'ok', 'message': 'Reservation recorded', 'id': payload.get('id')})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        elif clean in ['/api/enquiries', '/api/enquiries/']:
            try:
                existing = self.read_json_file('enquiries.json', [])
                if isinstance(payload, list):
                    existing = payload
                else:
                    payload['id'] = payload.get('id', len(existing) + 1)
                    payload['status'] = payload.get('status', 'New')
                    payload['date'] = time.strftime('%Y-%m-%d %H:%M')
                    existing.insert(0, payload)
                self.write_json_file('enquiries.json', existing)
                return self.send_json({'status': 'ok', 'message': 'Enquiry received', 'id': payload.get('id')})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        elif clean in ['/api/franchises', '/api/franchise-enquiries', '/api/franchise-enquiries/']:
            try:
                existing = self.read_json_file('franchises.json', [])
                if isinstance(payload, list):
                    existing = payload
                else:
                    payload['id'] = payload.get('id', len(existing) + 1)
                    payload['status'] = payload.get('status', 'New')
                    payload['date'] = time.strftime('%Y-%m-%d %H:%M')
                    existing.insert(0, payload)
                self.write_json_file('franchises.json', existing)
                return self.send_json({'status': 'ok', 'message': 'Franchise lead recorded', 'id': payload.get('id')})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        elif clean in ['/api/catering', '/api/catering-requests', '/api/catering-requests/']:
            try:
                existing = self.read_json_file('catering.json', [])
                if isinstance(payload, list):
                    existing = payload
                else:
                    payload['id'] = payload.get('id', len(existing) + 1)
                    payload['status'] = payload.get('status', 'New Lead')
                    payload['created_at'] = time.strftime('%Y-%m-%d %H:%M')
                    existing.insert(0, payload)
                self.write_json_file('catering.json', existing)
                return self.send_json({'status': 'ok', 'message': 'Catering request registered', 'id': payload.get('id')})
            except Exception as e:
                return self.send_json({'status': 'error', 'message': str(e)}, 500)

        self.send_response(404)
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        self.end_headers()

    def end_headers(self):
        # Enable CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        # Ensure proper MIME types for modern web assets
        if path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.webp'):
            return 'image/webp'
        elif path.endswith('.webm'):
            return 'video/webm'
        elif path.endswith('.mp4'):
            return 'video/mp4'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        elif path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        elif path.endswith('.woff2'):
            return 'font/woff2'
        return super().guess_type(path)

    def log_message(self, format, *args):
        # Clean logging
        sys.stdout.write("[%s] %s\n" % (self.log_date_time_string(), format % args))

def open_browser(port):
    time.sleep(0.8)
    url = f"http://localhost:{port}"
    print(f"\nOpening {url} in your default browser...")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        # Ignore client disconnects like ConnectionResetError
        exc = sys.exc_info()[1]
        if isinstance(exc, (ConnectionResetError, ConnectionAbortedError, BrokenPipeError)):
            return
        super().handle_error(request, client_address)

def run():
    port = DEFAULT_PORT
    server = None
    
    # Try finding an available port
    for test_port in [DEFAULT_PORT, 8081, 8082, 3000, 5000]:
        try:
            server = ThreadedTCPServer(("", test_port), RedBoxRequestHandler)
            port = test_port
            break
        except OSError:
            continue
    
    if not server:
        print(f"Error: Ports {DEFAULT_PORT}-5000 are in use.")
        sys.exit(1)
        
    print(f"==================================================")
    print(f"  The Red Box Web Application Server & CMS Engine")
    print(f"  Live at: http://localhost:{port}")
    print(f"  Admin Console: http://localhost:{port}/admin.html")
    print(f"  Directory: {DIRECTORY}")
    print(f"==================================================")
    
    # Run server
    while True:
        try:
            server.serve_forever()
            break
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            continue
        except KeyboardInterrupt:
            print("\nShutting down server...")
            server.shutdown()
            server.server_close()
            break
        except Exception as e:
            print(f"Server exception: {e}")
            time.sleep(0.5)

if __name__ == '__main__':
    run()
