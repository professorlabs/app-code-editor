'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
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
  Tooltip,
  styled,
  InputAdornment,
} from '@mui/material';
import { 
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Plus,
  Trash2,
  Edit3,
  Download,
  Copy,
  Search,
  RefreshCw,
  Archive,
  FileText,
  Code,
  Image as ImageIcon,
  FileMinus,
  BookOpen,
  Braces
} from 'lucide-react';

// VSCode-style styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '100%',
  background: '#252526',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #3e3e42',
  color: '#cccccc',
  fontSize: '13px',
  fontFamily: '"Segoe UI", system-ui, sans-serif',
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '35px',
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  color: '#cccccc',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2px',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#cccccc',
  borderRadius: '4px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  padding: '8px 16px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '13px',
    color: '#cccccc',
    background: '#3c3c3c',
    borderRadius: '4px',
    padding: '4px 8px',
    '&:hover': {
      background: '#404040',
    },
    '&.Mui-focused': {
      background: '#404040',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#8c8c8c',
  },
}));

const ExplorerContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#1e1e1e',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#424242',
    borderRadius: '4px',
    '&:hover': {
      background: '#4e4e4e',
    },
  },
}));

const FileItem = styled(ListItemButton)<{ 
  active?: boolean;
}>(({ theme, active = false }) => ({
  padding: '4px 8px',
  minHeight: '22px',
  background: active ? '#094771' : 'transparent',
  color: active ? '#ffffff' : '#cccccc',
  borderRadius: '3px',
  margin: '1px 8px',
  transition: 'all 0.15s ease',
  fontSize: '13px',
  '&:hover': {
    background: active ? '#0e639c' : '#2a2d2e',
  },
  '& .MuiListItemIcon-root': {
    minWidth: '20px',
    marginRight: '6px',
    color: active ? '#ffffff' : '#cccccc',
  },
  '& .MuiListItemText-root': {
    margin: 0,
    '& .MuiTypography-root': {
      fontSize: '13px',
      fontWeight: active ? 500 : 400,
    },
  },
}));

const ContextMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '13px',
  padding: '6px 12px',
  background: '#2d2d30',
  color: '#cccccc',
  '&:hover': {
    background: '#094771',
  },
  '& .MuiSvgIcon-root': {
    marginRight: '8px',
    fontSize: '16px',
  },
}));

// File type icons
const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'tex':
    case 'latex':
      return <FileText size={16} style={{ color: '#dcb67a' }} />;
    case 'bib':
      return <BookOpen size={16} style={{ color: '#6a9955' }} />;
    case 'cls':
    case 'sty':
      return <Braces size={16} style={{ color: '#569cd6' }} />;
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <Code size={16} style={{ color: '#f0c674' }} />;
    case 'html':
      return <FileText size={16} style={{ color: '#e06c75' }} />;
    case 'css':
    case 'scss':
      return <FileText size={16} style={{ color: '#61afef' }} />;
    case 'json':
      return <FileText size={16} style={{ color: '#d19a66' }} />;
    case 'md':
    case 'txt':
      return <FileText size={16} style={{ color: '#5c6370' }} />;
    case 'pdf':
      return <FileMinus size={16} style={{ color: '#e06c75' }} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <ImageIcon size={16} style={{ color: '#569cd6' }} />;
    case 'zip':
    case 'tar':
    case 'gz':
      return <Archive size={16} style={{ color: '#f0c674' }} />;
    default:
      return <File size={16} style={{ color: '#8c8c8c' }} />;
  }
};

interface VSCodeSidebarProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (filename: string) => void;
  onFileCreate?: (filename: string) => void;
  onFileDelete?: (filename: string) => void;
  onFileRename?: (oldName: string, newName: string) => void;
  onFileDownload?: (filename: string, content: string) => void;
}

const VSCodeSidebar = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileDownload,
}: VSCodeSidebarProps) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    filename: string;
  } | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [renameFileName, setRenameFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContextMenu = (event: React.MouseEvent, filename: string) => {
    event.preventDefault();
    event.stopPropagation();
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

  const handleDownloadFile = () => {
    if (selectedFile && onFileDownload) {
      onFileDownload(selectedFile, '');
      setSelectedFile('');
    }
    handleContextMenuClose();
  };

  const openRenameDialog = () => {
    setRenameFileName(selectedFile);
    setRenameDialogOpen(true);
    handleContextMenuClose();
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'INPUT') return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            openCreateDialog();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <HeaderTitle>Explorer</HeaderTitle>
        <ActionButtons>
          <Tooltip title="New File (Ctrl+N)">
            <ActionButton size="small" onClick={openCreateDialog}>
              <Plus size={16} />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <ActionButton size="small">
              <RefreshCw size={16} />
            </ActionButton>
          </Tooltip>
        </ActionButtons>
      </SidebarHeader>

      <SearchBox>
        <SearchInput
          size="small"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={16} style={{ marginRight: '8px', color: '#8c8c8c' }} />,
          }}
        />
      </SearchBox>

      <ExplorerContent>
        {filteredFiles.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#8c8c8c' }}>
            <Typography sx={{ fontSize: '13px', mb: 2 }}>
              {searchTerm ? 'No files found' : 'No files in workspace'}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={openCreateDialog}
              sx={{
                color: '#cccccc',
                borderColor: '#3e3e42',
                '&:hover': {
                  borderColor: '#007acc',
                  background: '#094771',
                },
              }}
            >
              Create File
            </Button>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredFiles.map((filename) => (
              <FileItem
                key={filename}
                active={activeFile === filename}
                onClick={() => onFileSelect(filename)}
                onContextMenu={(e) => handleContextMenu(e, filename)}
              >
                <ListItemIcon>
                  {getFileIcon(filename)}
                </ListItemIcon>
                <ListItemText primary={filename} />
              </FileItem>
            ))}
          </List>
        )}
      </ExplorerContent>

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
          sx: {
            background: '#2d2d30',
            border: '1px solid #3e3e42',
            borderRadius: '4px',
          },
        }}
      >
        <ContextMenuItem onClick={openRenameDialog}>
          <Edit3 size={16} />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDownloadFile}>
          <Download size={16} />
          Download
        </ContextMenuItem>
        <ContextMenuItem onClick={() => {
          navigator.clipboard.writeText(selectedFile);
          handleContextMenuClose();
        }}>
          <Copy size={16} />
          Copy Path
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDeleteFile}>
          <Trash2 size={16} />
          Delete
        </ContextMenuItem>
      </Menu>

      {/* Create File Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#2d2d30',
            border: '1px solid #3e3e42',
            borderRadius: '8px',
            color: '#cccccc',
          },
        }}
      >
        <DialogTitle sx={{ color: '#cccccc' }}>Create New File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Filename"
            fullWidth
            variant="outlined"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fieldset: { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc' },
              },
              '& .MuiInputLabel-root': { color: '#8c8c8c' },
              '& .MuiInputBase-input': { color: '#cccccc' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#cccccc' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateFile} sx={{ color: '#007acc' }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename File Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#2d2d30',
            border: '1px solid #3e3e42',
            borderRadius: '8px',
            color: '#cccccc',
          },
        }}
      >
        <DialogTitle sx={{ color: '#cccccc' }}>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Filename"
            fullWidth
            variant="outlined"
            value={renameFileName}
            onChange={(e) => setRenameFileName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fieldset: { borderColor: '#3e3e42' },
                '&:hover fieldset': { borderColor: '#007acc' },
                '&.Mui-focused fieldset': { borderColor: '#007acc' },
              },
              '& .MuiInputLabel-root': { color: '#8c8c8c' },
              '& .MuiInputBase-input': { color: '#cccccc' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} sx={{ color: '#cccccc' }}>
            Cancel
          </Button>
          <Button onClick={handleRenameFile} sx={{ color: '#007acc' }}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarContainer>
  );
};

export default VSCodeSidebar;