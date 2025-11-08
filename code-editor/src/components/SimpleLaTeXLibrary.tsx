'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Search,
  ContentCopy,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const LibraryContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  height: '100%',
  background: '#252526',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const LibraryHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '16px',
  borderBottom: '1px solid #3e3e42',
  background: '#2d2d30',
});

const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '12px 16px',
  borderBottom: '1px solid #3e3e42',
});

const SearchField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#3c3c3c',
    color: '#cccccc',
    '&:hover fieldset': {
      borderColor: '#6366f1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#cccccc',
  },
  '& .MuiOutlinedInput-input': {
    color: '#cccccc',
  },
});

const LibraryContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  overflowY: 'auto',
  padding: '8px',
});

const CodeItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '12px',
  background: '#2d2d30',
  border: '1px solid #3e3e42',
  borderRadius: '4px',
  marginBottom: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#3c3c3c',
    borderColor: '#6366f1',
  },
});

const CodeContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  flex: 1,
  marginRight: '8px',
});

const CodeTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '13px',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: '8px',
});

const CodeContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontFamily: "'Monaco', 'Consolas', 'Courier New', monospace",
  fontSize: '11px',
  color: '#cccccc',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  background: '#1e1e1e',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #3e3e42',
  marginBottom: '8px',
});

const CopyBtn = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  padding: '4px',
  color: '#cccccc',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#6366f1',
    background: 'rgba(99, 102, 241, 0.1)',
  },
});

const TagsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

const TagChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'theme',
})({
  fontSize: '10px',
  height: '18px',
  background: '#3c3c3c',
  color: '#cccccc',
  border: '1px solid #3e3e42',
  '& .MuiChip-label': {
    padding: '0 6px',
    fontWeight: 400,
  },
});

const latexSnippets = [
  { 
    title: 'Document Structure', 
    code: '\\documentclass{article}\n\\title{My Document}\n\\author{Your Name}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\\section{Introduction}\nYour content here...\n\\end{document}',
    tags: ['document', 'basic']
  },
  { 
    title: 'Section Headers', 
    code: '\\section{Section Title}\n\\subsection{Subsection Title}\n\\subsubsection{Subsubsection Title}\n\\paragraph{Paragraph Title}\n\\subparagraph{Subparagraph Title}',
    tags: ['sections', 'structure']
  },
  { 
    title: 'Text Formatting', 
    code: '\\textbf{Bold text}\n\\textit{Italic text}\n\\underline{Underlined text}\n\\texttt{Monospace text}\n\\textsc{Small Caps}',
    tags: ['formatting', 'text']
  },
  { 
    title: 'List Environment', 
    code: '\\begin{itemize}\n  \\item First item\n  \\item Second item\n  \\begin{itemize}\n    \\item Nested item\n  \\end{itemize}\n\\end{itemize}',
    tags: ['list', 'itemize']
  },
  { 
    title: 'Numbered List', 
    code: '\\begin{enumerate}\n  \\item First item\n  \\item Second item\n  \\begin{enumerate}\n    \\item Nested item\n  \\end{enumerate}\n\\end{enumerate}',
    tags: ['list', 'enumerate']
  },
  { 
    title: 'Inline Math', 
    code: 'This is inline math: $E = mc^2$ and this is display math:\n\\[ \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2} \\]',
    tags: ['math', 'inline']
  },
  { 
    title: 'Math Environment', 
    code: '\\begin{equation}\n  \\int_{a}^{b} f(x) \\, dx = F(b) - F(a)\n\\end{equation}',
    tags: ['math', 'integral']
  },
  { 
    title: 'Fractions', 
    code: '$\\frac{a}{b}$, $\\frac{\\partial f}{\\partial x}$, $\\frac{d^2y}{dx^2}$',
    tags: ['math', 'fractions']
  },
  { 
    title: 'Greek Letters', 
    code: '$\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\theta, \\lambda, \\mu, \\pi, \\sigma, \\phi, \\omega$',
    tags: ['math', 'greek']
  },
  { 
    title: 'Matrices', 
    code: '\\begin{pmatrix}\n  a & b & c \\\\\n  d & e & f \\\\\n  g & h & i\n\\end{pmatrix}',
    tags: ['math', 'matrices']
  },
  { 
    title: 'TikZ - Basic Flowchart', 
    code: '\\usepackage{tikz}\n\\usetikzlibrary{shapes.geometric, arrows}\n\n\\begin{tikzpicture}[node distance=2cm]\n  \\tikzstyle{startstop} = [rectangle, rounded corners, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=red!30]\n  \\tikzstyle{process} = [rectangle, minimum width=3cm, minimum height=1cm, text centered, draw=black, fill=orange!30]\n  \\tikzstyle{arrow} = [thick,->,>=stealth]\n  \n  \\node (start) [startstop] {Start};\n  \\node (process1) [process, below of=start] {Process 1};\n  \\node (process2) [process, below of=process1] {Process 2};\n  \\node (stop) [startstop, below of=process2] {Stop};\n  \n  \\draw [arrow] (start) -- (process1);\n  \\draw [arrow] (process1) -- (process2);\n  \\draw [arrow] (process2) -- (stop);\n\\end{tikzpicture}',
    tags: ['tikz', 'flowchart', 'diagram']
  },
  { 
    title: 'TikZ - Simple Tree Diagram', 
    code: '\\usepackage{tikz}\n\\begin{tikzpicture}[level distance=1.5cm,\n  level 1/.style={sibling distance=3cm},\n  level 2/.style={sibling distance=1.5cm}]\n  \\tikzstyle{every node}=[circle,draw,fill=blue!20]\n  \\node {Root}\n    child {node {A}\n      child {node {A1}}\n      child {node {A2}}\n    }\n    child {node {B}\n      child {node {B1}}\n      child {node {B2}}\n    };\n\\end{tikzpicture}',
    tags: ['tikz', 'tree', 'diagram']
  },
  { 
    title: 'TikZ - Basic Shapes', 
    code: '\\usepackage{tikz}\n\\begin{tikzpicture}\n  \\draw[fill=blue!20] (0,0) rectangle (2,1);\n  \\draw[fill=red!20] (3,0.5) circle (0.5);\n  \\draw[fill=green!20] (5,0) -- (6,0) -- (5.5,1) -- cycle;\n  \\draw[thick,->] (0,-1) -- (6,-1) node[right] {x};\n  \\draw[thick,->] (-1,0) -- (-1,2) node[above] {y};\n\\end{tikzpicture}',
    tags: ['tikz', 'shapes', 'geometry']
  },
  { 
    title: 'Circuitikz - Basic Circuit', 
    code: '\\usepackage{circuitikz}\n\\begin{circuitikz}[scale=0.8]\n  \\draw (0,0) to[V=$V_1$] (0,3)\n        to[R=$R_1$] (3,3)\n        to[R=$R_2$] (3,0)\n        to[short] (0,0);\n  \\draw (3,3) to[C=$C_1$] (6,3)\n        to[L=$L_1$] (6,0)\n        to[short] (3,0);\n  \\draw (0,1.5) to[short] (-1,1.5) node[left] {Ground};\n\\end{circuitikz}',
    tags: ['circuitikz', 'circuit', 'electronics']
  },
  { 
    title: 'PGFPlots - Basic Plot', 
    code: '\\usepackage{pgfplots}\n\\pgfplotsset{compat=1.17}\n\\begin{tikzpicture}\n  \\begin{axis}[\n    xlabel={$x$},\n    ylabel={$y$},\n    grid=major,\n    width=8cm,\n    height=6cm\n  ]\n    \\addplot[blue, thick] {sin(deg(x))};\n    \\addplot[red, thick] {cos(deg(x))};\n    \\legend{$\\sin(x)$, $\\cos(x)$}\n  \\end{axis}\n\\end{tikzpicture}',
    tags: ['pgfplots', 'plot', 'graph']
  },
  { 
    title: 'Basic Table', 
    code: '\\begin{table}[h]\n  \\centering\n  \\caption{My Table}\n  \\begin{tabular}{|c|l|r|}\n    \\hline\n    \\textbf{Column 1} & \\textbf{Column 2} & \\textbf{Column 3} \\\\\n    \\hline\n    Row 1, Col 1 & Row 1, Col 2 & Row 1, Col 3 \\\\\n    Row 2, Col 1 & Row 2, Col 2 & Row 2, Col 3 \\\\\n    \\hline\n  \\end{tabular}\n\\end{table}',
    tags: ['table', 'basic']
  },
  { 
    title: 'Figure Environment', 
    code: '\\begin{figure}[h]\n  \\centering\n  \\includegraphics[width=0.8\\textwidth]{image.png}\n  \\caption{My Figure Caption}\n  \\label{fig:mylabel}\n\\end{figure}',
    tags: ['figure', 'image']
  },
];

const SimpleLaTeXLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSnippets = useMemo(() => {
    if (!searchQuery) return latexSnippets;
    
    const query = searchQuery.toLowerCase();
    return latexSnippets.filter(snippet => 
      snippet.title.toLowerCase().includes(query) ||
      snippet.code.toLowerCase().includes(query) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <LibraryContainer>
      <LibraryHeader>
        <Typography variant="h6" fontWeight={600} color="#ffffff">
          LaTeX Library
        </Typography>
        <Typography variant="caption" color="#cccccc">
          Pre-built code snippets
        </Typography>
      </LibraryHeader>

      <SearchContainer>
        <SearchField
          fullWidth
          size="small"
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: '#cccccc', mr: 1 }} />,
          }}
        />
      </SearchContainer>

      <LibraryContent>
        {filteredSnippets.map((snippet, index) => {
          const id = `snippet-${index}`;
          return (
            <CodeItem key={id}>
              <CodeContentContainer>
                <CodeTitle>{snippet.title}</CodeTitle>
                <CodeContent>{snippet.code}</CodeContent>
                <TagsContainer>
                  {snippet.tags.map(tag => (
                    <TagChip
                      key={tag}
                      label={tag}
                      size="small"
                    />
                  ))}
                </TagsContainer>
              </CodeContentContainer>
              <Tooltip title={copiedId === id ? "Copied!" : "Copy code"}>
                <CopyBtn
                  size="small"
                  onClick={() => handleCopy(snippet.code, id)}
                  color={copiedId === id ? "success" : "default"}
                >
                  <ContentCopy fontSize="small" />
                </CopyBtn>
              </Tooltip>
            </CodeItem>
          );
        })}
      </LibraryContent>
    </LibraryContainer>
  );
};

export default SimpleLaTeXLibrary;