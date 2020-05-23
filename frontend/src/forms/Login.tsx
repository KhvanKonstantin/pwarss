// Created by Konstantin Khvan on 7/11/18 2:04 PM

import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {ErrorSpan} from "./util";
import {User} from "../model/User";
import styled from "styled-components";

const Form = styled.form`
    font-size: 1.5em;

    display: flex;
    flex-direction: column;
    width: 320px;
    min-height: 128px;
    margin: auto;
`;

const Header = styled.img`
    margin: 5px;
    text-align: center;
    
    width: 320px;
`;

const Input = styled.input`
    font-size: 1.5em;
    
    margin: 5px;
`;

const Button = styled.button`
    font-size: 1.5em;
 
    margin: 5px;
`;

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


export const Login: React.FC<{ doLogin: (login: string, password: string) => Promise<User> }> = (props) => {
    const [formData, setFormData] = useState<Data>({login: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [loginInputRef] = useState(() => React.createRef<HTMLInputElement>());

    useEffect(() => {
        const current = loginInputRef.current;
        if (current) {
            current.focus();
        }
    }, [loginInputRef]);


    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData({...formData, [name]: value});
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (loading) {
            return
        }

        const errors = validate(formData);
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true);
            try {
                const {login, password} = formData;
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

    return (
        <Form onSubmit={onSubmit}>
            <Header src="/static/images/logo.png"/>
            <Input name="login" placeholder="login" disabled={loading}
                   value={formData.login} onChange={onChange} ref={loginInputRef}/>
            <Input type="password" name="password" placeholder="password" disabled={loading}
                   value={formData.password} onChange={onChange}/>
            <Button disabled={loading}>Login</Button>
            <ErrorSpan text={errors.response}/>
        </Form>
    );
}

