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
  background: '#252526',
  color: '#cccccc',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ExplorerHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '12px 16px',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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
  padding: '6px 16px',
  minHeight: '32px',
  background: active ? '#094771' : 'transparent',
  '&:hover': {
    background: active ? '#094771' : '#2a2d2e',
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
  color: '#cccccc',
  '&.active': {
    color: '#ffffff',
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
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'js':
        return '⚡';
      case 'json':
        return '📋';
      case 'md':
        return '📝';
      default:
        return '📄';
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
        <ListItem className="file-list-item">
          <FileItem active={false}>
            <FileIcon>
              <FolderOpen className="folder-icon" />
            </FileIcon>
            <FileName>My Project</FileName>
          </FileItem>
        </ListItem>

        {files.map((filename) => (
          <ListItem key={filename} className="file-list-item">
            <FileItem
              active={activeFile === filename}
              onClick={() => onFileSelect(filename)}
              onContextMenu={(e) => handleContextMenu(e, filename)}
            >
              <FileIcon>
                <span className="file-type-icon">
                  {getFileIcon(filename)}
                </span>
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