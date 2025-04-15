# @stexcore/live-server

![NPM Version](https://img.shields.io/npm/v/@stexcore/live-server?style=flat-square) ![License](https://img.shields.io/github/license/stexcore/live-server.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.8.2-blue?style=flat-square)

**Live Server** is a CLI tool designed to streamline local development by enabling real-time updates and quick testing of static files with minimal setup.

## 🚀 Features

- **Real-Time Updates**: Automatically refreshes the browser whenever files change to ensure you’re always viewing the latest version.
- **Quick Server Initialization**: Start serving your files instantly from the command line.
- **Multi-Directory Support**: Serve static files from multiple directories seamlessly.
- **Automatic File Detection**: Handles common scenarios like missing `index.html` files gracefully.
- **Dynamic Browser Interaction**: Injects functionality into served files for enhanced debugging and development convenience.

## 🛠️ Installation

To use **Live Server**, install it globally via npm:

```bash
npm install -g @stexcore/live-server
```

## 📝 Usage

Start a development server from the command line:

```bash
live-server <path-to-files>
```

### Examples

1. **Serve a specific HTML file**:
   ```bash
   live-server ./public/index.html
   ```

2. **Serve a directory (defaults to `index.html` if present)**:
   ```bash
   live-server ./public
   ```

3. **Serve the current directory**:
   ```bash
   live-server .
   ```
   Or simply:
   ```bash
   live-server
   ```

4. **Customize the port (default: 3000)**:
   ```bash
   live-server ./public --port 8080
   ```

5. **View available commands and options**:
   ```bash
   live-server --help
   ```

### Real-Time Functionality

**Live Server** makes development seamless by providing:
- **Automatic Refresh**: Detects changes in your project and instantly refreshes the browser.
- **Robust Connectivity**: Keeps the client connected to the server, ensuring uninterrupted updates.

### Directory Structure

The CLI expects a directory or file path to serve. Example:

```plaintext
project-root/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── images/
│   │   ├── logo.png
│   │   └── banner.jpg
```

## 🤝 Contributing

We welcome contributions to improve **Live Server**! If you find bugs, want to propose new features, or enhance the CLI experience, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## ✨ Author

Developed with ❤️ by **[Stexcore](https://github.com/stexcore)**.