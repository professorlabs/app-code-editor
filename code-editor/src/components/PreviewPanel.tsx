'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Refresh, OpenInNew, ErrorOutline, Html } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const PreviewContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#ffffff',
});

const PreviewHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '32px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
});

const PreviewContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  background: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
});

const PreviewFrame = styled('iframe', {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  width: '100%',
  height: '100%',
  border: 'none',
  background: '#ffffff',
});

const ErrorContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#666666',
  padding: '2rem',
  textAlign: 'center',
});

const HeaderTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '12px',
  color: '#cccccc',
  fontWeight: 500,
});

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})(({ theme }) => ({
  color: '#cccccc',
  padding: '4px',
  '&:hover': {
    background: '#3e3e42',
    color: '#ffffff',
  },
  [theme.breakpoints.down('md')]: {
    padding: '6px',
    backgroundColor: '#4caf50',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#45a049',
    },
  },
}));

const RunButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  background: '#007acc',
  color: 'white',
  textTransform: 'none',
  fontSize: '11px',
  fontWeight: 500,
  padding: '4px 8px',
  minWidth: 'auto',
  '&:hover': {
    background: '#005a9e',
  },
});

interface PreviewPanelProps {
  files: Record<string, string>;
  activeFile?: string | null;
}

const PreviewPanel = ({ files, activeFile }: PreviewPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentHtmlFile, setCurrentHtmlFile] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const generateHtmlContent = () => {
    let selectedHtmlFile: string | null = null;
    let content = '';

    // Priority 1: If activeFile is an HTML file, use it
    if (activeFile && activeFile.endsWith('.html') && files[activeFile]) {
      selectedHtmlFile = activeFile;
      content = files[activeFile];
    }
    
    // Priority 2: Look for HTML files in the files object
    if (!selectedHtmlFile) {
      const htmlFiles = Object.keys(files).filter(key => key.endsWith('.html'));
      
      if (htmlFiles.length > 0) {
        // If multiple HTML files, prefer the one with a similar name to activeFile (if activeFile is a .tex file)
        if (activeFile && activeFile.endsWith('.tex')) {
          const baseName = activeFile.replace('.tex', '');
          const matchingHtml = htmlFiles.find(html => html.replace('.html', '') === baseName);
          if (matchingHtml && files[matchingHtml]) {
            selectedHtmlFile = matchingHtml;
            content = files[matchingHtml];
          }
        }
        
        // If no matching file found, use the first HTML file
        if (!selectedHtmlFile && htmlFiles.length > 0) {
          selectedHtmlFile = htmlFiles[0];
          content = files[htmlFiles[0]];
        }
      }
    }
    
    // Priority 3: If no HTML files, look for CSS and JS files for combined preview
    if (!selectedHtmlFile) {
      const cssContent = files['styles.css'] || '';
      const jsContent = files['script.js'] || '';
      
      // If we have any content to preview, create basic HTML
      if (cssContent || jsContent) {
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Preview</title>
    ${cssContent ? `<style>\n${cssContent}\n</style>` : ''}
</head>
<body>
    <p>Preview Content</p>
    ${jsContent ? `<script>\n${jsContent}\n</script>` : ''}
</body>
</html>`;
      }
    }

    // Return empty HTML if no content found
    if (!content) {
      content = '<!DOCTYPE html><html><head><title>Preview</title></head><body><p>No content to preview</p></body></html>';
    }

    // Update the current HTML file being previewed
    setCurrentHtmlFile(selectedHtmlFile);
    return content;
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const htmlContent = generateHtmlContent();
      const iframe = iframeRef.current;
      
      // Create a blob URL from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Set the iframe src to the blob URL
      iframe.src = url;
      
      // Add load event listener to detect when the iframe has loaded
      const handleLoad = () => {
        setIsLoading(false);
        iframe.removeEventListener('load', handleLoad);
        // Clean up the blob URL after the content is loaded
        URL.revokeObjectURL(url);
      };
      
      // Add error event listener
      const handleError = () => {
        setError('Failed to load preview content');
        setIsLoading(false);
        iframe.removeEventListener('error', handleError);
        URL.revokeObjectURL(url);
      };
      
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      // Fallback timeout in case events don't fire
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          URL.revokeObjectURL(url);
        }
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render preview');
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    updatePreview();
  };

  const handleOpenInNewTab = () => {
    try {
      const htmlContent = generateHtmlContent();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up the URL after opening
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Failed to open in new tab:', err);
    }
  };

  useEffect(() => {
    updatePreview();
  }, [files, activeFile, refreshKey]);

  return (
    <PreviewContainer>
      <PreviewHeader>
        {!isMobile && (
          <>
            <HeaderTitle>
              PREVIEW {currentHtmlFile ? `- ${currentHtmlFile}` : ''}
            </HeaderTitle>
            <Box display="flex" alignItems="center" gap={1}>
              {currentHtmlFile && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Html sx={{ fontSize: 14, color: '#4caf50' }} />
                  <Typography variant="caption" sx={{ color: '#cccccc', fontSize: '10px' }}>
                    HTML
                  </Typography>
                </Box>
              )}
              <RunButton
                onClick={handleRefresh}
                startIcon={<Refresh sx={{ fontSize: 12 }} />}
                size="small"
              >
                Refresh
              </RunButton>
            </Box>
          </>
        )}
        
        {isMobile && (
          <Box sx={{ flex: 1 }} />
        )}
        
        <ActionButton onClick={handleOpenInNewTab} size="small">
          <OpenInNew sx={{ fontSize: 14 }} />
        </ActionButton>
      </PreviewHeader>

      <PreviewContent>
        {isLoading && (
          <Box 
            className="loading-indicator" 
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.9)"
            zIndex={1}
          >
            <CircularProgress size={20} />
            <Typography variant="caption" color="#666" sx={{ mt: 1 }}>
              Loading preview...
            </Typography>
            {currentHtmlFile && (
              <Typography variant="caption" color="#999" sx={{ mt: 0.5 }}>
                {currentHtmlFile}
              </Typography>
            )}
          </Box>
        )}

        {error ? (
          <ErrorContainer>
            <ErrorOutline className="error-icon" />
            <Typography variant="h6" className="error-title">
              Preview Error
            </Typography>
            <Typography variant="body2" className="error-message">
              {error}
            </Typography>
            <Button
              onClick={handleRefresh}
              variant="outlined"
              size="small"
              className="error-retry-btn"
            >
              Try Again
            </Button>
          </ErrorContainer>
        ) : (
          <PreviewFrame
            ref={iframeRef}
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
            key={refreshKey}
          />
        )}
      </PreviewContent>
    </PreviewContainer>
  );
};

export default PreviewPanel;