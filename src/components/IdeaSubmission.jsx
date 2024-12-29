import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Container, Typography, Paper, Box,
  Select, MenuItem, FormControl, InputLabel, Chip,
  Autocomplete, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import '../styles/IdeaSubmission.css';

const regions = [
  "Tokyo, Japan",
  "Berlin, Germany",
  "Toronto, Canada",
  "Dubai, United Arab Emirates",
  "Sydney, Australia",
  "London, United Kingdom",
  "San Francisco, USA",
  "Copenhagen, Denmark",
  "New York, USA",
  "Mumbai, India",
  "Beijing, China",
  "Vancouver, Canada",
  "Singapore",
  "Amsterdam, Netherlands",
  "São Paulo, Brazil",
  "Seoul, South Korea",
  "Stockholm, Sweden",
  "Paris, France",
  "Nairobi, Kenya",
  "Milan, Italy",
  "Seattle, USA",
  "Montreal, Canada",
  "Silicon Valley, USA",
  "Reykjavik, Iceland",
  "Cape Town, South Africa",
  "Tel Aviv, Israel",
  "Santiago, Chile",
  "Zurich, Switzerland"
];

const IdeaSubmission = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('individual');
  const [region, setRegion] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

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
      setError('Failed to fetch teams. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to submit an idea.');
      navigate('/login');
    } else if (type === 'individual' && !region) {
      setError('Please select a region for individual submission.');
    } else {
      try {
        const newIdea = {
          title,
          description,
          type,
          region: type === 'individual' ? region : null,
          team: selectedTeam ? selectedTeam.name : null,
          memberName: type === 'individual' ? memberName : null,
          votes: 0,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid,
          status: 'pending'
        };
        
        const docRef = await addDoc(collection(db, "ideas"), newIdea);
        console.log("Document written with ID: ", docRef.id);
        
        // Reset form fields
        setTitle('');
        setDescription('');
        setType('individual');
        setRegion('');
        setSelectedTeam(null);
        setMemberName('');
        setError('');
        
        // Show success message
        setSuccess('Idea submitted successfully!');
      } catch (e) {
        console.error("Error adding document: ", e);
        setError('Failed to submit idea. Please try again.');
      }
    }
  }

  return (
    <Container maxWidth="md" className="idea-submission-container">
      <Paper elevation={3} className="idea-submission-paper">
        <Typography variant="h4" gutterBottom className="submission-title">
          <LightbulbIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Submit Your Idea
        </Typography>
        <form onSubmit={handleSubmit} className="idea-submission-form">
          <TextField 
            label="Idea Title" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField 
            label="Description" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            multiline 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
              required
            >
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="team">Team</MenuItem>
            </Select>
          </FormControl>

          {type === 'individual' && (
            <>
              <TextField 
                label="Member Name" 
                variant="outlined" 
                fullWidth 
                margin="normal" 
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel>Region</InputLabel>
                <Select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  label="Region"
                  required
                >
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {type === 'team' && (
            <Autocomplete
              options={teams}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Select Team" variant="outlined" margin="normal" />
              )}
              value={selectedTeam}
              onChange={(event, newValue) => {
                setSelectedTeam(newValue);
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Typography>{option.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({option.region}, {option.members.length} members)
                  </Typography>
                </Box>
              )}
            />
          )}

          <Button variant="contained" color="primary" type="submit" fullWidth className="submit-button">
            Submit Idea
          </Button>
        </form>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Chip 
            icon={type === 'individual' ? <PersonIcon /> : <GroupIcon />}
            label={type} 
            color={type === 'individual' ? 'primary' : 'secondary'} 
          />
          {type === 'individual' && region && (
            <Chip 
              icon={<PublicIcon />}
              label={region} 
              variant="outlined"
            />
          )}
        </Box>
      </Paper>
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
  );
}

export default IdeaSubmission;
