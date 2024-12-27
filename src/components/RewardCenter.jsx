import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Box, Chip, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/RewardCenter.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const RewardCenter = () => {
  const [topIdeas, setTopIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopIdeas();
  }, []);

  const fetchTopIdeas = async () => {
    try {
      const ideasRef = collection(db, 'ideas');
      const q = query(ideasRef, orderBy('votes', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      const ideas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopIdeas(ideas);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top ideas: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="reward-center-container">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <EmojiEventsIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
            Reward Center
          </Typography>
          <Typography variant="body1" gutterBottom>
            Congratulations to our top contributors! Here are the top 5 ideas:
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {topIdeas.map((idea, index) => (
            <Grid item xs={12} sm={6} md={4} key={idea.id}>
              <Card className={`idea-card rank-${index + 1}`} elevation={3}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom className="idea-title">
                    #{index + 1}: {idea.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="idea-description">
                    {idea.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      label={idea.type} 
                      color={idea.type === 'individual' ? 'primary' : 'secondary'} 
                      size="small" 
                    />
                    <Typography variant="h6" className="vote-count">
                      Votes: {idea.votes}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default RewardCenter;
