# Native Date Input Fix for 12LMS

## Problem
The vue-datepicker-next library was causing locale issues in production:
```
TypeError: a.default.locale is not a function
```

## Solution
Replaced vue-datepicker-next with native HTML date input to completely eliminate locale issues.

## Changes Made

### 1. Removed vue-datepicker-next Dependency
- Removed from `package.json`
- Removed all imports from `backlogView.vue`

### 2. Replaced DatePicker Component
**Before:**
```vue
<DatePicker v-if="editingRowIndexes.has(index)" 
           v-model:value="item.po_detail" 
           type="date" 
           format="DD/MM/YYYY" 
           value-format="YYYY-MM-DD" 
           placeholder="เลือกวันที่" 
           :editable="false" 
           :clearable="false" 
           :locale="th">
```

**After:**
```vue
<input v-if="editingRowIndexes.has(index)" 
       type="date" 
       :value="formatDateForInput(item.po_detail)"
       @input="item.po_detail = $event.target.value"
       class="bg-white border-none text-gray-900 text-xs rounded-lg focus:ring-1 focus:ring-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:text-white">
```

### 3. Added Helper Functions
```javascript
// Format date for HTML date input (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString || dateString.startsWith('1900-01-01')) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

// Convert HTML date input value to proper format
const convertDateInputValue = (dateString) => {
    if (!dateString) return '';
    return dateString;
};
```

## Benefits

1. **No Locale Issues**: Native HTML date input doesn't require locale configuration
2. **Better Performance**: Smaller bundle size without external date picker library
3. **Browser Native**: Uses browser's built-in date picker UI
4. **Consistent**: Works the same across all browsers and environments
5. **Accessible**: Better accessibility support

## Deployment

1. **Clean Install:**
   ```bash
   chmod +x deploy-native-date.sh
   ./deploy-native-date.sh
   ```

2. **Manual Steps:**
   ```bash
   # Remove old dependencies
   rm -rf node_modules package-lock.json
   
   # Install fresh dependencies
   npm install
   
   # Build
   npm run build
   
   # Deploy
   sudo cp -r dist/* /var/www/12LMS/
   sudo chown -R www-data:www-data /var/www/12LMS
   sudo systemctl reload nginx
   ```

## Testing

After deployment:
1. Go to the backlog page
2. Click edit on any row
3. The date field should show a native date picker
4. No more locale errors should appear

## Notes

- The native date input uses YYYY-MM-DD format internally
- Display formatting is handled by the `formatThaiDate` function
- The date picker UI will be browser-native (different on each browser)
- This solution is more reliable and maintainable 