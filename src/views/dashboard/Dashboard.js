import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { users } from './components/user';

import Iconify from 'src/components/iconify';
import TableNoData from './components/table-no-data';
import UserTableRow from './components/user-table-row';
import UserTableHead from './components/user-table-head';
import TableEmptyRows from './components/table-empty-rows';
import UserTableToolbar from './components/user-table-toolbar';
import { emptyRows, applyFilter, getComparator, GetDateString } from './components/utils';


import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from 'react-redux';
import {setShowProgressBar} from "../../variableList"


import axios from 'axios';
const accessToken = window.localStorage.getItem('accessToken')


// ----------------------------------------------------------------------

export default function Dashboard() {

  const [users, setUers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = React.useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setnewEmail] = useState("");
  const [newAccountNumber, setnewAccountNumber] = useState(0);
  const [newExpireTime, setnewExpireTime] = useState(new Date());

  const [selected_Del, setSelected_Del] = useState(false);
  const [useMonthlyFee, setUseMonthlyFee] = React.useState(false);
  const [showDeleConfirm, setShowDeleConfirm] = React.useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkClientText, setBulkClientText] = useState('');

  const dispatch = useDispatch();

  const CloseBulk = () => {
    setShowBulk(false);
    setBulkClientText('');
  }

  const ConfirmBulk = async () => {
    setShowBulk(false);
    dispatch(setShowProgressBar(true));

    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/ClientCreateBulk`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: { BulkInfo: bulkClientText }
    };
    await axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          setBulkClientText('');
          let msg = response.data.message;
          let newClients = response.data.result;
          if (msg !== "")
            alert(msg);
          for (let i = 0; i < newClients?.length; i++)
            users.push(newClients[i]);
          setUers(users);         
        }
        dispatch(setShowProgressBar(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setShowProgressBar(false));
      });


  }


  const handleCloseDeletConfirm = () => {
    setShowDeleConfirm(false);
    setSelected_Del(true);
  };

  const handleCancelDeletConfirm = () => {
    setShowDeleConfirm(false);
    setSelected([]);
  };

  const handleClose = () => {
    setShow(false);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };



  const baseURL = process.env.REACT_APP_ServerURL;

  useEffect(() => {

    if (!selected_Del)
      return;
    dispatch(setShowProgressBar(true));

    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/DeleteAllClient`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: { IDs: selected }
    };
    axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.result);
          setSelected_Del(false);
          Create_Clients_Info_2();
          setSelected([]);          
        }
        dispatch(setShowProgressBar(false));
      })
      .catch((error) => {
        console.log(error);
        dispatch(setShowProgressBar(false));
      });


  }, [selected_Del]);

  useEffect(() => {
    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/AllClients`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
    };
    dispatch(setShowProgressBar(true));
    axios(config)
      .then((response) => {

        if (response.status === 200) {
          console.log(response);
          setUers(response.data.result);
        }

        dispatch(setShowProgressBar(false));

      })
      .catch((error) => {
        console.log(error);
        dispatch(setShowProgressBar(false));
      });

  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;


  const ShowDialog = () => {
    setShow(true);
    setUseMonthlyFee(false);
  }


  const Create_Clients_Info = (newInfo) => {
    let newClients = [];
    for (let i = 0; i < users.length; i++) {
      newClients.push(users[i]);
    }
    let new_client = {};
    new_client.Name = newInfo.Name;
    new_client.Email = newInfo.Email;
    new_client.AccountNumber = newInfo.AccountNumber;
    new_client.ExpireTime = GetDateString(newInfo.ExpireTime);
    new_client.createdAt = GetDateString(newInfo.createdAt);
    new_client.updatedAt = GetDateString(newInfo.updatedAt);
    new_client.MonthlySubscript = newInfo.MonthlySubscript;
    new_client.id = newInfo.id;
    newClients.push(new_client);
    setUers(newClients);
  }

  const Create_Clients_Info_2 = () => {
    let newClients = [];
    for (let i = 0; i < users.length; i++) {
      let isSelected = false;
      for (let j = 0; j < selected.length; j++) {
        if (users[i].id === selected[j]) {
          isSelected = true;
          break;
        }
      }
      if (!isSelected)
        newClients.push(users[i]);
    }
    setUers(newClients);
  }


  const Confirm_Create = async () => {
    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/ClientCreate`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: {
        Name: newName,
        Email: newEmail,
        AccountNumber: newAccountNumber,
        ExpireTime: newExpireTime,
        MonthlySubscript: useMonthlyFee
      }
    };

    dispatch(setShowProgressBar(true));

    await axios(config)
      .then((response) => {
        if (response.status === 200) {
          Create_Clients_Info(response.data);
        }
        dispatch(setShowProgressBar(false));

      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
        dispatch(setShowProgressBar(false));
      });

  }



  const handleChange = (event) => {
    setUseMonthlyFee(event.target.value);
  };


  return (
    <Container>  
     
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Users</Typography>
        <div>
          <Button variant="contained" color="primary" onClick={ShowDialog} style={{ marginRight: 50 }} startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>

          <Button variant="contained" color="primary" onClick={() => { setShowBulk(true) }} startIcon={<Iconify icon="eva:plus-fill" />}>
            Bulk Users
          </Button>
        </div>

      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          setSelected_Del={setShowDeleConfirm}
        />

        <div>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'Name', label: 'Name' },
                  { id: 'Email', label: 'Email' },
                  { id: 'AccountNumber', label: 'AccountNumber' },
                  { id: 'ExpireTime', label: 'ExpireTime' },
                  { id: 'createdAt', label: 'Created' },
                  { id: 'updatedAt', label: 'Updated' },
                  { id: 'MonthlySubscript', label: 'Monthly Subscribe?' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      ID={row.id}
                      Name={row.Name}
                      Email={row.Email}
                      avatarUrl={row.avatarUrl}
                      AccountNumber={row.AccountNumber}
                      updatedAt={GetDateString(row.updatedAt)}
                      createdAt={GetDateString(row.createdAt)}
                      clients={users}
                      setclients={setUers}
                      ExpireTime={GetDateString(row.ExpireTime)}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      monthlySubscript={row.MonthlySubscript}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <React.Fragment>
        <Dialog
          open={show}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              handleClose();
              Confirm_Create();
            },

          }}
        >
          <DialogTitle>Create</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter client Information.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="Name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={""}
              onChange={(e) => { setNewName(e.target.value) }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="Email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              defaultValue={""}
              onChange={(e) => { setnewEmail(e.target.value) }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="AccountNumber"
              label="Account Number"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={0}
              onChange={(e) => { setnewAccountNumber(e.target.value) }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="ExpireTime"
              label="Expire Time"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={getCurrentDate()}
              onChange={(e) => { setnewExpireTime(e.target.value) }}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">use monthly subscription</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={useMonthlyFee}
                onChange={handleChange}
                label="Monthly Subscription"
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>false</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <React.Fragment>
        <Dialog
          open={showDeleConfirm}
          onClose={handleCloseDeletConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete items really.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeletConfirm}>Disagree</Button>
            <Button onClick={handleCloseDeletConfirm} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      <React.Fragment>
        <Dialog
          open={showBulk}
          onClose={CloseBulk}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Enter Clients information"}
          </DialogTitle>

          <TextField
            label="Bulk Client Informations"
            multiline
            rows={10} // Adjust the number of rows as needed
            variant="outlined" // You can use other variants like "filled" or "standard"
            value={bulkClientText}
            onChange={(e) => setBulkClientText(e.target.value)}
            fullWidth // Optional: makes the TextField take the full width of its container
            style={{ minWidth: 500 }}
          />

          <DialogActions>
            <Button onClick={CloseBulk}>cancel</Button>
            <Button onClick={ConfirmBulk} autoFocus>
              confirm
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>


    </Container>
  );
}
