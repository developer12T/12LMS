#!/bin/bash

echo "🔧 Deploying vue-datepicker-next without Thai locale fix..."

# Install dependencies (including vue-datepicker-next)
echo "📦 Installing dependencies..."
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
    echo "🔍 The locale error should now be resolved (using English locale)!"
    
    # Test nginx configuration
    echo "🔍 Testing nginx configuration..."
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx configuration is valid!"
        echo "🔄 Reloading nginx..."
        sudo systemctl reload nginx
        echo "✅ Nginx reloaded successfully!"
        echo ""
        echo "🎉 vue-datepicker-next without Thai locale deployed successfully!"
        echo "📝 Changes made:"
        echo "   - Using vue-datepicker-next with English locale (default)"
        echo "   - Removed Thai locale import to avoid the error"
        echo "   - Date picker will show in English but still functional"
    else
        echo "❌ Nginx configuration has errors. Please check the configuration."
    fi
    
else
    echo "❌ Build failed! Please check the build errors above."
    exit 1
fi 