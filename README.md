<div align="center">
  <h1>MODZ.DEV</h1>
  <p><strong>High-Performance Technical Asset Repository for the Minecraft Ecosystem</strong></p>
  <p><i>v2.0.4-stable // Production Ready</i></p>
</div>

<hr />

## Project Overview

**MODZ.DEV** is a specialized index and management system designed for the efficient cataloging and deployment of Minecraft modifications, plugins, and datapacks. The platform prioritizes performance, security, and precision, utilizing a bespoke frontend architecture that mimics high-end terminal environments while delivering a seamless user experience across desktop and mobile devices.

This repository contains the source code for the frontend interface and the lightweight backend API layer used for data persistence.

---

## Core Features

### System Architecture
-   **Precision Indexing**: Advanced filtering logic allowing rapid retrieval of resources based on nomenclature, authorship, or technical category.
-   **Dual-Language Support**: Complete internationalization (i18n) core, enabling instant state-preserving switching between English and Spanish locales.
-   **Responsive Interface**: A fluid, grid-based layout that adapts strictly to viewport constraints without compromising data density.

### User Interface
-   **Terminal Aesthetic**: A monochromatic, high-contrast design language emphasizing readability and functional brutalism.
-   **Micro-Interactions**: subtle, hardware-accelerated animations for user feedback and state transitions.
-   **Dark Mode Native**: Engineered from the ground up for low-light environments to reduce visual fatigue during extended sessions.

### Administration
-   **Secure Management Console**: A protected backend interface for the creating, editing, and deletion of repository entries.
-   **Data Persistence**: JSON-based flat-file database system for reliable, server-independent data storage.
-   **Input Sanitization**: rigorous server-side validation to prevent XSS and malformed data injection.

---

## Technical Specifications

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | JavaScript (ES6+) | Optimized vanilla JS for maximum execution speed. |
| **Build System** | Vite | Next-generation frontend tooling. |
| **Backend** | PHP 8.x | Lightweight API layer for filesystem operations. |
| **styling** | TailwindCSS | Utility-first CSS framework for rapid UI development. |
| **Data** | JSON | Portable, human-readable data storage. |

---

## Deployment Sequence

### Prerequisites
-   **Node.js**: v18.0.0 or higher.
-   **PHP**: v7.4 or higher (for local API emulation).
-   **Web Server**: Apache/Nginx (for production deployment).

### Local Environment Setup

1.  **Clone Repository**
    ```bash
    git clone https://github.com/rezzt-dev/modz-webpage.git
    cd modz-webpage
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Initialize Development Server**
    ```bash
    npm run dev
    ```

### Production Build

To generate the optimized static assets for deployment:

```bash
npm run build
```

The output will be located in the `/dist` directory. Ensure the `/api` directory has appropriate write permissions (chmod 775) on the target server.

---

## Security Protocols

This application implements several layers of security to ensure data integrity and system safety.

1.  **Server-Side Sanitization**: All incoming data streams are sanitized to strip potential executable code before storage.
2.  **Access Control**: Directory traversal protection and direct file access blocking via server configuration.
3.  **HTTP Security**: Implementation of standard security headers including Content-Security-Policy (CSP) and Strict-Transport-Security (HSTS).

*Note: Specific implementation details of the backend security architecture are omitted from this public documentation to maintain operational security excellence.*

---

## License

**© 2026 REZZT.DEV**

This software is proprietary. Unauthorized copying, modification, distribution, or use of this file, via any medium, is strictly prohibited without the express written permission of the copyright holder.
