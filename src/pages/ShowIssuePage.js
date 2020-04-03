import React from 'react';
import ShowIssue from '../components/ShowIssue'

export default function ShowIssuePage (props) {
    console.log(props);
    return (
            <ShowIssue 
            issueSelected={props.issueSelected}
            CommentsList={props.CommentsList}
            setCreateComment={props.setCreateComment}
            createComment={props.createComment}
            postComment={props.postComment}
            reactionsThread={props.reactionsThread}
            editComment={props.editComment}
            deleteComment={props.deleteComment}
            token={props.token}
            toggleIssue2={props.toggleIssue2}
            />
    )
}
