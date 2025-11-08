'use client';

import { Box, Typography, IconButton, Button, Chip } from '@mui/material';
import { PlayArrow, Public, OpenInNew, CloudUpload, Menu } from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';


const shimmerAnimation = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '64px',
  background: '#1d4837',
  borderBottom: '1px solid #2d5f47',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  color: '#ffffff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  zIndex: 100,
  '@media (max-width: 768px)': {
    padding: '0 16px',
    height: '56px',
  },
  '@media (max-width: 480px)': {
    padding: '0 12px',
    height: '52px',
  },
});

const LogoContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const SparklesIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  width: '24px',
  height: '24px',
  color: '#8b5cf6',
  animation: 'sparkle 2s ease-in-out infinite',
  filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))',
});

const Logo = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const LogoText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '20px',
  fontWeight: 800,
  color: '#ffffff',
  letterSpacing: '-0.02em',
  '@media (max-width: 768px)': {
    fontSize: '18px',
  },
  '@media (max-width: 480px)': {
    fontSize: '16px',
  },
});

const PremiumBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#ffffff',
  fontSize: '10px',
  fontWeight: 700,
  height: '20px',
  borderRadius: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
  animation: 'shimmer 3s ease-in-out infinite',
  backgroundSize: '200% 100%',
  '& .MuiChip-label': {
    padding: '0 8px',
    fontWeight: 700,
  },
});

const LeftActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '@media (max-width: 768px)': {
    gap: '12px',
  },
});

const CenterActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RightActions = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '@media (max-width: 768px)': {
    gap: '12px',
  },
  '@media (max-width: 480px)': {
    gap: '8px',
  },
});

const CompileButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  background: '#f3f4f6',
  color: '#000000',
  border: '1px solid #f3f4f6',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 24px',
  minWidth: '120px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
  '&:hover': {
    background: '#e5e7eb',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.5)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: '#f3f4f6',
    color: '#000000',
    opacity: 0.7,
  },
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '@media (max-width: 768px)': {
    fontSize: '12px',
    padding: '8px 20px',
    minWidth: '100px',
  },
  '@media (max-width: 480px)': {
    fontSize: '11px',
    padding: '6px 16px',
    minWidth: '80px',
  },
});

const IconBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  color: '#64748b',
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid #e2e8f0',
  padding: '8px',
  borderRadius: '10px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    background: '#f8fafc',
    color: '#6366f1',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
    borderColor: '#c7d2fe',
  },
  '@media (max-width: 768px)': {
    padding: '6px',
  },
  '@media (max-width: 480px)': {
    padding: '5px',
  },
});

const MenuBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  color: '#475569',
  padding: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
  },
});

interface HeaderProps {
  onCompile?: () => void;
  isCompiling?: boolean;
  onMenuToggle?: () => void;
  isDrawerOpen?: boolean;
}

const Header = ({ onCompile, isCompiling = false, onMenuToggle, isDrawerOpen = false }: HeaderProps) => {
  const handleAddDomain = () => {
    console.log('Add domain clicked');
  };

  const handleOpenInNewTab = () => {
    console.log('Open in new tab clicked');
  };

  const handleDeploy = () => {
    console.log('Deploy now clicked');
  };

  return (
    <HeaderContainer>
      <LeftActions>
        <MenuBtn onClick={onMenuToggle} title="Toggle Menu">
          <Menu />
        </MenuBtn>
        
        <LogoContainer>
          
          <Logo>
            <LogoText>LaTeX Studio Pro</LogoText>
            <PremiumBadge label="PREMIUM" size="small" />
          </Logo>
        </LogoContainer>
      </LeftActions>
      
      <CenterActions>
        <CompileButton
          onClick={onCompile}
          disabled={isCompiling}
          startIcon={<PlayArrow />}
          variant="contained"
        >
          {isCompiling ? 'Compiling...' : 'Compile'}
        </CompileButton>
      </CenterActions>

      <RightActions>
        <IconBtn 
          size="small" 
          onClick={handleAddDomain}
          title="Add Domain"
        >
          <Public fontSize="small" />
        </IconBtn>
        
        <IconBtn 
          size="small" 
          onClick={handleOpenInNewTab}
          title="Open in New Tab"
        >
          <OpenInNew fontSize="small" />
        </IconBtn>
        
        <IconBtn 
          size="small" 
          onClick={handleDeploy}
          title="Deploy Now"
        >
          <CloudUpload fontSize="small" />
        </IconBtn>
      </RightActions>
    </HeaderContainer>
  );
};

export default Header;