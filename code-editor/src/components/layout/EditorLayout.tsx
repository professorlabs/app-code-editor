'use client';

import { useState, useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import FileExplorer from '../FileExplorer';
import CodeEditor from '../CodeEditor';
import PreviewPanel from '../PreviewPanel';
import Header from '../Header';
import SimpleSidebar from '../SimpleSidebar';

const EditorLayout = () => {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [files, setFiles] = useState<Record<string, string>>({
    'main.tex': `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\title{LaTeX Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Welcome to LaTeX Studio Pro! This is your first LaTeX document.

\\section{Mathematical Content}
Here's some inline math: $E = mc^2$

And here's a displayed equation:
\\begin{equation}
    \\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
\\end{equation}

\\section{Lists}
\\begin{itemize}
    \\item First item
    \\item Second item
    \\begin{itemize}
        \\item Nested item
    \\end{itemize}
\\end{itemize}

\\section{Conclusion}
This demonstrates the basic features of LaTeX.

\\end{document}`,
    'references.bib': `@article{einstein1905,
    author = {Einstein, Albert},
    title = {On the Electrodynamics of Moving Bodies},
    journal = {Annalen der Physik},
    volume = {17},
    number = {10},
    pages = {891--921},
    year = {1905}
}

@book{knuth1984,
    author = {Knuth, Donald E.},
    title = {The TeXbook},
    publisher = {Addison-Wesley},
    year = {1984}
}`,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

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

  const handleFolderCreate = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      console.log(`Creating folder: ${folderName.trim()}`);
      // In a real implementation, you would handle folder creation
    }
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files);
    // In a real implementation, you would handle file upload
  };

  const getDefaultContentForFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tex':
        return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{${filename.replace('.tex', '')}}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Your LaTeX content here...

\\end{document}`;
      case 'bib':
        return `@article{key2023,
    author = {Author Name},
    title = {Article Title},
    journal = {Journal Name},
    year = {2023}
}`;
      case 'cls':
        return `% ${filename}
% LaTeX class file
\\NeedsTeXFormat{LaTeX2e}
\\ProvidesClass{${filename.replace('.cls', '')}}

\\LoadClass{article}

% Custom class definitions here`;
      case 'sty':
        return `% ${filename}
% LaTeX style file
\\ProvidesPackage{${filename.replace('.sty', '')}}

% Custom style definitions here`;
      case 'md':
        return `# ${filename}

## Getting Started

This is a markdown file.`;
      default:
        return `% ${filename}
% New file created`;
    }
  };

  const handleCompile = async () => {
    if (!activeFile || !activeFile.endsWith('.tex')) {
      alert('Please select a .tex file to compile');
      return;
    }

    setIsRunning(true);
    
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: activeFile,
          content: files[activeFile],
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the files object with the compiled HTML
        setFiles(prev => ({
          ...prev,
          [activeFile.replace('.tex', '.html')]: result.html,
        }));
        
        // Switch to the HTML file for preview
        setActiveFile(activeFile.replace('.tex', '.html'));
      } else {
        alert(`Compilation failed: ${result.error}`);
        console.error('Compilation error:', result);
      }
    } catch (error) {
      console.error('Failed to compile:', error);
      alert('Failed to compile. Please check the console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box className="editor-layout-container">
      <Header 
        onCompile={handleCompile} 
        isCompiling={isRunning} 
        onMenuToggle={() => setDrawerOpen(!drawerOpen)}
        isDrawerOpen={drawerOpen}
      />
      <Box className="editor-content" sx={{ display: 'flex' }}>
        {!isMobile && drawerOpen && (
          <SimpleSidebar
            files={Object.keys(files)}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
            onFolderCreate={handleFolderCreate}
            onFileUpload={handleFileUpload}
          />
        )}
        
        <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
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
            
            <Panel defaultSize={50} minSize={30}>
              <PreviewPanel files={files} />
            </Panel>
          </PanelGroup>
        </Box>
      </Box>
    </Box>
  );
};

// Helper function to detect mobile devices
const isMobileDevice = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768;
  }
  return false;
};

export default EditorLayout;