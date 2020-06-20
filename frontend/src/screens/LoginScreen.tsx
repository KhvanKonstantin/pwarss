// Created by Konstantin Khvan on 7/11/18 2:04 PM

import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {User} from "../model/User";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import {Box, Grid, makeStyles} from "@material-ui/core";
import {FullScreenProgressWithDelay} from "../forms/util";

const useStyles = makeStyles(theme => ({
    header: {
        width: '278px'
    },
    grid: {
        marginTop: theme.spacing(3),
    },
    form: {
        marginTop: theme.spacing(1),
    }
}));

interface Data {
    login: string
    password: string
}

interface Errors {
    login?: string
    password?: string
    response?: string
}

function validate(data: Data) {
    const errors: Errors = {};
    if (!data.login) {
        errors.login = "Invalid login";
    }
    if (!data.password) {
        errors.password = "Invalid password";
    }
    return errors;
}


export const LoginScreen: React.FC<{ doLogin: (login: string, password: string) => Promise<User> }> = (props) => {
    const [data, setData] = useState<Data>({login: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [loginInputRef] = useState(() => React.createRef<HTMLInputElement>());

    const classes = useStyles();

    useEffect(() => {
        const current = loginInputRef.current;
        if (current) {
            current.focus();
        }
    }, [loginInputRef]);


    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setData({...data, [name]: value});
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (loading) {
            return
        }

        const errors = validate(data);
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                const {login, password} = data;
                await props.doLogin(login, password);
            } catch (err) {
                setLoading(false);

                if (err.response && err.response.status === 403) {
                    setErrors({response: "Incorrect login and/or password"});

                    return
                }
                setErrors({response: err.message});
            }
        }
    };

    const error = !!errors.response;
    const errorText = error ? errors.response : " ";

    return (
        <Container maxWidth="xs">
            <Grid container className={classes.grid} spacing={0} direction="column" justify="center"
                  alignItems="center">
                <Box>
                    <img className={classes.header} alt="PWARSS" src="/static/images/logo.png"/>
                </Box>
                <form className={classes.form} noValidate onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Login"
                        name="login"
                        autoComplete="username"
                        autoFocus
                        disabled={loading}
                        value={data.login}
                        onChange={onChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        disabled={loading}
                        value={data.password}
                        onChange={onChange}
                        error={error}
                        helperText={errorText}
                    />
                    <Button
                        variant="text"
                        type="submit"
                        fullWidth
                        color="primary"
                        disabled={loading}>
                        Sign In
                    </Button>
                </form>
            </Grid>
            <FullScreenProgressWithDelay loading={loading}/>
        </Container>
    );
}

