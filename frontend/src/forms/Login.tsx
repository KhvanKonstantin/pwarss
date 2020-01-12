// Created by Konstantin Khvan on 7/11/18 2:04 PM

import * as React from 'react';
import {ChangeEvent, FormEvent} from 'react';
import {ErrorSpan} from "./util";
import {User} from "../model/User";
import styled from "styled-components";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 320px;
    min-height: 128px;
    margin: auto;
`;

const Header = styled.h2`
    margin: 5px;
    text-align: center;
`;

const Input = styled.input`
    margin: 5px;
`;

const Button = styled.button`
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

interface State {
    data: Data
    errors: Errors
    loading: boolean
}

export default class Login extends React.Component<{ doLogin: (login: string, password: string) => Promise<User> }, State> {
    state: State = {
        data: {
            login: "",
            password: ""
        },
        loading: false,
        errors: {}
    };

    loginInputRef = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        const current = this.loginInputRef.current;
        if (current) {
            current.focus();
        }
    }


    onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        this.setState({
            data: {...this.state.data, [name]: value}
        });
    };

    onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (this.state.loading) {
            return
        }

        const errors = this.validate(this.state.data);
        this.setState({errors});
        if (Object.keys(errors).length === 0) {
            this.setState({loading: true});
            try {
                const {login, password} = this.state.data;
                await this.props.doLogin(login, password);
            } catch (err) {
                this.setState({loading: false});
                if (err.response && err.response.status == 403) {
                    this.setState({errors: {response: "Incorrect login and/or password"}});
                    return
                }
                this.setState({errors: {response: err.message}});
            }
        }
    };

    validate(data: Data) {
        const errors: Errors = {};
        if (!data.login) {
            errors.login = "Invalid login";
        }
        if (!data.password) {
            errors.password = "Invalid password";
        }
        return errors;
    };

    render() {
        const {data, errors, loading} = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Header>PWARSS</Header>
                <Input name="login" placeholder="login" disabled={loading}
                       value={data.login} onChange={this.onChange} ref={this.loginInputRef}/>
                <Input type="password" name="password" placeholder="password" disabled={loading}
                       value={data.password} onChange={this.onChange}/>
                <Button disabled={loading}>Login</Button>
                <ErrorSpan text={errors.response}/>
            </Form>
        );
    }
}

