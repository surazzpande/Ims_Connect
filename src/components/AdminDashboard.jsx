import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, ThemeProvider, createTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import '../styles/AdminDashboard.css';

// ... (StyledTableCell, StyledTableRow, and theme definitions remain the same)

const AdminDashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentIdea, setCurrentIdea] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchIdeas();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdTokenResult();
      setIsAdmin(token.claims.admin === true);
    }
  };

  const fetchIdeas = async () => {
    try {
      const ideasRef = collection(db, 'ideas');
      const ideasQuery = query(ideasRef, orderBy('votes', 'desc'));
      const ideasSnapshot = await getDocs(ideasQuery);
      const ideasData = ideasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIdeas(ideasData);
    } catch (error) {
      console.error("Error fetching ideas: ", error);
    }
  };

  const handleEdit = (idea) => {
    setCurrentIdea(idea);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        await deleteDoc(doc(db, 'ideas', id));
        fetchIdeas();
      } catch (error) {
        console.error("Error deleting idea: ", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (currentIdea.id) {
        await updateDoc(doc(db, 'ideas', currentIdea.id), currentIdea);
      } else {
        await addDoc(collection(db, 'ideas'), { ...currentIdea, votes: 0 });
      }
      setOpenDialog(false);
      fetchIdeas();
    } catch (error) {
      console.error("Error saving idea: ", error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentIdea({ ...currentIdea, [e.target.name]: e.target.value });
  };

  const renderIdeaDialog = () => (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{currentIdea?.id ? 'Edit Idea' : 'Add New Idea'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Title"
          type="text"
          fullWidth
          value={currentIdea?.title || ''}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={currentIdea?.description || ''}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={currentIdea?.type || ''}
            onChange={handleInputChange}
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="team">Team</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          name="region"
          label="Region"
          type="text"
          fullWidth
          value={currentIdea?.region || ''}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );

  const renderIdeaCard = (idea, index) => (
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
          <Chip icon={<PublicIcon />} label={idea.region} variant="outlined" size="small" />
        </Box>
        <Typography variant="body1" className="vote-count">
          Votes: {idea.votes}
        </Typography>
        {isAdmin && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<EditIcon />} onClick={() => handleEdit(idea)}>Edit</Button>
            <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(idea.id)}>Delete</Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const topIdeas = ideas.slice(0, 5);
  const otherIdeas = ideas.slice(5);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="admin-dashboard-container">
        <Box className="dashboard-header">
          <EmojiEventsIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" className="dashboard-title">
            Admin Dashboard
          </Typography>
        </Box>
        <Box className="section-container">
          <Typography variant="h4" gutterBottom className="section-title">
            <LightbulbIcon sx={{ fontSize: 30, verticalAlign: 'middle', mr: 1 }} />
            Top 5 Ideas
          </Typography>
          <Grid container spacing={3}>
            {topIdeas.map((idea, index) => (
              <Grid item xs={12} sm={6} md={4} key={idea.id}>
                {renderIdeaCard(idea, index)}
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
                  <StyledTableCell align="right">Actions</StyledTableCell>
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
                      {isAdmin && (
                        <>
                          <Button startIcon={<EditIcon />} onClick={() => handleEdit(idea)}>Edit</Button>
                          <Button startIcon={<DeleteIcon />} onClick={() => handleDelete(idea.id)}>Delete</Button>
                        </>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentIdea({});
              setOpenDialog(true);
            }}
            className="add-idea-button"
          >
            Add New Idea
          </Button>
        )}
        {renderIdeaDialog()}
      </Container>
    </ThemeProvider>
  );
}

export default AdminDashboard;
