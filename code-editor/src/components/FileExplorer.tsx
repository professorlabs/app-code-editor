'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Folder,
  FolderOpen,
  InsertDriveFile,
  Add,
  Delete,
  Edit,
  MoreVert,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExplorerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '100%',
  background: '#ffffff',
  color: '#1e293b',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: 'slideInFromTop 0.5s ease-out',
});

const ExplorerHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '16px 20px',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#475569',
  '@media (max-width: 768px)': {
    padding: '12px 16px',
    fontSize: '11px',
  },
});

const FileList = styled(List, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  padding: '4px 0',
  overflowY: 'auto',
});

const FileItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'active',
})<{ active?: boolean }>(({ active = false }) => ({
  padding: '10px 16px',
  minHeight: '36px',
  background: active ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
  borderRadius: '8px',
  margin: '2px 12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: active ? '1px solid #c7d2fe' : '1px solid transparent',
  '&:hover': {
    background: active ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'rgba(99, 102, 241, 0.05)',
    transform: 'translateX(4px)',
    border: active ? '1px solid #a5b4fc' : '1px solid #e2e8f0',
  },
  '&:active': {
    transform: 'translateX(2px) scale(0.98)',
  },
  '@media (max-width: 768px)': {
    padding: '8px 12px',
    minHeight: '32px',
    margin: '1px 8px',
  },
}));

const FileIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  minWidth: '20px',
  marginRight: '8px',
});

const FileName = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '13px',
  color: '#475569',
  fontWeight: 500,
  '&.active': {
    color: '#1e293b',
    fontWeight: 600,
  },
});

interface FileExplorerProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (filename: string) => void;
  onFileCreate?: (filename: string) => void;
  onFileDelete?: (filename: string) => void;
  onFileRename?: (oldName: string, newName: string) => void;
}

const FileExplorer = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
}: FileExplorerProps) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    filename: string;
  } | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renameFileName, setRenameFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tex':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#6366f1' }} />;
      case 'latex':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#6366f1' }} />;
      case 'bib':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#f59e0b' }} />;
      case 'cls':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'sty':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#8b5cf6' }} />;
      case 'pdf':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#ef4444' }} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#06b6d4' }} />;
      case 'md':
        return <InsertDriveFile sx={{ fontSize: 16, color: '#64748b' }} />;
      default:
        return <InsertDriveFile sx={{ fontSize: 16, color: '#94a3b8' }} />;
    }
  };

  const handleContextMenu = (event: React.MouseEvent, filename: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      filename,
    });
    setSelectedFile(filename);
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleCreateFile = () => {
    if (newFileName.trim() && onFileCreate) {
      onFileCreate(newFileName.trim());
      setNewFileName('');
      setCreateDialogOpen(false);
    }
  };

  const handleRenameFile = () => {
    if (renameFileName.trim() && selectedFile && onFileRename) {
      onFileRename(selectedFile, renameFileName.trim());
      setRenameFileName('');
      setRenameDialogOpen(false);
      setSelectedFile('');
    }
  };

  const handleDeleteFile = () => {
    if (selectedFile && onFileDelete) {
      onFileDelete(selectedFile);
      setSelectedFile('');
    }
    handleContextMenuClose();
  };

  const openRenameDialog = () => {
    setRenameFileName(selectedFile);
    setRenameDialogOpen(true);
    handleContextMenuClose();
  };

  return (
    <ExplorerContainer>
      <ExplorerHeader>
        <span>EXPLORER</span>
        <IconButton
          size="small"
          onClick={() => setCreateDialogOpen(true)}
          className="explorer-add-btn"
        >
          <Add fontSize="small" />
        </IconButton>
      </ExplorerHeader>

      <FileList>
        {files.map((filename) => (
          <ListItem key={filename} className="file-list-item">
            <FileItem
              active={activeFile === filename}
              onClick={() => onFileSelect(filename)}
              onContextMenu={(e) => handleContextMenu(e, filename)}
            >
              <FileIcon>
                {getFileIcon(filename)}
              </FileIcon>
              <FileName className={activeFile === filename ? 'active' : ''}>
                {filename}
              </FileName>
            </FileItem>
          </ListItem>
        ))}
      </FileList>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          className: 'context-menu-paper',
        }}
      >
        <MenuItem onClick={openRenameDialog}>
          <Edit className="menu-icon" />
          Rename
        </MenuItem>
        <MenuItem onClick={handleDeleteFile}>
          <Delete className="menu-icon" />
          Delete
        </MenuItem>
      </Menu>

      {/* Create File Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          className: 'dialog-paper',
        }}
      >
        <DialogTitle className="dialog-title">
          Create New File
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Filename"
            fullWidth
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="dialog-textfield"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} className="dialog-btn-cancel">
            Cancel
          </Button>
          <Button onClick={handleCreateFile} className="dialog-btn-primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        PaperProps={{
          className: 'dialog-paper',
        }}
      >
        <DialogTitle className="dialog-title">
          Rename File
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Filename"
            fullWidth
            variant="outlined"
            value={renameFileName}
            onChange={(e) => setRenameFileName(e.target.value)}
            className="dialog-textfield"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} className="dialog-btn-cancel">
            Cancel
          </Button>
          <Button onClick={handleRenameFile} className="dialog-btn-primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </ExplorerContainer>
  );
};

export default FileExplorer;