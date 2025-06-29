import React, { useState, useEffect } from 'react';
import userService from '../../services/user.service';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    loadShops();
  }, [page, rowsPerPage, search]);

  const loadShops = () => {
    const params = {
      page,
      limit: rowsPerPage,
      search,
      roles: ['shop'],
    };
    userService.getUsers(params).then((response) => {
      setShops(response.data.users);
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

  const handleClickOpen = (shop) => {
    setSelectedShop(shop);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShop(null);
  };

  const handleLock = (id) => {
    userService.updateUser(id, { status: 'locked' }).then(() => {
      loadShops();
    });
  };

  const handleUnlock = (id) => {
    userService.updateUser(id, { status: 'active' }).then(() => {
      loadShops();
    });
  };

  return (
    <Container>
      <Paper sx={{ p: 2, my: 2 }}>
        <Typography variant="h6">Shops</Typography>
        <TextField
          label="Search"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={() => handleClickOpen(null)}>+ Add New Shop</Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Online</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Cut</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>%</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Lock</TableCell>
                <TableCell>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>{shop.name}</TableCell>
                  <TableCell>{shop.online ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{shop.agent?.name}</TableCell>
                  <TableCell>{shop.cut}</TableCell>
                  <TableCell>{shop.balance}</TableCell>
                  <TableCell>{shop.commission}</TableCell>
                  <TableCell>{shop.phone}</TableCell>
                  <TableCell>{shop.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleClickOpen(shop)}>Change</Button>
                  </TableCell>
                  <TableCell>
                    {shop.locked ? (
                      <Button onClick={() => handleUnlock(shop.id)}>Unlock</Button>
                    ) : (
                      <Button onClick={() => handleLock(shop.id)}>Lock</Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button>View</Button>
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
      <ShopDialog open={open} onClose={handleClose} shop={selectedShop} refresh={loadShops} />
    </Container>
  );
};

const ShopDialog = ({ open, onClose, shop, refresh }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (shop) {
      setFormData(shop);
    } else {
      setFormData({
        name: '',
        username: '',
        phone: '',
        commission: '',
        password: ''
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const shopData = { ...formData, roles: ['shop'] };
    if (shop) {
      userService.updateUser(shop.id, shopData).then(() => {
        refresh();
        onClose();
      });
    } else {
      userService.createUser(shopData).then(() => {
        refresh();
        onClose();
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{shop ? 'Edit Shop' : 'Add Shop'}</DialogTitle>
      <DialogContent>
        <TextField name="name" label="Name" value={formData.name || ''} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="username" label="Username" value={formData.username || ''} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="phone" label="Phone" value={formData.phone || ''} onChange={handleChange} fullWidth margin="normal" />
        <TextField name="commission" label="Commission" value={formData.commission || ''} onChange={handleChange} fullWidth margin="normal" />
        {!shop && (
            <TextField name="password" label="Password" type="password" value={formData.password || ''} onChange={handleChange} fullWidth margin="normal" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Shops;
