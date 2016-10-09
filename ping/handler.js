'use strict';
const GitHubToken = require("./secret.json").GitHubToken;
const PostToRepo = require("./secret.json").repo;
const UserName = PostToRepo.split("/")[0];
const RepoName = PostToRepo.split("/")[1];
const GitHub = require("github-api");
const getTitleAtUrl = require('get-title-at-url');
const isAbsoluteUrl = require('is-absolute-url');
module.exports.create = (event, context, cb) => {
    const body = event.body;
    if(!body) {
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
    getTitleAtUrl(url, (title, error) => {
        if (error) {
            return cb(error);
        }
        const reportUserName = user ? user.replace(/@?([\w-]+)/, "https://github.com/$1") : "Anonymous";
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
    });
};
