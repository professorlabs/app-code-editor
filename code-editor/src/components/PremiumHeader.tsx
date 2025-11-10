'use client';

import { 
  Play, 
  Settings, 
  CloudUpload, 
  Download,
  GitBranch,
  Globe,
  Zap,
  Shield,
  Eye,
  Layers,
  Menu,
  X,
  ChevronDown,
  Save,
  FolderOpen,
  Bell,
  User,
  Sidebar,
  Share2
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu as MuiMenu,
  MenuItem,
  Chip,
  Avatar,
  alpha,
  styled,
  Badge,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  backdropFilter: 'blur(20px) saturate(180%)',
  border: 'none',
  boxShadow: '0 4px 32px rgba(0, 0, 0, 0.3)',
  borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
  height: '72px',
  zIndex: 1300,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '72px !important',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '32px',
  [theme.breakpoints.down('md')]: {
    padding: '0 16px',
    gap: '16px',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexShrink: 0,
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
    animation: 'shimmer 3s ease-in-out infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  '& img': {
    width: '28px',
    height: '28px',
    filter: 'brightness(0) invert(1)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '22px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.02em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
}));

const CenterActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flex: 1,
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    gap: '12px',
  },
}));

const RunButton = styled(Button)(({ theme }) => ({
  background: '#22c55e',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: '600',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: '#16a34a',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 20px',
    fontSize: '14px',
  },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: alpha('#ffffff', 0.1),
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  backdropFilter: 'blur(20px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: alpha('#ffffff', 0.15),
    transform: 'translateY(-1px)',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 'auto',
    padding: '8px 16px',
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: alpha('#ffffff', 0.08),
  color: '#e2e8f0',
  width: '44px',
  height: '44px',
  borderRadius: '11px',
  backdropFilter: 'blur(20px)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: alpha('#ffffff', 0.12),
    transform: 'translateY(-2px)',
    color: '#ffffff',
  },
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
  },
}));


const RightActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
}));

const PremiumBadge = styled(Chip)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#000000',
  fontSize: '11px',
  fontWeight: 700,
  height: '22px',
  borderRadius: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 12px rgba(251, 191, 36, 0.4)',
  marginLeft: '8px',
}));

const MobileMenuDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    width: '300px',
    border: 'none',
    boxShadow: '0 0 32px rgba(0, 0, 0, 0.3)',
  },
}));

interface PremiumHeaderProps {
  onCompile?: () => void;
  isCompiling?: boolean;
  onMenuToggle?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
}

const PremiumHeader = ({ onCompile, isCompiling = false, onMenuToggle, onSidebarToggle, sidebarOpen = true }: PremiumHeaderProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(null);
  const [deployMenuAnchor, setDeployMenuAnchor] = useState<null | HTMLElement>(null);

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  const handleDeployMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDeployMenuAnchor(event.currentTarget);
  };

  const handleDeployMenuClose = () => {
    setDeployMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle?.();
  };

  const MobileMenuContent = () => (
    <Box sx={{ p: 2, height: '100%', color: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Logo>
          <LogoIcon>
            <Image src="/logo.svg" alt="Logo" width={28} height={28} />
          </LogoIcon>
          <LogoText variant="h6">LaTeX Studio</LogoText>
        </Logo>
        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#ffffff' }}>
          <X size={24} />
        </IconButton>
      </Box>
      
      <List>
        <ListItem sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon><Save color="#e2e8f0" /></ListItemIcon>
          <ListItemText primary="Save" />
        </ListItem>
        <ListItem sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon><FolderOpen color="#e2e8f0" /></ListItemIcon>
          <ListItemText primary="Open" />
        </ListItem>
        <Divider sx={{ my: 2, borderColor: alpha('#ffffff', 0.1) }} />
        <ListItem sx={{ borderRadius: 2, mb: 1 }} onClick={onCompile}>
          <ListItemIcon><Play color="#22c55e" /></ListItemIcon>
          <ListItemText primary={isCompiling ? "Compiling..." : "Run"} />
        </ListItem>
        <ListItem sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon><Share2 color="#e2e8f0" /></ListItemIcon>
          <ListItemText primary="Share" />
        </ListItem>
        <ListItem sx={{ borderRadius: 2, mb: 1 }}>
          <ListItemIcon><CloudUpload color="#e2e8f0" /></ListItemIcon>
          <ListItemText primary="Deploy" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <LogoContainer>
            {!isMobile && (
              <Tooltip title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}>
                <IconButton
                  onClick={onSidebarToggle}
                  sx={{ 
                    color: '#ffffff', 
                    mr: 2,
                    background: alpha('#ffffff', 0.08),
                    '&:hover': { background: alpha('#ffffff', 0.12) }
                  }}
                >
                  <Sidebar size={20} />
                </IconButton>
              </Tooltip>
            )}
            {isMobile && (
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{ 
                  color: '#ffffff', 
                  mr: 1,
                  background: alpha('#ffffff', 0.08),
                  '&:hover': { background: alpha('#ffffff', 0.12) }
                }}
              >
                <Menu size={24} />
              </IconButton>
            )}
            <Logo>
              <LogoIcon>
                <Image src="/logo.svg" alt="Logo" width={28} height={28} />
              </LogoIcon>
              <LogoText variant="h6">LaTeX Studio</LogoText>
              <PremiumBadge label="PRO" size="small" />
            </Logo>
          </LogoContainer>

          <CenterActions>
            {!isMobile && (
              <>
                <PremiumButton
                  startIcon={<Save size={18} />}
                  onClick={handleFileMenuOpen}
                  endIcon={<ChevronDown size={16} />}
                >
                  File
                </PremiumButton>
                <MuiMenu
                  anchorEl={fileMenuAnchor}
                  open={Boolean(fileMenuAnchor)}
                  onClose={handleFileMenuClose}
                  PaperProps={{
                    sx: {
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      border: `1px solid ${alpha('#ffffff', 0.1)}`,
                      borderRadius: 2,
                      mt: 1,
                      minWidth: '180px',
                    }
                  }}
                >
                  <MenuItem onClick={handleFileMenuClose} sx={{ color: '#ffffff' }}>
                    <Save size={18} style={{ marginRight: 12 }} />
                    Save File
                  </MenuItem>
                  <MenuItem onClick={handleFileMenuClose} sx={{ color: '#ffffff' }}>
                    <FolderOpen size={18} style={{ marginRight: 12 }} />
                    Open File
                  </MenuItem>
                </MuiMenu>

                <RunButton
                  onClick={onCompile}
                  disabled={isCompiling}
                  startIcon={<Play size={20} />}
                >
                  {isCompiling ? 'Compiling...' : 'Run'}
                </RunButton>

                <PremiumButton
                  startIcon={<CloudUpload size={18} />}
                  onClick={handleDeployMenuOpen}
                  endIcon={<ChevronDown size={16} />}
                >
                  Deploy
                </PremiumButton>
                <MuiMenu
                  anchorEl={deployMenuAnchor}
                  open={Boolean(deployMenuAnchor)}
                  onClose={handleDeployMenuClose}
                  PaperProps={{
                    sx: {
                      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                      border: `1px solid ${alpha('#ffffff', 0.1)}`,
                      borderRadius: 2,
                      mt: 1,
                      minWidth: '200px',
                    }
                  }}
                >
                  <MenuItem onClick={handleDeployMenuClose} sx={{ color: '#ffffff' }}>
                    <Globe size={18} style={{ marginRight: 12 }} />
                    Custom Domain
                  </MenuItem>
                  <MenuItem onClick={handleDeployMenuClose} sx={{ color: '#ffffff' }}>
                    <Shield size={18} style={{ marginRight: 12 }} />
                    SSL Certificate
                  </MenuItem>
                </MuiMenu>
              </>
            )}
          </CenterActions>

          <RightActions>
            <Avatar
              sx={{ 
                width: 36, 
                height: 36, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                cursor: 'pointer',
                border: `2px solid ${alpha('#ffffff', 0.2)}`,
                '&:hover': { border: `2px solid ${alpha('#ffffff', 0.4)}` }
              }}
            >
              <User size={20} />
            </Avatar>
          </RightActions>
        </StyledToolbar>
      </StyledAppBar>

      <MobileMenuDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <MobileMenuContent />
      </MobileMenuDrawer>
    </>
  );
};

export default PremiumHeader;