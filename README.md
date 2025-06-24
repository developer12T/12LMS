# 12LMS - TMS Report System

## Overview
This is a Vue.js application for TMS (Transport Management System) reports with real-time data integration.

## Features
- Daily Stock Report with warehouse-specific data
- Real-time API integration
- Excel export functionality
- Responsive design with dark mode support
- Loading states and error handling

## Store Structure

### ReportTMS Store (`src/stores/modules/reportTms.js`)
The reportTms store manages all TMS report data and API calls.

#### Current Endpoints:
- `GET /api/report-tms/daily-stock` - Daily stock data with warehouse breakdown

#### Usage:
```javascript
import { useReportTmsStore } from '@/stores/modules/reportTms';

const reportTmsStore = useReportTmsStore();

// Fetch daily stock data
await reportTmsStore.fetchDailyStockData();

// Access data
const data = reportTmsStore.getDailyStockData;
const loading = reportTmsStore.loading;
const error = reportTmsStore.error;
```

#### Data Structure:
The daily stock data includes:
- `item_no` - Product code
- `item_name` - Product name
- `onhand` - Total on hand quantity
- `allocated` - Total allocated quantity
- `allocatable` - Total allocatable quantity
- `in_transit` - Total in transit quantity
- `co` - Total CO quantity
- `waiting` - Total waiting quantity
- Warehouse-specific data for each warehouse (NP, MH, LP, ST, BN, NS, KR, NON, NP2)

## Components

### Daily Stock View (`src/views/tms/report/dailyStockView.vue`)
- Displays daily stock data in a responsive table
- Color-coded warehouse columns
- Excel export functionality
- Loading and error states
- Real-time data refresh

## API Integration
The application uses a centralized API client (`src/utils/api.js`) with:
- Automatic authentication handling
- Error handling for network issues
- Session management
- Request/response interceptors

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Environment Variables
Create a `.env` file with:
```
VITE_API_BASE_URL=your_api_base_url
```

## Future Enhancements
The reportTms store is structured to support additional TMS reports:
- Stock Age Report
- Stock On Hand Report
- Shipment Cost Report
- Plan Reports
- On-time Percentage Report
- Shared Vehicle Cost Report
- Backlog Unit Report
- Not Open Invoice Report
- Percent Fill to DC Report
