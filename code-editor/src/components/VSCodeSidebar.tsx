'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FolderOpen,
  Code,
  Search,
  Source,
  Extension,
  Settings,
  Add,
  CreateNewFolder,
  UploadFile,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import FileExplorer from './FileExplorer';
import LaTeXLibrary from './LaTeXLibrary';

interface SidebarContainerProps {
  open: boolean;
}

const SidebarContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})<SidebarContainerProps>(({ open }) => ({
  width: open ? 280 : 48,
  height: '100%',
  background: '#252526',
  borderRight: '1px solid #3e3e42',
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.2s ease',
  overflow: 'hidden',
}));

const SidebarHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '35px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
});

const ActivityBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  width: '48px',
  height: '100%',
  background: '#333333',
  borderRight: '1px solid #3e3e42',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px 0',
});

interface ActivityBarItemProps {
  active?: boolean;
}

const ActivityBarItem = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})<ActivityBarItemProps>(({ active = false }) => ({
  width: '40px',
  height: '40px',
  margin: '2px 0',
  color: active ? '#ffffff' : '#cccccc',
  background: active ? '#094771' : 'transparent',
  '&:hover': {
    background: active ? '#094771' : 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
  },
}));

const TabContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: '#252526',
  overflow: 'hidden',
});

const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  minHeight: '35px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    minHeight: '35px',
    padding: '6px 12px',
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#cccccc',
    fontWeight: 500,
    letterSpacing: '0.5px',
    '&:hover': {
      color: '#ffffff',
      background: 'rgba(255, 255, 255, 0.05)',
    },
    '&.Mui-selected': {
      color: '#ffffff',
      background: '#1e1e1e',
    },
  },
});

const PanelHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '35px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 12px',
  '& .MuiTypography-root': {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#cccccc',
    letterSpacing: '0.5px',
  },
});

const ActionButtons = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  gap: '4px',
});

const ActionBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '4px',
  color: '#cccccc',
  '&:hover': {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.1)',
  },
});

const ContentArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  overflow: 'hidden',
  background: '#1e1e1e',
});

interface DropZoneProps {
  isDragOver?: boolean;
}

const DropZone = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})<DropZoneProps>(({ isDragOver = false }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: isDragOver ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
  border: isDragOver ? '2px dashed #6366f1' : 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  pointerEvents: isDragOver ? 'auto' : 'none',
  '& .MuiTypography-root': {
    color: '#6366f1',
    fontSize: '16px',
    fontWeight: 600,
  },
}));

interface VSCodeSidebarProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (filename: string) => void;
  onFileCreate: (filename: string) => void;
  onFileDelete: (filename: string) => void;
  onFileRename: (oldName: string, newName: string) => void;
  onFolderCreate: () => void;
  onFileUpload: (files: File[]) => void;
  open: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const VSCodeSidebar = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFolderCreate,
  onFileUpload,
  open,
  onToggle,
  isMobile = false,
}: VSCodeSidebarProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0 && onFileUpload) {
      onFileUpload(droppedFiles);
    }
  }, [onFileUpload]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const sidebarContent = (
    <SidebarContainer open={open && !isMobile}>
      {open && !isMobile ? (
        <>
          <SidebarHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#cccccc' }}>
                EXPLORER
              </Box>
            </Box>
          </SidebarHeader>
          
          <TabContainer>
            <StyledTabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Files" />
              <Tab label="Library" />
              <Tab label="Outline" />
            </StyledTabs>
            
            {activeTab === 0 && (
              <>
                <PanelHeader>
                  <Box>FILES</Box>
                  <ActionButtons>
                    <Tooltip title="New File">
                      <ActionBtn size="small" onClick={() => onFileCreate('untitled.tex')}>
                        <Add fontSize="small" />
                      </ActionBtn>
                    </Tooltip>
                    <Tooltip title="New Folder">
                      <ActionBtn size="small" onClick={onFolderCreate}>
                        <CreateNewFolder fontSize="small" />
                      </ActionBtn>
                    </Tooltip>
                    <Tooltip title="Upload Files">
                      <ActionBtn size="small">
                        <input
                          type="file"
                          multiple
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0 && onFileUpload) {
                              onFileUpload(files);
                            }
                          }}
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <UploadFile fontSize="small" />
                        </label>
                      </ActionBtn>
                    </Tooltip>
                  </ActionButtons>
                </PanelHeader>
                <ContentArea>
                  <DropZone
                    isDragOver={isDragOver}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {isDragOver && (
                      <Box>
                        <UploadFile sx={{ fontSize: 48, mb: 2 }} />
                        <Typography>Drop files here</Typography>
                      </Box>
                    )}
                  </DropZone>
                  <FileExplorer
                    files={files}
                    activeFile={activeFile}
                    onFileSelect={onFileSelect}
                    onFileCreate={onFileCreate}
                    onFileDelete={onFileDelete}
                    onFileRename={onFileRename}
                  />
                </ContentArea>
              </>
            )}
            
            {activeTab === 1 && (
              <ContentArea>
                <LaTeXLibrary />
              </ContentArea>
            )}
            
            {activeTab === 2 && (
              <ContentArea>
                <Box sx={{ p: 2, color: '#cccccc' }}>
                  <Typography variant="body2">
                    Document outline will appear here...
                  </Typography>
                </Box>
              </ContentArea>
            )}
          </TabContainer>
        </>
      ) : (
        <ActivityBar>
          <Tooltip title="Explorer" placement="right">
            <ActivityBarItem active={activeTab === 0}>
              <FolderOpen />
            </ActivityBarItem>
          </Tooltip>
          <Tooltip title="Search" placement="right">
            <ActivityBarItem>
              <Search />
            </ActivityBarItem>
          </Tooltip>
          <Tooltip title="Source Control" placement="right">
            <ActivityBarItem>
              <Source />
            </ActivityBarItem>
          </Tooltip>
          <Tooltip title="Extensions" placement="right">
            <ActivityBarItem>
              <Extension />
            </ActivityBarItem>
          </Tooltip>
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Settings" placement="right">
            <ActivityBarItem>
              <Settings />
            </ActivityBarItem>
          </Tooltip>
        </ActivityBar>
      )}
    </SidebarContainer>
  );

  return sidebarContent;
};

export default VSCodeSidebar;