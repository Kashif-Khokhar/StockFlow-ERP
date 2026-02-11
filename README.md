# StockFlow Pro | Modern Inventory & Supply Chain Management

StockFlow Pro is a premium, modern ERP dashboard designed for efficient warehouse and supply chain management. Built with React and Vite, it offers a high-performance, responsive experience with a professional "Glassmorphism" aesthetic.

[**🔗 View Live Demo**](https://stock-flow-erp-omega.vercel.app/)

## 🚀 Features

- **Multi-View Dashboard**: Dedicated pages for Dashboard, Inventory Repository, and System Settings.
- **Collapsible Sidebar**: Smart navigation with a floating toggle for maximum workspace efficiency.
- **Full Mobile Responsiveness**: Premium mobile experience with a dedicated navigation drawer and sticky glassmorphism header.
- **Inventory Management**: Comprehensive SKU tracking with **Edit** and **Delete** capabilities.
- **Real-time Analytics**: Dynamic stat cards and distribution charts showing warehouse health.
- **Advanced Search & Filter**: Global searching by SKU/Item and low-stock filtering.
- **System Localization**: Configurable organization name, admin profile, and currency settings.
- **Data Portability**: JSON export functionality for warehouse data backups.
- **Premium UI**: Professional "Glassmorphism" aesthetic with high-res branding, smooth transitions, and global width optimization.

## 🛠️ Technology Stack

- **Framework**: [React.js](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Premium CSS3 with CSS Variables & Glassmorphism
- **Storage**: Browser LocalStorage for persistent data sync

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kashif-Khokhar/Inventory-Supply-Chain-Management.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Inventory-Supply-Chain-Management
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
├── public/
│   ├── favicon.png      # High-resolution branding
│   └── manifest.json    # Web app configuration
├── src/
│   ├── views/           # Dedicated Page Views
│   │   ├── DashboardView.jsx
│   │   ├── InventoryView.jsx
│   │   └── SettingsView.jsx
│   ├── App.jsx          # Shell layout & global state
│   ├── App.css          # Design system & animations
│   ├── main.jsx         # React entry point
│   └── index.css        # Global resets
├── index.html           # Root HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies & scripts
```

## 👤 Author

**Kashif Khokhar**
- Logistics Lead & Full Stack Developer

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
