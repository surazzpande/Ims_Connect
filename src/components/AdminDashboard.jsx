import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, CardContent, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, 
  Avatar, LinearProgress, ThemeProvider, createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/AdminDashboard.css';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

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

const AdminDashboard = () => {
  const [topIdeas, setTopIdeas] = useState([]);
  const [otherIdeas, setOtherIdeas] = useState([]);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const ideasRef = collection(db, 'ideas');
      const topIdeasQuery = query(ideasRef, orderBy('votes', 'desc'), limit(5));
      const otherIdeasQuery = query(ideasRef, orderBy('votes', 'desc'), limit(10));

      const topIdeasSnapshot = await getDocs(topIdeasQuery);
      const otherIdeasSnapshot = await getDocs(otherIdeasQuery);

      const topIdeasData = topIdeasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopIdeas(topIdeasData);

      const otherIdeasData = otherIdeasSnapshot.docs
        .slice(5)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      setOtherIdeas(otherIdeasData);
    } catch (error) {
      console.error("Error fetching ideas: ", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="admin-dashboard-container">
        <Box className="dashboard-header">
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <EmojiEventsIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" className="dashboard-title">
            Admin Dashboard
          </Typography>
        </Box>

        <Box className="section-container">
          <Typography variant="h4" gutterBottom className="section-title">
            <LightbulbIcon sx={{ fontSize: 30, verticalAlign: 'middle', mr: 1 }} />
            Top 5 Ideas from Reward Center
          </Typography>
          <Grid container spacing={3}>
            {topIdeas.map((idea, index) => (
              <Grid item xs={12} sm={6} md={4} key={idea.id}>
                <Card className={`idea-card top-${index + 1}`} elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{idea.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{idea.description}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        icon={idea.type === 'individual' ? <PersonIcon /> : <GroupIcon />}
                        label={idea.type} 
                        color={idea.type === 'individual' ? 'primary' : 'secondary'} 
                        size="small" 
                      />
                      <Chip 
                        icon={<PublicIcon />}
                        label={idea.region} 
                        variant="outlined"
                        size="small" 
                      />
                    </Box>
                    {/* <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">Progress</Typography>
                      <LinearProgress variant="determinate" value={idea.progress || 0} sx={{ height: 8, borderRadius: 5 }} />
                    </Box> */}
                    <Typography variant="body1" className="vote-count">
                      Votes: {idea.votes}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="section-container">
          <Typography variant="h4" gutterBottom className="section-title">
            <TrendingUpIcon sx={{ fontSize: 30, verticalAlign: 'middle', mr: 1 }} />
            Other Ideas
          </Typography>
          <TableContainer component={Paper} elevation={3} className="ideas-table">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell>Region</StyledTableCell>
                  <StyledTableCell align="right">Votes</StyledTableCell>
                  <StyledTableCell align="right">Progress</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {otherIdeas.map((idea) => (
                  <StyledTableRow key={idea.id}>
                    <StyledTableCell component="th" scope="row">{idea.title}</StyledTableCell>
                    <StyledTableCell>{idea.description}</StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        icon={idea.type === 'individual' ? <PersonIcon /> : <GroupIcon />}
                        label={idea.type} 
                        color={idea.type === 'individual' ? 'primary' : 'secondary'} 
                        size="small" 
                      />
                    </StyledTableCell>
                    <StyledTableCell>{idea.region}</StyledTableCell>
                    <StyledTableCell align="right">{idea.votes}</StyledTableCell>
                    <StyledTableCell align="right">
                      <LinearProgress variant="determinate" value={idea.progress || 0} sx={{ height: 8, borderRadius: 5 }} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AdminDashboard;
