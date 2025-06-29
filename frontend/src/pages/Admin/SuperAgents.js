import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Edit, Delete, Lock, LockOpen } from '@mui/icons-material';
import userService from '../../services/user.service';

const SuperAgents = () => {
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    loadAgents();
  }, [page, rowsPerPage, search]);

  const loadAgents = () => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      role: 'agent',
      search
    };
    userService.getUsers(params).then(response => {
      setAgents(response.data.items);
      setCount(response.data.totalItems);
    });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (agent) => {
    setSelectedAgent(agent);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAgent(null);
  };

  const handleLock = (id) => {
    userService.updateUser(id, { status: 'locked' }).then(() => {
      loadAgents();
    });
  };

  const handleUnlock = (id) => {
    userService.updateUser(id, { status: 'active' }).then(() => {
      loadAgents();
    });
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Super Agents</Typography>
          <Button variant="contained" onClick={() => handleClickOpen(null)}>+ Add New Agent</Button>
        </Box>
        <TextField
          label="Search in keys"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>%</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.username}</TableCell>
                  <TableCell>{agent.balance}</TableCell>
                  <TableCell>{agent.commission}</TableCell>
                  <TableCell>{agent.phone}</TableCell>
                  <TableCell>{agent.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleClickOpen(agent)}><Edit /></IconButton>
                    {agent.status === 'active' ? (
                      <IconButton onClick={() => handleLock(agent.id)}><Lock /></IconButton>
                    ) : (
                      <IconButton onClick={() => handleUnlock(agent.id)}><LockOpen /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AgentDialog open={open} onClose={handleClose} agent={selectedAgent} refresh={loadAgents} />
    </Container>
  );
};

const AgentDialog = ({ open, onClose, agent, refresh }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    } else {
      setFormData({
        role: 'agent',
        status: 'active'
      });
    }
  }, [agent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (agent) {
      userService.updateUser(agent.id, formData).then(() => {
        refresh();
        onClose();
      });
    } else {
      userService.createUser(formData).then(() => {
        refresh();
        onClose();
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{agent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" name="name" label="Name" type="text" fullWidth value={formData.name || ''} onChange={handleChange} />
        <TextField margin="dense" name="username" label="Username" type="text" fullWidth value={formData.username || ''} onChange={handleChange} />
        <TextField margin="dense" name="password" label="Password" type="password" fullWidth onChange={handleChange} />
        <TextField margin="dense" name="balance" label="Balance" type="number" fullWidth value={formData.balance || ''} onChange={handleChange} />
        <TextField margin="dense" name="commission" label="Commission (%)" type="number" fullWidth value={formData.commission || ''} onChange={handleChange} />
        <TextField margin="dense" name="phone" label="Phone" type="text" fullWidth value={formData.phone || ''} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuperAgents;
