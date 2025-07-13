'use client';

import { useState } from 'react';

interface GeneratedFile {
  meta?: { file: string } | string;
  lang?: string;
  source: string;
}

interface GenerationResult {
  success: boolean;
  previewUrl?: string;
  chatUrl?: string;
  id: string;
  files?: GeneratedFile[];
}
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Chip, 
  CircularProgress,
  Alert,
  Stack,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar
} from '@mui/material';
import { CodeRounded, PlayArrowRounded, ExpandMoreRounded, FolderRounded, OpenInNew, DescriptionRounded } from '@mui/icons-material';

const TEMPLATE_CHIPS = [
  'Login form with email and password',
  'Data table with sorting and pagination',
  'Navigation bar with dropdown menu',
  'Dashboard with cards and charts',
  'Product card with image and details',
  'Modal dialog with form inputs',
  'Stepper component for multi-step form',
  'Search bar with autocomplete'
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (template: string) => {
    setPrompt(template);
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            V0 SDK UI Demo
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<FolderRounded />}
            href="/projects"
          >
            Chats
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            V0 SDK UI Framework Demo
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            AI-powered UI component generation with v0-sdk
          </Typography>
        </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeRounded color="primary" />
          Describe your component
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the MUI component you want to generate..."
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Quick templates:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {TEMPLATE_CHIPS.map((template, index) => (
              <Chip
                key={index}
                label={template}
                onClick={() => handleChipClick(template)}
                variant="outlined"
                size="small"
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowRounded />}
          sx={{ minWidth: 200 }}
        >
          {loading ? 'Generating...' : 'Generate Component'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Component
          </Typography>
          
          <Box mb={3}>
            {result.chatUrl && (
              <Button
                variant="outlined"
                href={result.chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
              >
                View Chat
              </Button>
            )}
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Preview" />
              <Tab label="Code Files" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              {result.previewUrl ? (
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    href={result.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                  >
                    Open Preview in New Tab
                  </Button>
                  <Paper
                    variant="outlined"
                    sx={{
                      height: 600,
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <iframe
                      src={result.previewUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      title="Component Preview"
                      onError={() => console.log('iframe failed to load')}
                    />
                  </Paper>
                </Stack>
              ) : (
                <Alert severity="info">
                  Preview not available. Use the "View Chat" button above to see the component on v0.dev.
                </Alert>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Generated Files
              </Typography>
              {result.files && Array.isArray(result.files) && result.files.length > 0 ? (
                result.files.map((file: GeneratedFile, index: number) => {
                  const fileName = typeof file.meta === 'object' && file.meta?.file 
                    ? file.meta.file 
                    : typeof file.meta === 'string' 
                    ? file.meta 
                    : `File ${index + 1}`;
                  
                  return (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionRounded color="action" />
                          {fileName}
                          {file.lang && <Chip label={file.lang} size="small" sx={{ ml: 1 }} />}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            backgroundColor: 'grey.50',
                            overflow: 'auto',
                            maxHeight: 400
                          }}
                        >
                          <pre style={{ 
                            margin: 0, 
                            fontFamily: 'monospace', 
                            fontSize: '0.875rem',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {file.source || 'No source code available'}
                          </pre>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              ) : (
                <Typography color="text.secondary">
                  No code files available
                </Typography>
              )}
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Chat ID: {result.id}
          </Typography>
        </Paper>
      )}
      </Container>
    </>
  );
}
