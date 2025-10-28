'use client';

import { useState } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { Box } from '@mui/material';
import FileExplorer from '../FileExplorer';
import CodeEditor from '../CodeEditor';
import PreviewPanel from '../PreviewPanel';
import Header from '../Header';

const EditorLayout = () => {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>Welcome to the code editor!</p>
        <button onclick="showMessage()">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 500px;
    width: 90%;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

button {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}`,
    'script.js': `function showMessage() {
    alert('Hello from the editor! 🎉');
}

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application loaded successfully!');
});`,
  });

  const handleFileSelect = (filename: string) => {
    setActiveFile(filename);
  };

  const handleFileContentChange = (filename: string, content: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: content,
    }));
  };

  const getCurrentFileContent = () => {
    return activeFile ? files[activeFile] : '';
  };

  const handleFileCreate = (filename: string) => {
    setFiles(prev => ({
      ...prev,
      [filename]: getDefaultContentForFile(filename),
    }));
    setActiveFile(filename);
  };

  const handleFileDelete = (filename: string) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[filename];
      return newFiles;
    });
    if (activeFile === filename) {
      setActiveFile(null);
    }
  };

  const handleFileRename = (oldName: string, newName: string) => {
    if (files[newName]) {
      alert('A file with this name already exists!');
      return;
    }
    setFiles(prev => {
      const newFiles = { ...prev };
      newFiles[newName] = newFiles[oldName];
      delete newFiles[oldName];
      return newFiles;
    });
    if (activeFile === oldName) {
      setActiveFile(newName);
    }
  };

  const getDefaultContentForFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>Welcome to ${filename}!</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
      case 'css':
        return `/* ${filename} */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}`;
      case 'js':
        return `// ${filename}
console.log('Hello from ${filename}!');

document.addEventListener('DOMContentLoaded', function() {
    // Your code here
});`;
      case 'json':
        return `{
  "name": "project",
  "version": "1.0.0",
  "description": "A new project"
}`;
      case 'md':
        return `# ${filename}

## Getting Started

This is a markdown file.`;
      default:
        return `// ${filename}
// New file created`;
    }
  };

  const handleRun = () => {
    // Trigger a refresh of the preview
    setFiles(prev => ({ ...prev }));
  };

  return (
    <Box className="editor-layout-container">
      <Header onRun={handleRun} />
      <Box className="editor-content">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} maxSize={40}>
            <FileExplorer
              files={Object.keys(files)}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
            />
          </Panel>
          
          <PanelResizeHandle className="panel-resize-handle" />
          
          <Panel defaultSize={40} minSize={30}>
            <CodeEditor
              filename={activeFile}
              content={getCurrentFileContent()}
              onChange={(content) => {
                if (activeFile) {
                  handleFileContentChange(activeFile, content);
                }
              }}
            />
          </Panel>
          
          <PanelResizeHandle className="panel-resize-handle" />
          
          <Panel defaultSize={40} minSize={30}>
            <PreviewPanel files={files} />
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  );
};

export default EditorLayout;