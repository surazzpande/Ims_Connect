import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab,
  Box, Chip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../styles/RegionalDashboard.css';

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

const RegionalDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('Tokyo, Japan');

  useEffect(() => {
    fetchIdeas();
  }, [selectedRegion]);

  const fetchIdeas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ideas"));
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(ideasData.filter(idea => idea.region === selectedRegion));
    } catch (error) {
      console.error("Error fetching ideas: ", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const filteredIdeas = ideas.filter(idea =>
    tabValue === 0 || (tabValue === 1 && idea.type === 'individual') || (tabValue === 2 && idea.type === 'team')
  );

  const topIdeas = [...filteredIdeas].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const remainingIdeas = [...filteredIdeas].sort((a, b) => b.votes - a.votes).slice(3);

  return (
    <Container maxWidth="lg" className="regional-dashboard-container">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" className="dashboard-title">
          <PublicIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Regional Dashboard
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Select Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            label="Select Region"
          >
            <MenuItem value="Tokyo, Japan">Tokyo, Japan</MenuItem>
            <MenuItem value="Berlin, Germany">Berlin, Germany</MenuItem>
            <MenuItem value="Toronto, Canada">Toronto, Canada</MenuItem>
            <MenuItem value="Dubai, United Arab Emirates">Dubai, United Arab Emirates</MenuItem>
            <MenuItem value="Sydney, Australia">Sydney, Australia</MenuItem>
            <MenuItem value="London, United Kingdom">London, United Kingdom</MenuItem>
            <MenuItem value="San Francisco, USA">San Francisco, USA</MenuItem>
            <MenuItem value="Copenhagen, Denmark">Copenhagen, Denmark</MenuItem>
            <MenuItem value="New York, USA">New York, USA</MenuItem>
            <MenuItem value="Mumbai, India">Mumbai, India</MenuItem>
            <MenuItem value="Beijing, China">Beijing, China</MenuItem>
            <MenuItem value="Vancouver, Canada">Vancouver, Canada</MenuItem>
            <MenuItem value="Singapore">Singapore</MenuItem>
            <MenuItem value="Amsterdam, Netherlands">Amsterdam, Netherlands</MenuItem>
            <MenuItem value="São Paulo, Brazil">São Paulo, Brazil</MenuItem>
            <MenuItem value="Seoul, South Korea">Seoul, South Korea</MenuItem>
            <MenuItem value="Stockholm, Sweden">Stockholm, Sweden</MenuItem>
            <MenuItem value="Paris, France">Paris, France</MenuItem>
            <MenuItem value="Nairobi, Kenya">Nairobi, Kenya</MenuItem>
            <MenuItem value="Milan, Italy">Milan, Italy</MenuItem>
            <MenuItem value="Seattle, USA">Seattle, USA</MenuItem>
            <MenuItem value="Montreal, Canada">Montreal, Canada</MenuItem>
            <MenuItem value="Silicon Valley, USA">Silicon Valley, USA</MenuItem>
            <MenuItem value="Reykjavik, Iceland">Reykjavik, Iceland</MenuItem>
            <MenuItem value="Cape Town, South Africa">Cape Town, South Africa</MenuItem>
            <MenuItem value="Tel Aviv, Israel">Tel Aviv, Israel</MenuItem>
            <MenuItem value="Santiago, Chile">Santiago, Chile</MenuItem>
            <MenuItem value="Zurich, Switzerland">Zurich, Switzerland</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }} className="idea-tabs">
        <Tab icon={<PublicIcon />} label="All Ideas" />
        <Tab icon={<PersonIcon />} label="Individual Ideas" />
        <Tab icon={<GroupIcon />} label="Team Ideas" />
      </Tabs>

      {/* Top Ideas Section */}
      <Card className="top-ideas-card" elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom className="card-title">Top Ideas</Typography>
          <Grid container spacing={2}>
            {topIdeas.map(idea => (
              <Grid item xs={12} sm={4} key={idea.id}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>{idea.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{idea.description}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={idea.type}
                      color={idea.type === 'individual' ? 'primary' : 'secondary'}
                      size="small"
                    />
                    <Typography variant="body2">Votes: {idea.votes}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Remaining Ideas Section */}
      <TableContainer component={Paper} sx={{ mt: 3 }} elevation={3} className="ideas-table">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell align="right">Votes</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {remainingIdeas.map((idea) => (
              <StyledTableRow key={idea.id}>
                <StyledTableCell component="th" scope="row">{idea.title}</StyledTableCell>
                <StyledTableCell>{idea.description}</StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={idea.type}
                    color={idea.type === 'individual' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{idea.votes}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default RegionalDashboard;
