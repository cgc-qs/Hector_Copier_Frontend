import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Button,
    Stack,
    Checkbox
} from '@mui/material';
import { Link } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

import axios from 'axios';


const AuthLogin = ({ title, subtitle, subtext }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [passWord, setPassWord] = useState("");
  
    const baseURL = process.env.REACT_APP_ServerURL;

    const Login = async  (event) => {
        event.preventDefault();

        var _data = {
            username:userName,
            password:passWord
        };
        var config = {
            method:'post',
            url:`${baseURL}/RemoteCopier/login`,
            // headers: {
            //     'Content-Type': 'application/json',
            //     'access_token': 'Bearer ' + accessToken
            // },
            data: _data
        };       

        await  axios(config)
        .then((res) => {            
            let accessToken=res.data.access_token
            localStorage.setItem('accessToken', accessToken)
            setIsLoggedIn(true);            
        })
        .catch((error) => {
            console.log(error);
            console.log(error.response.data.message);
            localStorage.removeItem('accessToken')
        });

    }

    const ChangeName = (event) => {
        setUserName(event.target.value);        
    }
    const ChangePass = (event) => {
        setPassWord(event.target.value);       
    }

    if (isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Username</Typography>
                    <CustomTextField id="username" variant="outlined" fullWidth onChange={ChangeName} />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Password</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth onChange={ChangePass} />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox defaultChecked />}
                            label="Remeber this Device"
                        />
                    </FormGroup>
                    <Typography
                        component={Link}
                        to="/"
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        Forgot Password ?
                    </Typography>
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    // to="/dashboard"
                    type="submit"
                    onClick={(e) => Login(e)}

                >
                    Sign In
                </Button>
            </Box>
            {subtitle}
        </div>)
};

export default AuthLogin;
