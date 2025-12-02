# 🚀 Production Deployment Guide - sanbud24.pl

## ✅ Pre-Deployment Checklist

### 1. Local Testing Complete
- [x] Backend API running on localhost:5002
- [x] Frontend running on localhost:3001
- [x] All features working locally
- [x] Database migrations up to date
- [x] No compilation errors

### 2. Code Ready
- [x] All changes committed to Git
- [x] Pushed to GitHub (main branch)
- [x] No pending changes
- [x] Production configuration files ready

### 3. Domain & Hosting
- [x] Domain: sanbud24.pl registered
- [ ] Hosting server IP address obtained
- [ ] SSH access to server confirmed
- [ ] Server meets requirements (Node.js 18+, Python 3.11+)

---

## 📦 Step 1: Build Production Package

Run the deployment script:

```bash
cd /Users/haos/azure-san-bud
./deploy-production.sh
```

This will:
- Build optimized Next.js frontend
- Prepare Flask backend
- Create deployment package in `build/` directory
- Show upload instructions

---

## 🌐 Step 2: Configure DNS Records

### Get Your Server IP Address First
```bash
# From hosting provider or via SSH
ssh user@your-server
hostname -I
```

### Configure DNS in Domain Registrar

Login to your domain registrar (home.pl, OVH, etc.) and add these records:

#### Required Records:
```dns
Type: A
Name: @
Value: [YOUR_SERVER_IP]
TTL: 3600

Type: CNAME
Name: www
Value: sanbud24.pl
TTL: 3600
```

#### Optional - API Subdomain:
```dns
Type: A
Name: api
Value: [YOUR_SERVER_IP]
TTL: 3600
```

#### Email Records (if needed):
```dns
Type: MX
Name: @
Value: mail.sanbud24.pl
Priority: 10
TTL: 3600

Type: A
Name: mail
Value: [YOUR_MAIL_SERVER_IP]
TTL: 3600
```

### Verify DNS Configuration
```bash
./check-domain.sh
```

**Wait 1-4 hours for DNS propagation** ⏰

---

## 📤 Step 3: Upload Files to Server

### Option A: Using SCP (Recommended)
```bash
# Upload entire build directory
cd /Users/haos/azure-san-bud
scp -r build/* user@YOUR_SERVER_IP:/var/www/sanbud24.pl/

# Or upload as archive
tar -czf sanbud24-deploy.tar.gz build/
scp sanbud24-deploy.tar.gz user@YOUR_SERVER_IP:/tmp/
```

### Option B: Using FTP/SFTP
1. Connect to server via FileZilla or Cyberduck
2. Upload contents of `build/` directory to `/var/www/sanbud24.pl/`

### Option C: Using rsync
```bash
rsync -avz --progress build/ user@YOUR_SERVER_IP:/var/www/sanbud24.pl/
```

---

## 🔧 Step 4: Server Setup

### SSH into Your Server
```bash
ssh user@YOUR_SERVER_IP
```

### Install Dependencies

#### System Packages:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11
sudo apt install -y python3.11 python3.11-venv python3-pip

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PostgreSQL (or MySQL)
sudo apt install -y postgresql postgresql-contrib
```

#### Application Dependencies:
```bash
cd /var/www/sanbud24.pl

# Frontend
npm install --production

# Backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🗄️ Step 5: Database Setup

### PostgreSQL Setup:
```bash
# Create database and user
sudo -u postgres psql

postgres=# CREATE DATABASE sanbud_production;
postgres=# CREATE USER sanbud_user WITH PASSWORD 'your_secure_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE sanbud_production TO sanbud_user;
postgres=# \q
```

### Initialize Database:
```bash
cd /var/www/sanbud24.pl
source venv/bin/activate

# Update .env with database credentials
cat > .env << EOF
FLASK_ENV=production
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_hex(32))')
DATABASE_URL=postgresql://sanbud_user:your_secure_password@localhost/sanbud_production
PORT=5002
EOF

# Run migrations
python init_db.py
python init_admin.py
```

---

## 🌐 Step 6: Configure Web Server (Nginx)

### Create Nginx Configuration:
```bash
sudo nano /etc/nginx/sites-available/sanbud24.pl
```

**Paste this configuration:**
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sanbud24.pl www.sanbud24.pl;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    
    location / {
        return 301 https://sanbud24.pl$request_uri;
    }
}

# Redirect www to non-www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.sanbud24.pl;
    
    ssl_certificate /etc/letsencrypt/live/sanbud24.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sanbud24.pl/privkey.pem;
    
    return 301 https://sanbud24.pl$request_uri;
}

# Main site
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sanbud24.pl;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/sanbud24.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sanbud24.pl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logs
    access_log /var/log/nginx/sanbud24.pl-access.log;
    error_log /var/log/nginx/sanbud24.pl-error.log;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API (Flask)
    location /api {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin panel
    location /admin {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Static files
    location /_next/static {
        alias /var/www/sanbud24.pl/.next/static;
        expires 365d;
        access_log off;
    }
    
    location /images {
        alias /var/www/sanbud24.pl/public/images;
        expires 365d;
        access_log off;
    }
}
```

### Enable Site:
```bash
sudo ln -s /etc/nginx/sites-available/sanbud24.pl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Step 7: Install SSL Certificate

### Using Let's Encrypt (Free):
```bash
# Create directory for challenge
sudo mkdir -p /var/www/letsencrypt

# Get certificate
sudo certbot certonly --webroot \
  -w /var/www/letsencrypt \
  -d sanbud24.pl \
  -d www.sanbud24.pl \
  --email kontakt@sanbud24.pl \
  --agree-tos \
  --no-eff-email

# Restart Nginx
sudo systemctl restart nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 🔄 Step 8: Setup Process Manager (PM2)

### Install PM2:
```bash
sudo npm install -g pm2
```

### Create PM2 Ecosystem File:
```bash
cd /var/www/sanbud24.pl
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'sanbud-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/sanbud24.pl',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'sanbud-backend',
      script: '/var/www/sanbud24.pl/venv/bin/python',
      args: 'run.py',
      cwd: '/var/www/sanbud24.pl',
      env: {
        FLASK_ENV: 'production',
        PORT: 5002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
};
EOF
```

### Start Applications:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### PM2 Commands:
```bash
pm2 status              # Check status
pm2 logs               # View logs
pm2 restart all        # Restart apps
pm2 stop all           # Stop apps
pm2 monit              # Monitor
```

---

## ✅ Step 9: Verify Deployment

### Run Domain Check:
```bash
# From your local machine
./check-domain.sh
```

### Manual Verification:

1. **Website Loading:**
   - ✅ https://sanbud24.pl loads correctly
   - ✅ https://www.sanbud24.pl redirects to main domain
   - ✅ HTTP redirects to HTTPS

2. **API Endpoints:**
   ```bash
   curl https://sanbud24.pl/api/health
   # Expected: {"status":"healthy","timestamp":"..."}
   
   curl https://sanbud24.pl/api/services
   # Expected: {"success":true,"services":[...]}
   ```

3. **Admin Panel:**
   - ✅ https://sanbud24.pl/admin/login accessible
   - ✅ Can login with admin/admin123
   - ✅ Dashboard loads

4. **Features:**
   - ✅ Navigation menu works
   - ✅ Language switcher (PL/EN)
   - ✅ All images load
   - ✅ Booking calendar works
   - ✅ Contact form submits
   - ✅ Portfolio page displays

5. **SSL Certificate:**
   ```bash
   # Check SSL
   openssl s_client -connect sanbud24.pl:443 -servername sanbud24.pl
   
   # Test on ssllabs.com
   https://www.ssllabs.com/ssltest/analyze.html?d=sanbud24.pl
   ```

---

## 🔧 Step 10: Post-Deployment Tasks

### 1. Change Default Password:
```bash
# SSH to server
ssh user@YOUR_SERVER_IP
cd /var/www/sanbud24.pl
source venv/bin/activate
python

>>> from app import create_app, db
>>> from app.models.admin import Admin
>>> app = create_app()
>>> with app.app_context():
...     admin = Admin.query.filter_by(username='admin').first()
...     admin.set_password('YOUR_STRONG_PASSWORD')
...     db.session.commit()
...     print("Password changed!")
>>> exit()
```

### 2. Setup Monitoring:
```bash
# Install monitoring tools
sudo apt install -y htop netdata

# Monitor with PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

### 3. Setup Backups:
```bash
# Create backup script
sudo nano /usr/local/bin/backup-sanbud.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/sanbud24"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump sanbud_production > $BACKUP_DIR/db_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/sanbud24.pl

# Keep only last 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/backup-sanbud.sh

# Add to crontab (daily at 2 AM)
(crontab -l ; echo "0 2 * * * /usr/local/bin/backup-sanbud.sh") | crontab -
```

### 4. Setup Firewall:
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 📊 Monitoring & Maintenance

### Check Logs:
```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/sanbud24.pl-access.log
sudo tail -f /var/log/nginx/sanbud24.pl-error.log

# System logs
sudo journalctl -u nginx -f
```

### Performance Monitoring:
```bash
# System resources
htop

# PM2 monitoring
pm2 monit

# Netdata dashboard
http://YOUR_SERVER_IP:19999
```

---

## 🔄 Update Procedure

When you need to update the site:

```bash
# Local machine
cd /Users/haos/azure-san-bud
git pull
./deploy-production.sh
scp -r build/* user@YOUR_SERVER_IP:/var/www/sanbud24.pl/

# On server
ssh user@YOUR_SERVER_IP
cd /var/www/sanbud24.pl
npm install
source venv/bin/activate
pip install -r requirements.txt
pm2 restart all
```

---

## 🆘 Troubleshooting

### Site not loading:
```bash
# Check if services are running
pm2 status

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check firewall
sudo ufw status
```

### API not working:
```bash
# Check backend logs
pm2 logs sanbud-backend

# Test backend directly
curl http://localhost:5002/api/health
```

### Database connection issues:
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U sanbud_user -d sanbud_production -h localhost
```

---

## 📞 Support

- **Email:** kontakt@sanbud24.pl
- **Phone:** +48 503 691 808
- **GitHub:** kozuchowskihubert/azure-san-bud

---

## 🎉 Success Indicators

Your site is live when:
- ✅ https://sanbud24.pl loads without SSL warnings
- ✅ All pages render correctly
- ✅ API endpoints respond
- ✅ Contact form works
- ✅ Admin panel accessible
- ✅ SSL certificate A+ rating
- ✅ DNS propagated globally

**Congratulations! Your site is LIVE! 🚀**

---

**Last Updated:** 2 grudnia 2025  
**Version:** 1.0.0  
**Domain:** sanbud24.pl
