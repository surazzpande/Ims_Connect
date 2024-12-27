import React, { useState, useEffect } from 'react';
import {
  Button, Container, Typography, Grid, Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, List, ListItem, ListItemText, Avatar, ThemeProvider,
  createTheme, Snackbar, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Group, PersonAdd, Delete } from '@mui/icons-material';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import '../styles/CollaborationHub.css';

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

const CollaborationHub = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: '', region: '', members: [] });
  const [newMember, setNewMember] = useState({ name: '', region: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "teams"));
      const teamsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams: ", error);
      setError("Failed to fetch teams. Please try again.");
    }
  };

  const handleCreateTeam = async () => {
    if (newTeam.name && newTeam.region && newTeam.members.length > 0) {
      try {
        const teamData = { ...newTeam, createdAt: serverTimestamp(), createdBy: auth.currentUser.uid };
        await addDoc(collection(db, "teams"), teamData);
        fetchTeams();
        setNewTeam({ name: '', region: '', members: [] });
        setSuccess('Team created successfully!');
      } catch (error) {
        console.error("Error creating team: ", error);
        setError("Failed to create team. Please try again.");
      }
    } else {
      setError("Please fill all fields and add at least one member.");
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.region) {
      setNewTeam({ ...newTeam, members: [...newTeam.members, newMember] });
      setNewMember({ name: '', region: '' });
    } else {
      setError("Please fill both name and region for the new member.");
    }
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = newTeam.members.filter((_, idx) => idx !== index);
    setNewTeam({ ...newTeam, members: updatedMembers });
  };

  const regions = [
    'Tokyo, Japan', 'Berlin, Germany', 'Toronto, Canada', 'Dubai, United Arab Emirates',
    'Sydney, Australia', 'London, United Kingdom', 'San Francisco, USA', 'Copenhagen, Denmark',
    'New York, USA', 'Mumbai, India', 'Beijing, China', 'Vancouver, Canada', 'Singapore',
    'Amsterdam, Netherlands', 'São Paulo, Brazil', 'Seoul, South Korea', 'Stockholm, Sweden',
    'Paris, France', 'Nairobi, Kenya', 'Milan, Italy', 'Seattle, USA', 'Montreal, Canada',
    'Silicon Valley, USA', 'Reykjavik, Iceland', 'Cape Town, South Africa', 'Tel Aviv, Israel',
    'Santiago, Chile', 'Zurich, Switzerland'
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="collaboration-hub-container">
        <Typography variant="h3" gutterBottom align="center" color="primary" className="page-title">
          <Group sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Collaboration Hub
        </Typography>
        <Card elevation={3} className="collaboration-card">
          <CardContent>
            <Grid container spacing={4} className="main-content">
              <Grid item xs={12}>
                <Card className="team-creation-card">
                  <CardContent>
                    <Typography variant="h6" className="card-title">Create a Team</Typography>
                    <TextField
                      fullWidth
                      label="Team Name"
                      variant="outlined"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      margin="normal"
                    />
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Team Region</InputLabel>
                      <Select
                        value={newTeam.region}
                        onChange={(e) => setNewTeam({ ...newTeam, region: e.target.value })}
                        label="Team Region"
                      >
                        {regions.map((region) => (
                          <MenuItem key={region} value={region}>{region}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box display="flex" alignItems="center" mt={2}>
                      <TextField
                        fullWidth
                        label="Member Name"
                        variant="outlined"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        margin="normal"
                      />
                      <FormControl variant="outlined" sx={{ minWidth: 150, ml: 2 }}>
                        <InputLabel>Member Region</InputLabel>
                        <Select
                          value={newMember.region}
                          onChange={(e) => setNewMember({ ...newMember, region: e.target.value })}
                          label="Member Region"
                        >
                          {regions.map((region) => (
                            <MenuItem key={region} value={region}>{region}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMember}
                        startIcon={<PersonAdd />}
                        sx={{ ml: 2 }}
                      >
                        Add Member
                      </Button>
                    </Box>
                    <List className="member-list">
                      {newTeam.members.map((member, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <Button onClick={() => handleRemoveMember(index)} startIcon={<Delete />}>
                              Remove
                            </Button>
                          }
                        >
                          <ListItemText primary={member.name} secondary={member.region} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateTeam}
                      fullWidth
                      disabled={!newTeam.name || !newTeam.region || newTeam.members.length === 0}
                      sx={{ mt: 2 }}
                    >
                      Create Team
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card className="teams-display-card">
                  <CardContent>
                    <Typography variant="h6" className="card-title">Teams</Typography>
                    {teams.length > 0 ? (
                      <TableContainer component={Paper} elevation={3} className="teams-table">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Team Name</StyledTableCell>
                              <StyledTableCell>Team Region</StyledTableCell>
                              <StyledTableCell>Number of Members</StyledTableCell>
                              <StyledTableCell>Members</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {teams.map((team) => (
                              <StyledTableRow key={team.id}>
                                <StyledTableCell>{team.name}</StyledTableCell>
                                <StyledTableCell>{team.region}</StyledTableCell>
                                <StyledTableCell>{team.members.length}</StyledTableCell>
                                <StyledTableCell>
                                  {team.members.map((member, idx) => (
                                    <Chip
                                      key={idx}
                                      label={member.name}
                                      avatar={<Avatar>{member.name[0]}</Avatar>}
                                      sx={{ m: 0.5 }}
                                    />
                                  ))}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No teams created yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default CollaborationHub;
