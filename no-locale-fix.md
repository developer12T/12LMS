# vue-datepicker-next Without Thai Locale Fix

## Problem
The vue-datepicker-next library was causing locale issues in production:
```
TypeError: a.default.locale is not a function
```

## Solution
Use vue-datepicker-next with English locale (default) instead of Thai locale to avoid the error.

## Changes Made

### 1. Keep vue-datepicker-next Dependency
- Kept in `package.json`
- Kept imports in `backlogView.vue`

### 2. Remove Thai Locale Import
**Before:**
```javascript
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import th from 'vue-datepicker-next/locale/th';
```

**After:**
```javascript
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
// Removed Thai locale import
```

### 3. Use DatePicker Without Locale
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
<DatePicker v-if="editingRowIndexes.has(index)" 
           v-model:value="item.po_detail" 
           type="date" 
           format="DD/MM/YYYY" 
           value-format="YYYY-MM-DD" 
           placeholder="เลือกวันที่" 
           :editable="false" 
           :clearable="false">
```

## Benefits

1. **No Locale Errors**: Using default English locale avoids the import issue
2. **Keep Original UI**: Maintains the original vue-datepicker-next UI
3. **Still Functional**: Date picker works perfectly, just in English
4. **Simple Fix**: Minimal changes required
5. **Stable**: Uses the most stable configuration

## What You'll See

- Date picker will show month names in English (January, February, etc.)
- Day names will be in English (Sun, Mon, Tue, etc.)
- But the functionality remains exactly the same
- Date format display is still handled by `formatThaiDate()` function for Thai display

## Deployment

1. **Use Script:**
   ```bash
   chmod +x deploy-no-locale.sh
   ./deploy-no-locale.sh
   ```

2. **Manual Steps:**
   ```bash
   # Install dependencies
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
3. The date picker should open without errors
4. Month/day names will be in English but functionality is the same
5. No more `a.default.locale is not a function` error

## Notes

- This is the simplest solution that keeps the original UI
- The date picker interface will be in English but still fully functional
- Thai date formatting for display is still handled by our custom function
- This approach is more reliable than trying to fix the Thai locale import 