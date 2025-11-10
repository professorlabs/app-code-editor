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
import PremiumHeader from '../PremiumHeader';
import SimpleSidebar from '../SimpleSidebar';
import VSCodeSidebar from '../VSCodeSidebar';

const EditorLayout = () => {
  const [activeFile, setActiveFile] = useState<string | null>('portfolio.tex');
  const [isRunning, setIsRunning] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [files, setFiles] = useState<Record<string, string>>({
    'portfolio.tex': `\\documentclass{portfolio}
\\usepackage[utf8]{inputenc}

\\title{Ibn al-Haytham (Alhazen)}
\\author{Father of Modern Optics and Scientific Methodology}
\\date{965 AD - 1040 AD}

\\begin{document}

% Navigation configuration
\\navlogo{ibn.png}
\\nabbar{Biography, Contributions, Legacy, Works}

% Include profile image
\\begin{figure}[h]
\\centering
\\includegraphics[width=0.8\\textwidth]{ibn.png}
\\caption{Ibn al-Haytham (Alhazen) - Father of Modern Optics}
\\end{figure}


\\section{Biography}

\\textbf{Ibn al-Haytham} (Latinized as \\textit{Alhazen}), born in \\textbf{965 AD} in Basra, Iraq, was a pioneering mathematician, astronomer, and physicist who made fundamental contributions to the principles of optics, astronomy, mathematics, and the scientific method.

\\subsection{Early Life and Education}

Abū ʿAlī al-Ḥasan ibn al-Ḥasan ibn al-Haytham was born during the Islamic Golden Age. He received his education in Basra, where he developed exceptional mathematical abilities and a keen interest in natural sciences. His reputation as a brilliant scholar led to his invitation to Cairo by the Fatimid Caliph al-Hakim.

\\subsection{Life in Cairo}

In Cairo, Ibn al-Haytham conducted his most important optical research. According to historical accounts, he feigned madness to avoid the Caliph's dangerous political schemes, allowing him to dedicate himself entirely to scientific pursuits while under house arrest.

\\section{Major Contributions}

\\subsection{Book of Optics (Kitāb al-Manāẓir)}

His magnum opus, \\textit{Kitāb al-Manāẓir} (Book of Optics), written between 1011 and 1021, revolutionized the understanding of vision and light:

\\begin{itemize}
    \\item Established that vision occurs when light travels from objects to the eye
    \\item Proved the intromission theory of vision against the extramission theory
    \\item Systematically studied reflection, refraction, and color phenomena
    \\item Investigated the psychology of visual perception
\\end{itemize}

\\subsection{Scientific Method}

Ibn al-Haytham pioneered the modern scientific method:
\\begin{itemize}
    \\item Emphasized systematic experimentation and controlled testing
    \\item Stressed the importance of mathematical description of natural phenomena
    \\item Combined theoretical reasoning with empirical verification
    \\item Advocated for reproducible experiments and peer review
\\end{itemize}

\\subsection{Mathematics and Astronomy}

\\begin{itemize}
    \\item Developed early analytic geometry concepts
    \\item Solved problems using what we now call algebraic methods
    \\item Made significant contributions to number theory
    \\item Studied celestial mechanics and planetary motion
    \\item Attempted to measure the height of Earth's atmosphere
\\end{itemize}

\\section{Legacy and Influence}

\\subsection{Impact on Western Science}

Ibn al-Haytham's works were translated into Latin in the 12th and 13th centuries and profoundly influenced:
\\begin{itemize}
    \\item Roger Bacon and other medieval European scholars
    \\item The development of perspective in Renaissance art
    \\item Kepler's laws of planetary motion
    \\item Newton's work on optics and the scientific method
\\end{itemize}

\\subsection{Modern Recognition}

Today, Ibn al-Haytham is recognized as:
\\begin{itemize}
    \\item The "Father of Modern Optics"
    \\item A pioneer of the scientific method
    \\item One of the greatest scientists of the medieval period
    \\item An important bridge between ancient and modern science
\\end{itemize}

\\subsection{The "Alhazen Problem"}

His famous mathematical problem about finding the point of reflection on a curved mirror from a given object to a given observer is known as "Alhazen's Problem" and continued to challenge mathematicians for centuries.

\\section{Principal Works}

\\begin{itemize}
    \\item \\textit{Kitāb al-Manāẓir} (Book of Optics) - 7 volumes
    \\item \\textit{Treatise on Light} - Foundational work on optics
    \\item \\textit{On the Shape of the Eclipse} - Astronomical calculations
    \\item \\textit{Analysis and Synthesis} - Mathematical methodology
    \\item \\textit{Treatise on Place} - Contributions to physics
    \\item Over 200 surviving works on various scientific topics
\\end{itemize}

\\section{Personal Philosophy}

Ibn al-Haytham believed that:
\\begin{quote}
    "The truth is the only thing that can unite men, while falsehood is the only thing that can divide them."
\\end{quote}

He emphasized the importance of skepticism, questioning authority, and seeking truth through rigorous investigation - principles that remain central to modern science.

\\section{Historical Context}

Ibn al-Haytham lived during the peak of the Islamic Golden Age, a period of extraordinary cultural, scientific, and intellectual advancement that spanned from the 8th to the 14th centuries. His work exemplifies the sophisticated scientific tradition that flourished in the Islamic world and laid crucial groundwork for the European Renaissance.

\\end{document}`,
    'ibn.png': '', // This is a reference to the image file
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
    if (!activeFile) return '';
    
    // Handle image files
    const extension = activeFile.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      return `[Image File: ${activeFile}]`;
    }
    
    return files[activeFile] || '';
  };

  const handleFileCreate = (filename: string) => {
    // Handle image files - don't create them as text files
    const extension = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      // Don't create image files through the text editor
      alert('Image files cannot be created through the text editor. Please upload image files instead.');
      return;
    }
    
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

  const handleFileDownload = (filename: string, content: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    // Handle image files
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
      // For image files, download from public directory
      const element = document.createElement('a');
      element.setAttribute('href', `/${filename}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return;
    }
    
    // Handle text files
    const fileContent = files[filename] || content;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    <Box className="editor-layout-container" sx={{ pt: '72px' }}>
      <PremiumHeader 
        onCompile={handleCompile} 
        isCompiling={isRunning} 
        onMenuToggle={() => setDrawerOpen(!drawerOpen)}
      />
      <Box className="editor-content" sx={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        {!isMobile && drawerOpen && (
          <VSCodeSidebar
            files={Object.keys(files)}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
            onFileDownload={handleFileDownload}
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