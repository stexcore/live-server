# @stexcore/live-server

**Live Server** is a CLI tool designed to quickly start a local development server from a specified HTML file path. With real-time updates and lightweight performance, it streamlines workflows for developers who need a fast and efficient way to test static files.

## 🚀 Features

- **Quick Server Setup**: Initialize a development server directly from the command line.
- **HTML Interception**: Dynamically inject custom scripts into HTML files for debugging or added functionality.
- **MIME Type Support**: Reliably determines file types using `mime-types` for accurate `Content-Type` headers.
- **Automatic Error Handling**: Handles missing files and other issues gracefully.
- **Minimal Configuration**: Simple and intuitive CLI commands for hassle-free usage.

## 🛠️ Installation

To use **Live Server**, install it globally via npm:

```bash
npm install -g @stexcore/live-server
```

## 📝 Usage

Start a development server from the command line:

```bash
live-server <path-to-html>
```

### Examples

1. Serve a specific HTML file:
   ```bash
   live-server ./public/index.html
   ```

2. Serve a directory (defaults to `index.html` if present):
   ```bash
   live-server ./public
   ```

3. Customize the port (default: 3000):
   ```bash
   live-server ./public --port 8080
   ```

### Directory Structure

The CLI tool expects a directory or HTML file path to serve. Example:

```plaintext
project-root/
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── custom-script.js
```

## 🌐 Dynamic HTML Handling

**Live Server** automatically injects a custom script into HTML files to enhance debugging or add functionality. If a `</body>` tag is missing, the server ensures the document structure is corrected and appends the script at the end.

Injected script:
```html
<script src="/custom-script.js"></script>
```

This feature simplifies development by avoiding manual modifications to HTML files.

## 🤝 Contributing

We welcome contributions to improve **Live Server**! If you find bugs, want to propose new features, or improve the CLI experience, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## ✨ Author

Developed with ❤️ by **[Stexcore](https://github.com/stexcore)**.