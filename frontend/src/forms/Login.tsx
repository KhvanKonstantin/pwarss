// Created by Konstantin Khvan on 7/11/18 2:04 PM

import * as React from 'react';
import {ChangeEvent, FormEvent} from 'react';
import {ErrorSpan} from "./util";
import {User} from "../model/User";

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
            <form className="login-form" onSubmit={this.onSubmit}>
                <input name="login" placeholder="login" disabled={loading}
                       value={data.login} onChange={this.onChange}/>
                <input type="password" name="password" placeholder="password" disabled={loading}
                       value={data.password} onChange={this.onChange}/>
                <button disabled={loading}>Login</button>
                <ErrorSpan text={errors.response}/>
            </form>
        );
    }
}

