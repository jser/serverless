'use strict';
const GitHubToken = require("./secret.json").GitHubToken;
const PostToRepo = require("./secret.json").repo;
const UserName = PostToRepo.split("/")[0];
const RepoName = PostToRepo.split("/")[1];
const GitHub = require("github-api");
const getTitle = require('get-title');
const hyperquest = require('hyperquest');
const isAbsoluteUrl = require('is-absolute-url');
const getTitleAtUrl = (url) => {
    const stream = hyperquest(url);
    return getTitle(stream);
};
module.exports.create = (event, context, cb) => {
    const body = event.body;
    if (!body) {
        return cb(new Error("No body"));
    }
    const url = body.url;
    const user = body.user;
    const description = body.description || "";
    if (!isAbsoluteUrl(url)) {
        return cb(new Error(`${url} is not URL`));
    }
    const github = new GitHub({
        token: GitHubToken
    });
    getTitleAtUrl(url).then(title => {
        const reportUserName = user
            ? user.replace("https://github.com/", "").replace(/@?([\w-]+)/, "https://github.com/$1")
            : "Anonymous";
        const issueData = {
            title: title,
            body: `---
title: ${title}
url: ${url}
user: ${reportUserName}

---

${description}
`,
            labels: ["request"]
        };
        const issues = github.getIssues(UserName, RepoName);
        issues.createIssue(issueData).then(response => {
            const data = response.data;
            const issueURL = data["html_url"];
            cb(null, {
                message: `Created Issue!`,
                html_url: issueURL
            });
        }).catch(error => {
            console.error(error);
            cb(new Error("Fail to create issue."));
        });
    }).catch(error => {
        return cb(error);
    });
};
