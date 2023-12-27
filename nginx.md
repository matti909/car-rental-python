# 1. Configuración de Nginx y Certbot en Ubuntu

## 1.1. Instalación de Nginx

1. Actualizar e instalar paquetes:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

2. Instalar Nginx:
    ```bash
    sudo apt install nginx
    ```

3. Verificar el estado de Nginx:
    ```bash
    sudo systemctl status nginx
    ```

4. Editar la configuración de tu dominio:
    ```bash
    sudo nano /etc/nginx/sites-available/your-domain.com.conf
    ```

    Contenido del archivo de configuración:

    ```nginx
    server {
        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;

        server_name vps-3141735-x.dattaweb.com;
        underscores_in_headers on;

        location / {
            try_files $uri $uri/ =404;
            proxy_pass http://localhost:8000; # Cambia el puerto si es necesario
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /api {
            proxy_pass http://localhost:8000/api;
        }

        location /docs {
            proxy_pass http://localhost:8000/docs;
        }

        error_log /var/log/nginx/your-domain.com.error;
        access_log /var/log/nginx/your-domain.com.access;
    }
    ```

5. Crear un enlace simbólico para habilitar la configuración:
    ```bash
    sudo ln -s /etc/nginx/sites-available/your-domain.com.conf /etc/nginx/sites-enabled/your-domain.com.conf
    ```

6. Testear la configuración de Nginx:
    ```bash
    sudo nginx -t
    ```

7. Reiniciar Nginx después de la configuración:
    ```bash
    sudo systemctl restart nginx
    ```

## 1.2. Configuración de Certbot

1. Instalar Certbot y el complemento para Nginx:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

    Verificar la versión de Certbot:
    ```bash
    certbot --version
    ```

2. Configurar Certbot con Nginx:
    ```bash
    sudo certbot --nginx
    ```

3. Probar la renovación de certificados (simulación):
    ```bash
    sudo certbot renew --dry-run
    ```
