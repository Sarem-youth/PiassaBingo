import React, { useState, useEffect } from "react";
import userService from "../../services/user.service";
import creditService from "../../services/credit.service";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const SuperAgents = () => {
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [openTransactions, setOpenTransactions] = useState(false);
  const [selectedUserForTransactions, setSelectedUserForTransactions] = useState(null);

  useEffect(() => {
    loadAgents();
  }, [page, rowsPerPage, search]);

  const loadAgents = () => {
    const params = {
      page,
      limit: rowsPerPage,
      search,
      roles: ["super agent"],
    };
    userService.getUsers(params).then((response) => {
      setAgents(response.data.users);
      setCount(response.data.count);
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
    userService.updateUser(id, { status: "locked" }).then(() => {
      loadAgents();
    });
  };

  const handleUnlock = (id) => {
    userService.updateUser(id, { status: "active" }).then(() => {
      loadAgents();
    });
  };

  const handleViewTransactions = (agent) => {
    setSelectedUserForTransactions(agent);
    setOpenTransactions(true);
  };

  const handleCloseTransactions = () => {
    setOpenTransactions(false);
    setSelectedUserForTransactions(null);
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Super Agents</Typography>
        <TextField
          label="Search"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={() => handleClickOpen(null)}>
          + Add New Agent
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Commission %</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>{agent.username}</TableCell>
                  <TableCell>{agent.balance}</TableCell>
                  <TableCell>{agent.commission_rate}</TableCell>
                  <TableCell>{agent.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClickOpen(agent)}>Change</Button>
                    {agent.status === "locked" ? (
                      <Button onClick={() => handleUnlock(agent.id)}>
                        Unlock
                      </Button>
                    ) : (
                      <Button onClick={() => handleLock(agent.id)}>Lock</Button>
                    )}
                    <Button onClick={() => handleViewTransactions(agent)}>View</Button>
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
      <AgentDialog
        open={open}
        onClose={handleClose}
        agent={selectedAgent}
        refresh={loadAgents}
      />
      {selectedUserForTransactions && (
        <TransactionHistoryDialog
          open={openTransactions}
          onClose={handleCloseTransactions}
          user={selectedUserForTransactions}
        />
      )}
    </Container>
  );
};

const AgentDialog = ({ open, onClose, agent, refresh }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (agent) {
      setFormData(agent);
    } else {
      setFormData({ role: 'super agent'});
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
      <DialogTitle>{agent ? "Edit Agent" : "Add Agent"}</DialogTitle>
      <DialogContent>
        <TextField
          name="username"
          label="Username"
          value={formData.username || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText={agent ? "Leave blank to keep current password" : ""}
        />
        <TextField
          name="commission_rate"
          label="Commission Rate"
          type="number"
          value={formData.commission_rate || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const TransactionHistoryDialog = ({ open, onClose, user }) => {
  const [credits, setCredits] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadCredits();
    }
  }, [user, page, rowsPerPage]);

  const loadCredits = () => {
    creditService.getCreditsByUser(user.id, { page, limit: rowsPerPage }).then(response => {
      setCredits(response.data.credits);
      setCount(response.data.count);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Transaction History for {user.username}</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Receiver</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credits.map(credit => (
                <TableRow key={credit.id}>
                  <TableCell>{new Date(credit.created_at).toLocaleString()}</TableCell>
                  <TableCell>{credit.type}</TableCell>
                  <TableCell>{credit.amount}</TableCell>
                  <TableCell>{credit.sender.username}</TableCell>
                  <TableCell>{credit.receiver.username}</TableCell>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SuperAgents;
