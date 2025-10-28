'use client';

import { Box, Typography, IconButton, Button } from '@mui/material';
import { PlayArrow, Settings, GitHub } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const HeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '48px',
  background: '#2d2d30',
  borderBottom: '1px solid #3e3e42',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  color: '#cccccc',
});

const Logo = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '14px',
  fontWeight: 600,
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const ActionButtons = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const RunButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  background: '#007acc',
  color: 'white',
  textTransform: 'none',
  fontSize: '13px',
  fontWeight: 500,
  padding: '6px 12px',
  minWidth: 'auto',
  '&:hover': {
    background: '#005a9e',
  },
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const IconBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  color: '#cccccc',
  padding: '6px',
  '&:hover': {
    background: '#3e3e42',
    color: '#ffffff',
  },
});

interface HeaderProps {
  onRun?: () => void;
}

const Header = ({ onRun }: HeaderProps) => {
  return (
    <HeaderContainer>
      <Logo>
        <span>⚡</span>
        Code Editor
      </Logo>
      
      <ActionButtons>
        <RunButton
          onClick={onRun}
          startIcon={<PlayArrow />}
          variant="contained"
        >
          Run
        </RunButton>
        
        <IconBtn size="small">
          <Settings fontSize="small" />
        </IconBtn>
        
        <IconBtn size="small">
          <GitHub fontSize="small" />
        </IconBtn>
      </ActionButtons>
    </HeaderContainer>
  );
};

export default Header;