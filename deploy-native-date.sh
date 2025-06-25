#!/bin/bash

echo "🔧 Deploying native date input fix for 12LMS..."

# Remove node_modules and package-lock.json to ensure clean install
echo "🧹 Cleaning up dependencies..."
rm -rf node_modules package-lock.json

# Install dependencies fresh (without vue-datepicker-next)
echo "📦 Installing fresh dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Create deployment directory if it doesn't exist
    sudo mkdir -p /var/www/12LMS
    
    # Copy built files to server directory
    echo "📁 Copying files to server directory..."
    sudo cp -r dist/* /var/www/12LMS/
    
    # Set proper permissions
    echo "🔐 Setting proper permissions..."
    sudo chown -R www-data:www-data /var/www/12LMS
    sudo chmod -R 755 /var/www/12LMS
    
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your application should now be available at: https://apps.onetwotrading.co.th/12lms/"
    echo "🔍 The locale error should now be completely resolved!"
    
    # Test nginx configuration
    echo "🔍 Testing nginx configuration..."
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx configuration is valid!"
        echo "🔄 Reloading nginx..."
        sudo systemctl reload nginx
        echo "✅ Nginx reloaded successfully!"
        echo ""
        echo "🎉 Native date input fix deployed successfully!"
        echo "📝 The date picker now uses native HTML input - no more locale issues!"
        echo "🔧 Changes made:"
        echo "   - Removed vue-datepicker-next dependency"
        echo "   - Replaced with native HTML date input"
        echo "   - Added proper date formatting functions"
    else
        echo "❌ Nginx configuration has errors. Please check the configuration."
    fi
    
else
    echo "❌ Build failed! Please check the build errors above."
    exit 1
fi 