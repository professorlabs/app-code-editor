'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FolderOpen,
  Code,
  MenuOpen,
  Menu,
  Add,
  CreateNewFolder,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import FileExplorer from './FileExplorer';
import LaTeXLibrary from './LaTeXLibrary';

interface DrawerContainerProps {
  open: boolean;
}

const DrawerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})<DrawerContainerProps>(({ open }) => ({
  width: open ? 320 : 80,
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRight: '1px solid #e2e8f0',
  background: '#ffffff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const DrawerHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  borderBottom: '1px solid #e2e8f0',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
});

const NavigationList = styled(List, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '8px 0',
});

interface NavItemProps {
  active?: boolean;
}

const NavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})<NavItemProps>(({ active = false }) => ({
  margin: '4px 12px',
  borderRadius: '12px',
  minHeight: '48px',
  background: active ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
  border: active ? '1px solid #c7d2fe' : '1px solid transparent',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: active ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'rgba(99, 102, 241, 0.05)',
    transform: 'translateX(4px)',
  },
}));

const NavIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '40px',
  color: '#6366f1',
});

const NavText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  '& .MuiListItemText-primary': {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
  },
});

const ContentArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  overflow: 'hidden',
  background: '#ffffff',
});

const ActionButtons = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  gap: '8px',
  padding: '12px 16px',
  borderTop: '1px solid #e2e8f0',
  background: '#f8fafc',
});

const ActionBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  color: '#64748b',
  padding: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#6366f1',
    color: '#ffffff',
    borderColor: '#6366f1',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
});

interface MiniDrawerProps {
  files: string[];
  activeFile: string | null;
  onFileSelect: (filename: string) => void;
  onFileCreate: (filename: string) => void;
  onFileDelete: (filename: string) => void;
  onFileRename: (oldName: string, newName: string) => void;
  onFolderCreate: () => void;
  open: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const MiniDrawer = ({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFolderCreate,
  open,
  onToggle,
  isMobile = false,
}: MiniDrawerProps) => {
  const [activeTab, setActiveTab] = useState('explorer');
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const drawerContent = (
    <DrawerContainer open={open && isDesktop}>
      <DrawerHeader>
        {open && isDesktop && (
          <Typography variant="h6" fontWeight={600} color="#1e293b">
            Explorer
          </Typography>
        )}
        <IconButton 
          onClick={onToggle}
          sx={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            '&:hover': {
              background: '#6366f1',
              color: '#ffffff',
            },
          }}
        >
          {open && isDesktop ? <MenuOpen /> : <Menu />}
        </IconButton>
      </DrawerHeader>

      {open && isDesktop ? (
        <>
          <NavigationList>
            <NavItem 
              active={activeTab === 'explorer'}
              onClick={() => handleTabChange('explorer')}
            >
              <NavIcon>
                <FolderOpen />
              </NavIcon>
              <NavText primary="File Explorer" />
            </NavItem>
            <NavItem 
              active={activeTab === 'library'}
              onClick={() => handleTabChange('library')}
            >
              <NavIcon>
                <Code />
              </NavIcon>
              <NavText primary="LaTeX Library" />
            </NavItem>
          </NavigationList>

          <ContentArea>
            {activeTab === 'explorer' ? (
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onFileSelect={onFileSelect}
                onFileCreate={onFileCreate}
                onFileDelete={onFileDelete}
                onFileRename={onFileRename}
              />
            ) : (
              <LaTeXLibrary />
            )}
          </ContentArea>

          {activeTab === 'explorer' && (
            <ActionButtons>
              <ActionBtn title="New File" onClick={() => onFileCreate('untitled.tex')}>
                <Add />
              </ActionBtn>
              <ActionBtn title="New Folder" onClick={onFolderCreate}>
                <CreateNewFolder />
              </ActionBtn>
            </ActionButtons>
          )}
        </>
      ) : (
        <NavigationList>
          <NavItem 
            active={activeTab === 'explorer'}
            onClick={() => handleTabChange('explorer')}
          >
            <NavIcon>
              <FolderOpen />
            </NavIcon>
          </NavItem>
          <NavItem 
            active={activeTab === 'library'}
            onClick={() => handleTabChange('library')}
          >
            <NavIcon>
              <Code />
            </NavIcon>
          </NavItem>
        </NavigationList>
      )}
    </DrawerContainer>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onToggle}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 320,
            borderRight: '1px solid #e2e8f0',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return drawerContent;
};

export default MiniDrawer;