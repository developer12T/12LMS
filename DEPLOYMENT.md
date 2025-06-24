# 12LMS Deployment Guide

## Problem
The application was failing with the error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

## Solution
The issue was caused by incorrect nginx configuration for serving JavaScript files with proper MIME types.

## Deployment Steps

### 1. Build the Application
```bash
# Install dependencies (if not already done)
npm install

# Build the application
npm run build
```

### 2. Update Nginx Configuration
Replace your current nginx configuration with the corrected version in `complete_nginx_config.conf`.

Key changes made:
- Added proper MIME type headers for JavaScript files (`application/javascript`)
- Added proper MIME type headers for CSS files (`text/css`)
- Fixed the assets location to point to the correct build directory
- Added proper fallback handling for Vue Router

### 3. Deploy to Server
```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

Or manually:
```bash
# Create deployment directory
sudo mkdir -p /var/www/12LMS

# Copy built files
sudo cp -r dist/* /var/www/12LMS/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/12LMS
sudo chmod -R 755 /var/www/12LMS

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Verify Deployment
- Visit: https://apps.onetwotrading.co.th/12lms/
- Check browser developer tools for any remaining errors
- Verify that JavaScript files are served with correct MIME type

## Configuration Files

### Vite Configuration (`vite.config.js`)
- Added `base: '/12lms/'` for proper asset paths
- Added build optimization settings
- Configured manual chunks for better caching

### Nginx Configuration
- Fixed MIME type handling for static assets
- Added proper caching headers
- Improved Vue Router fallback handling

## Troubleshooting

### If you still see MIME type errors:
1. Check that the nginx configuration is properly loaded:
   ```bash
   sudo nginx -t
   ```

2. Verify the build output:
   ```bash
   ls -la dist/
   ```

3. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. Clear browser cache and try again

### If assets are not loading:
1. Verify the file paths in `/var/www/12LMS/`
2. Check file permissions
3. Ensure nginx has read access to the files

## File Structure After Deployment
```
/var/www/12LMS/
├── index.html
├── favicon.ico
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [other assets]
```

## Notes
- The application is configured to run at `/12lms/` path
- All static assets are served with proper MIME types
- Vue Router fallback is properly configured
- Caching is enabled for better performance 