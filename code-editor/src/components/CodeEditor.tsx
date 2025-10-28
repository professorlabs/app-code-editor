'use client';

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const EditorContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#1e1e1e',
});

const EditorHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '32px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
});

const EditorContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  overflow: 'hidden',
});

const FileName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '12px',
  color: '#cccccc',
  fontWeight: 500,
});

interface CodeEditorProps {
  filename: string | null;
  content: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ filename, content, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  const getLanguageFromFilename = (filename: string | null): string => {
    if (!filename) return 'plaintext';
    
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'xml':
        return 'xml';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp';
      case 'c':
        return 'c';
      default:
        return 'plaintext';
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure editor theme and options
    monaco.editor.defineTheme('vs-dark-custom', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.lineHighlightBackground': '#2d2d30',
        'editorCursor.foreground': '#aeafad',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      },
    });

    monaco.editor.setTheme('vs-dark-custom');

    // Set up editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      lineHeight: 1.6,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save functionality (could be implemented)
      console.log('Save command triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Run functionality
      console.log('Run command triggered');
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <EditorContainer>
      <EditorHeader>
        <FileName>
          {filename || 'No file selected'}
        </FileName>
      </EditorHeader>
      <EditorContent>
        {filename ? (
          <Editor
            height="100%"
            language={getLanguageFromFilename(filename)}
            value={content}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            loading={
              <Box className="editor-loading">
                Loading editor...
              </Box>
            }
            options={{
              selectOnLineNumbers: true,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              renderWhitespace: 'selection',
              guides: {
                indentation: true,
                bracketPairs: true,
              },
              bracketPairColorization: {
                enabled: true,
              },
            }}
          />
        ) : (
          <Box className="editor-empty-state">
            <Typography variant="h6" className="empty-state-title">
              No file selected
            </Typography>
            <Typography variant="body2" className="empty-state-text">
              Select a file from the explorer to start editing
            </Typography>
          </Box>
        )}
      </EditorContent>
    </EditorContainer>
  );
};

export default CodeEditor;