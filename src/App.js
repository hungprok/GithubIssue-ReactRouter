import React from 'react';
import Home from './pages/Home';
import ShowIssuePage from './pages/ShowIssuePage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import ShowIssue from './components/ShowIssue';
import { useEffect, useState } from 'react';

export default function App() {
    let [showModal, setShowModal] = useState(false);
    let [commentExist, setCommentExist] = useState([]);
    let [issue, setIssue] = useState(null);
    const [token, setToken] = useState(null);
    let [createComment, setCreateComment] = useState("");
    let [reactionsThread, setReactionsThread] = useState([]);

    const toggleIssue = async (user, repos, ids) => {
        let issueSide = {};
        try {
            try {
                const url = `https://api.github.com/repos/${user}/${repos}/issues/${ids}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/vnd.github.squirrel-girl-preview+json"
                    }
                });
                const responseJson = await response.json();
                console.log(responseJson);
                if (response.ok) {
                    setIssue(responseJson);
                    issueSide = responseJson;
                }
            } catch (e) {
                console.log(e);
            }
            try {
                const urlRec = `https://api.github.com/repos/${user}/${repos}/issues/${ids}/reactions`;
                const responseRec = await fetch(urlRec, {
                    method: "GET",
                    headers: {
                        Accept: "application/vnd.github.squirrel-girl-preview+json"
                    }
                });
                const responseJsonRec = await responseRec.json();
                if (responseRec.ok && responseJsonRec) {
                    setReactionsThread(responseJsonRec);
                    console.log(reactionsThread)
                }
            } catch (e) {
                console.log(e);
            }

            if (issueSide.comments > 0) {
                try {
                    const urlComment = `https://api.github.com/repos/${user}/${repos}/issues/${ids}/comments`;
                    const responseComment = await fetch(urlComment, {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/vnd.github.squirrel-girl-preview+json"
                        }
                    });
                    const respCommentJS = await responseComment.json();
                    if (responseComment.ok) {
                        setCommentExist(respCommentJS);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            // setShowModal(true);
        } catch (e) {
            console.log(e);
        }
    };

    const postComment = async comment => {
        if (!comment) {
            alert("Don't leave the comment blank");
            return false;
        }
        try {
            let user = issue.repository_url.split("repos/")[1].split("/")[0];
            let repos = issue.repository_url.split("repos/")[1].split("/")[1];
            let ids = issue.number;
            const issues = { body: comment };
            const url = `https://api.github.com/repos/${user}/${repos}/issues/${ids}/comments`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `token ${token}`
                },
                body: JSON.stringify(issues)
            });
            if (response.ok) {
                alert("Your comment had been created successfully!");
                setCreateComment("");
                toggleIssue(user, repos, ids);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const editComment = async idEdit => {
        let user = issue.repository_url.split("repos/")[1].split("/")[0];
        let repos = issue.repository_url.split("repos/")[1].split("/")[1];
        let ids = issue.number;
        let value = prompt("Type what you want to change");
        if (!value) {
            alert("Don't leave the comment blank");
            return false;
        }
        try {
            const issue = { body: value };
            const url = `https://api.github.com/repos/${user}/${repos}/issues/comments/${idEdit}`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `token ${token}`
                },
                body: JSON.stringify(issue)
            });
            if (response.ok) {
                alert("Your comment had been changed successfully!");
                toggleIssue(user, repos, ids); //id
            } else if (response.status === 403) {
                alert("You dont have any authorize to edit this comment!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const deleteComment = async idDelete => {
        try {
            let user = issue.repository_url.split("repos/")[1].split("/")[0];
            let repos = issue.repository_url.split("repos/")[1].split("/")[1];
            let ids = issue.number;
            const url = `https://api.github.com/repos/${user}/${repos}/issues/comments/${idDelete}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/vnd.github.squirrel-girl-preview+json",
                    Authorization: `token ${token}`
                }
            });
            if (response.ok) {
                alert("Your comment had been deleted successfully!");
                toggleIssue(user, repos, ids); //id issue
            } else if (response.status === 403) {
                alert("You dont have any authorize to delete this comment!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Router>
            <Switch>
                <Route path='/' exact render={(props) => <Home toggleIssue2={toggleIssue} {...props} />} />
                <Route path='/:id' render={(props) => <ShowIssuePage
                    issueSelected={issue}
                    CommentsList={commentExist}
                    setCreateComment={setCreateComment}
                    createComment={createComment}
                    postComment={postComment}
                    reactionsThread={reactionsThread}
                    editComment={editComment}
                    deleteComment={deleteComment}
                    token={token}
                    toggleIssue2={toggleIssue} {...props} />} />
            </Switch>
        </Router>
    )
}
