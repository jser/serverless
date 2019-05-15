'use strict';
const DEBUG = !!process.env.DEBUG;
const GitHubToken = require("./secret.json").GitHubToken;
const PostToRepo = require("./secret.json").repo;
const UserName = PostToRepo.split("/")[0];
const RepoName = PostToRepo.split("/")[1];
const GitHub = require("github-api");
const getTitle = require('get-title');
const hyperquest = require('hyperquest');
const isAbsoluteUrl = require('is-absolute-url');
const siteList = require("./list");
const getTitleAtUrl = (url) => {
    const stream = hyperquest(url);
    return getTitle(stream);
};
module.exports.create = (event, context, cb) => {
    if (!event.body) {
        console.log(JSON.stringify(event));
        return cb(new Error("No body"));
    }
    // body is string
    const body = JSON.parse(event.body);
    const url = body.url;
    const user = body.user;
    const description = body.description || "";
    if (!isAbsoluteUrl(url)) {
        return cb(new Error(`${url} is not URL`));
    }
    const denyList = siteList.filter(site => {
        return site.deny;
    });
    const isDenied = denyList.some(site => {
        return site.url.test(url);
    });
    // response is 200, just ignore
    if (isDenied) {
        const falsePositiveResponse = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify({
                message: "",
                html_url: ""
            })
        };
        cb(null, falsePositiveResponse);
        return;
    }
    const github = new GitHub({
        token: GitHubToken
    });
    getTitleAtUrl(url).then(title => {
        if (DEBUG) {
            console.log(`URL: ${url}`, `title: ${title}`);
        }
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
        if (DEBUG) {
            console.log(`IssueData`, issueData);
            console.log(`DEBUG mode not create issue`);
            return;
        }
        const issues = github.getIssues(UserName, RepoName);
        issues.createIssue(issueData).then(res => {
            const data = res.data;
            const issueURL = data["html_url"];
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*" // Required for CORS support to work
                },
                body: JSON.stringify({
                    message: `Created Issue!`,
                    html_url: issueURL
                })
            };
            cb(null, response);
        }).catch(error => {
            console.error(error);
            cb(new Error("Fail to create issue."));
        });
    }).catch(error => {
        return cb(error);
    });
};
