'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import { OpenInNew, ArrowBack, Code } from '@mui/icons-material';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  chatCount: number;
  projectUrl: string;
  lastUpdated: string;
}

interface ProjectsResponse {
  success: boolean;
  projects: Project[];
  projectCount: number;
  error?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/chats');
      const data: ProjectsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch projects');
      }
      
      if (data.success) {
        setProjects(data.projects);
      } else {
        throw new Error(data.error || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchProjects}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Button 
            color="inherit" 
            startIcon={<ArrowBack />}
            href="/"
          >
            Back to Generator
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            v0.dev Chats
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Code />}
            href="/"
          >
            Generator
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your v0.dev Chats
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chat history synced from your v0.dev account
          </Typography>
        </Box>

      {projects.length === 0 ? (
        <Alert severity="info">
          No chats found. Create your first chat on v0.dev to see it here.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid sx={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${project.chatCount} chats`} 
                      size="small" 
                      variant="outlined" 
                    />
                  </Box>
                  
                  <Typography variant="caption" display="block" color="text.secondary">
                    Created: {formatDate(project.createdAt)}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Updated: {formatDate(project.lastUpdated)}
                  </Typography>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<OpenInNew />}
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in v0.dev
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="outlined" onClick={fetchProjects}>
          Refresh Chats
        </Button>
      </Box>
      </Container>
    </>
  );
}