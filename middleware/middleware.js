const express = require("express");

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}

function isNotLoggedIn (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/index");
}

module.exports = {
    isLoggedIn,
    isNotLoggedIn
}