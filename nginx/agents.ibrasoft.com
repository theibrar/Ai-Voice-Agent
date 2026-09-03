# Nginx reverse proxy for agents.ibrasoft.com
# Install: sudo cp nginx/agents.ibrasoft.com /etc/nginx/sites-available/agents.ibrasoft.com
# Enable:  sudo ln -sf /etc/nginx/sites-available/agents.ibrasoft.com /etc/nginx/sites-enabled/
# SSL:     sudo certbot --nginx -d agents.ibrasoft.com

server {
    listen 80;
    server_name agents.ibrasoft.com;

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS (certbot will add this automatically)
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name agents.ibrasoft.com;

    # SSL certs (managed by certbot — paths are auto-populated)
    ssl_certificate     /etc/letsencrypt/live/agents.ibrasoft.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agents.ibrasoft.com/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend (Next.js on port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Backend API (Go on port 8080)
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 10;

        # CORS headers for browser API calls
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, X-Requested-With" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # WebSocket endpoint for live calls
    location /ws {
        proxy_pass http://127.0.0.1:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
    }

    # pgAdmin (optional — accessible at /pgadmin/)
    location /pgadmin/ {
        proxy_pass http://127.0.0.1:5050/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Script-Name /pgadmin;
    }

    # Max upload size (for knowledge base / file uploads)
    client_max_body_size 50M;
}
