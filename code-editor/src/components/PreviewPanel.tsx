'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Button, CircularProgress } from '@mui/material';
import { Refresh, OpenInNew, ErrorOutline } from '@mui/icons-material';
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
})({
  color: '#cccccc',
  padding: '4px',
  '&:hover': {
    background: '#3e3e42',
    color: '#ffffff',
  },
});

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
}

const PreviewPanel = ({ files }: PreviewPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateHtmlContent = () => {
    const htmlContent = files['index.html'] || '';
    const cssContent = files['styles.css'] || '';
    const jsContent = files['script.js'] || '';

    // If HTML already includes CSS/JS references, use as-is
    if (htmlContent.includes('<script') || htmlContent.includes('<link')) {
      return htmlContent;
    }

    // Otherwise, inline the CSS and JS
    const processedHtml = htmlContent
      .replace('</head>', `    <style>\n${cssContent}\n    </style>\n</head>`)
      .replace('</body>', `    <script>\n${jsContent}\n    </script>\n</body>`);

    return processedHtml;
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
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsLoading(false);
      }, 100);

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
  }, [files, refreshKey]);

  return (
    <PreviewContainer>
      <PreviewHeader>
        <HeaderTitle>PREVIEW</HeaderTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <RunButton
            onClick={handleRefresh}
            startIcon={<Refresh sx={{ fontSize: 12 }} />}
            size="small"
          >
            Refresh
          </RunButton>
          <ActionButton onClick={handleOpenInNewTab} size="small">
            <OpenInNew sx={{ fontSize: 14 }} />
          </ActionButton>
        </Box>
      </PreviewHeader>

      <PreviewContent>
        {isLoading && (
          <Box className="loading-indicator">
            <CircularProgress size={12} />
            <Typography variant="caption" color="#666">
              Loading...
            </Typography>
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