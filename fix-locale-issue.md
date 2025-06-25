# Fix for vue-datepicker-next Locale Issue

## Problem
After deployment, the backlog page shows this error:
```
TypeError: a.default.locale is not a function
```

## Root Cause
The issue was caused by incorrect import of the Thai locale for vue-datepicker-next in production builds.

## Solution Applied

### 1. Changed Import Method
**Before:**
```javascript
import 'vue-datepicker-next/locale/th';
```

**After:**
```javascript
import th from 'vue-datepicker-next/locale/th';
```

### 2. Updated Component Usage
**Before:**
```vue
<DatePicker lang="th" ... />
```

**After:**
```vue
<DatePicker :locale="th" ... />
```

## Why This Fixes the Issue

1. **Import Method**: Using named import instead of side-effect import ensures the locale object is properly bundled
2. **Component Prop**: Passing the locale object directly instead of using the `lang` prop ensures proper initialization
3. **Production Build**: This approach works correctly in both development and production environments

## Files Modified
- `src/views/tms/manage/backlogView.vue`

## Testing
After applying this fix:
1. Build the application: `npm run build`
2. Deploy to server
3. Test the backlog page - the date picker should work without errors

## Alternative Solutions (if needed)
If the issue persists, consider these alternatives:

1. **Use moment.js locale instead:**
```javascript
import moment from 'moment';
import 'moment/locale/th';
moment.locale('th');
```

2. **Use native date input with custom formatting:**
```vue
<input type="date" v-model="item.po_detail" />
```

3. **Use a different date picker library** like `@vuepic/vue-datepicker` or `v-calendar` 