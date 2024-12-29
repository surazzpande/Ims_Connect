import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab,
  Box, Chip, Select, MenuItem, FormControl, InputLabel, Avatar,
  List, ListItem, ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
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

const regions = [
  "All Regions", "Tokyo, Japan", "Berlin, Germany", "Toronto, Canada",
  "Dubai, United Arab Emirates", "Sydney, Australia", "London, United Kingdom",
  "San Francisco, USA", "Copenhagen, Denmark", "New York, USA", "Mumbai, India",
  "Beijing, China", "Vancouver, Canada", "Singapore", "Amsterdam, Netherlands",
  "São Paulo, Brazil", "Seoul, South Korea", "Stockholm, Sweden", "Paris, France",
  "Nairobi, Kenya", "Milan, Italy", "Seattle, USA", "Montreal, Canada",
  "Silicon Valley, USA", "Reykjavik, Iceland", "Cape Town, South Africa",
  "Tel Aviv, Israel", "Santiago, Chile", "Zurich, Switzerland"
];

const RegionalDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  useEffect(() => {
    fetchIdeas();
    fetchTeams();
  }, [selectedRegion]);

  const fetchIdeas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ideas"));
      const ideasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIdeas(ideasData);
    } catch (error) {
      console.error("Error fetching ideas: ", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams: ", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const filteredIdeas = ideas.filter(idea => 
    (selectedRegion === 'All Regions' || idea.region === selectedRegion) &&
    (tabValue === 0 || (tabValue === 1 && idea.type === 'individual') || (tabValue === 2 && idea.type === 'team'))
  ).sort((a, b) => b.votes - a.votes);

  const filteredTeams = teams.filter(team => 
    selectedRegion === 'All Regions' || team.regions.includes(selectedRegion)
  );

  const topIdeas = filteredIdeas.slice(0, 5);
  const remainingIdeas = filteredIdeas.slice(5);

  return (
    <Container maxWidth="lg" className="regional-dashboard-container">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" className="dashboard-title">
          <PublicIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Regional Dashboard: {selectedRegion}
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Select Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            label="Select Region"
          >
            {regions.map((region) => (
              <MenuItem key={region} value={region}>{region}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }} className="idea-tabs">
        <Tab icon={<PublicIcon />} label="All Ideas" />
        <Tab icon={<PersonIcon />} label="Individual Ideas" />
        <Tab icon={<GroupIcon />} label="Team Ideas" />
      </Tabs>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className="section-title">
            <LightbulbIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Top Ideas
          </Typography>
          <Grid container spacing={2}>
            {topIdeas.map(idea => (
              <Grid item xs={12} sm={6} md={4} key={idea.id}>
                <Card elevation={3}>
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
                      <Typography variant="body2">Votes: {idea.votes}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {remainingIdeas.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom className="section-title">
              <PublicIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              All Ideas
            </Typography>
            <TableContainer component={Paper} elevation={3} className="ideas-table">
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
                          icon={idea.type === 'individual' ? <PersonIcon /> : <GroupIcon />}
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
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className="section-title">
            <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Teams in {selectedRegion}
          </Typography>
          <List>
            {filteredTeams.map((team) => (
              <ListItem key={team.id}>
                <ListItemText
                  primary={team.name}
                  secondary={`${team.members.length} members`}
                />
                <Box>
                  {team.members.slice(0, 3).map((member, index) => (
                    <Avatar key={index} sx={{ width: 24, height: 24, fontSize: 12, mr: 0.5 }}>
                      {member.name[0]}
                    </Avatar>
                  ))}
                  {team.members.length > 3 && (
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      +{team.members.length - 3}
                    </Avatar>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default RegionalDashboard;
