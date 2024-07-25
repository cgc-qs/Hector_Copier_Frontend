import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { GetDateString } from './utils';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ----------------------------------------------------------------------

export default function UserTableRow({
  clients,
  setclients,
  ID,
  selected,
  Name,
  avatarUrl,
  Email,
  ExpireTime,
  AccountNumber,
  handleClick,
  createdAt,
  updatedAt,
  monthlySubscript
}) {
  const [open, setOpen] = useState(null);
  const [show, setShow] = React.useState(false);
  const [newName, setNewName] = useState(Name);
  const [newEmail, setnewEmail] = useState(Email);
  const [newAccountNumber, setnewAccountNumber] = useState(AccountNumber);
  const [newExpireTime, setnewExpireTime] = useState(ExpireTime);
  const [newMonthlyFee, setnewMonthlFeee] = useState(monthlySubscript);
  const accessToken = window.localStorage.getItem('accessToken')


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const Edit = () => {
    handleCloseMenu();
    setShow(true);
  }

  const handleClose = () => {
    setShow(false);
  };

  const Delete = () => {
    handleCloseMenu();
    Confirm_Delete();
  }



  const baseURL = process.env.REACT_APP_ServerURL;

  const Modify_Clients_Info = (newInfo, isDelete) => {
    let newClients = [];
    for (let i = 0; i < clients.length; i++) {

      if (!isDelete) {
        newClients.push(clients[i]);
        if (newClients[i].id === ID) {
          newClients[i].Name = newInfo.Name;
          newClients[i].Email = newInfo.Email;
          newClients[i].AccountNumber = newInfo.AccountNumber;
          newClients[i].MonthlySubscript=newMonthlyFee;
          newClients[i].ExpireTime = GetDateString(newInfo.ExpireTime);
          newClients[i].createdAt = GetDateString(newInfo.createdAt);
          newClients[i].updatedAt = GetDateString(newInfo.updatedAt);
        }
      }
      else {
        if (clients[i].id !== ID)
          newClients.push(clients[i]);
      }

    }
    setclients(newClients);
  }

  const Confirm_Edit = async () => {

    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/UpdateClient`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: {
        id: ID,
        Name: newName,
        Email: newEmail,
        AccountNumber: newAccountNumber,
        ExpireTime: newExpireTime,
        MonthlySubscript:newMonthlyFee,
      }
    };

    await axios(config)
      .then((response) => {

        if (response.status === 200) {
          console.log(response.data);
          Modify_Clients_Info(response.data.result, false);
        }

      })
      .catch((error) => {
        console.log(error);

      });

  }

  const Confirm_Delete = async () => {

    let config = {
      method: 'post',
      url: `${baseURL}/RemoteCopier/DeleteClient`,
      headers: {
        'Content-Type': 'application/json',
        'access_token': accessToken
      },
      data: {
        id: ID,
      }
    };

    await axios(config)
      .then((response) => {

        if (response.status === 200) {
          console.log(response.data);
          Modify_Clients_Info(response.data.result, true);
        }

      })
      .catch((error) => {
        console.log(error);

      });

  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={Name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {Name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{Email}</TableCell>

        <TableCell>{AccountNumber}</TableCell>

        <TableCell >{ExpireTime}</TableCell>

        <TableCell >{createdAt}</TableCell>

        <TableCell >{updatedAt}</TableCell>

        <TableCell style={{ color: monthlySubscript ? "red" : "black" }}>
          {monthlySubscript ? "Used" : ""}
        </TableCell>

        {/* <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={Edit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={Delete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <React.Fragment>
        <Dialog
          open={show}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              handleClose();
              Confirm_Edit();
            },

          }}
        >
          <DialogTitle>Edit</DialogTitle>
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
              defaultValue={Name}
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
              defaultValue={Email}
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
              defaultValue={AccountNumber}
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
              defaultValue={ExpireTime}
              onChange={(e) => { setnewExpireTime(e.target.value) }}
            />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label">use monthly subscription</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={newMonthlyFee}
                onChange={(event)=>{setnewMonthlFeee(event.target.value);}}
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


    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  Email: PropTypes.any,
  handleClick: PropTypes.func,
  ExpireTime: PropTypes.any,
  Name: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
