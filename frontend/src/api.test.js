// Created by Konstantin Khvan on 7/11/18 2:44 PM

import api from './api'

it("fails login", () => {
    api.user.logout().catch(e => {
        console.log(e)
    });
});