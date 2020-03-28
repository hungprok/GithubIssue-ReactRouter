import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactModal from "react-modal";
import { Image, Form, Button } from "react-bootstrap";
import Moment from "react-moment";

const ReactDOM = require("react-dom");
const ReactMarkdown = require("react-markdown");
let html;

export default function ShowIssue(props) {
  // let [reactionsComments, setReactionsComments] = useState([]);
  const emoji = {
    ["+1"]:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png",
    ["-1"]:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png",
    laugh:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f604.png",
    confused:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f615.png",
    heart:
      "https://github.githubassets.com/images/icons/emoji/unicode/2764.png",
    hooray:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f389.png",
    rocket:
      "https://github.githubassets.com/images/icons/emoji/unicode/1f680.png",
    eyes: "https://github.githubassets.com/images/icons/emoji/unicode/1f440.png"
  };
  let infoIssue = props.issueSelected;
  let emojiThread = props.reactionsThread.map(item => item.content);
  let totalEmojiThread = emojiThread.reduce((total, content) => {
    if (content in total) {
      total[content]++;
    } else {
      total[content] = 1;
    }
    return total;
  }, {});
  let emojiArray = Object.keys(totalEmojiThread);
  let htmlforEmoji = emojiArray.map(item => {
    return (
      <span className="emoji-showing">
       {item && <Image className='icon-reactions' src={emoji[item]}/>} {item && totalEmojiThread[item]}</span>
    );
  });

/////////////////////////////////////
const emojiComment = async(idComment) => {
  // try {
    console.log(idComment)
    const urlComRec = `https://api.github.com/repos/${props.user}/${props.repos}/issues/comments/${idComment}/reactions`; //fix here fix here.......
    const responseComRec = await fetch(urlComRec, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.squirrel-girl-preview+json"
      }
    });
    const responseComRecJS = await responseComRec.json();
    if (responseComRec.ok) {
      let emojiComment = responseComRecJS.map(item => item.content);
      let totalEmojiComment = emojiComment.reduce((total, content) => {
        if (content in total) {
          total[content]++;
        } else {
          total[content] = 1;
        }
        return total;
      }, {});
      let emojiComArray = Object.keys(totalEmojiComment);
      let htmlforEmojiCom = emojiComArray.map(item => {
        return (
          <span className="emoji-showing">
           {item && <Image className='icon-reactions' src={emoji[item]}/>} {item && totalEmojiComment[item]}</span>
        );
      });
      // console.log('html',emojiComArray)
      // console.log('html2', htmlforEmojiCom)
      return htmlforEmojiCom
    }

  // } catch (e) {
  //   console.log(e);
  // } 
}




  if (infoIssue === null) {
    return;
  } else {
    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={props.toggleModal}
        onRequestClose={() => props.setShowModal(false)}
      >
        <h2 className="title-issue my-2">
          {infoIssue.title}{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "normal",
              fontSize: "20px"
            }}
          >
            {" "}
            #{infoIssue.number}
          </span>{" "}
          {infoIssue.labels &&
            infoIssue.labels.map(item => {
              return (
                <button
                  className="labels-btn mx-1"
                  style={{
                    borderRadius: "5px",
                    padding: "5px 5px 5px 5px",
                    backgroundColor: `#${item.color}`,
                    fontSize: "10px",
                    fontWeight: "normal"
                  }}
                >
                  {item.name}
                </button>
              );
            })}
        </h2>
        <div className="py-2">
          {" "}
          {infoIssue.state === "open" ? (
            <span
              className="bg-success"
              style={{
                borderRadius: "5px",
                padding: "5px 5px 5px 5px",
                color: "white"
              }}
            >
              ◌ Open
            </span>
          ) : (
            <span
              className="bg-danger"
              style={{
                borderRadius: "5px",
                padding: "5px 5px 5px 5px",
                color: "white"
              }}
            >
              √ Closed
            </span>
          )}
          <span className="title-userissue">{infoIssue.user.login}</span>
          <span>
            {" "}
            opened this issued <Moment fromNow>
              {infoIssue.created_at}
            </Moment> - {infoIssue.comments} Comments
          </span>
        </div>
        <div
          style={{
            borderBottom: "1px solid gray",
            paddingBottom: "10px",
            paddingTop: "10px"
          }}
        >
          <Image
            src={infoIssue.user.avatar_url}
            alt={infoIssue.user.login}
            className="avatar"
          />
          <span className="title-userissue">{infoIssue.user.login}</span>{" "}
          commented <Moment fromNow>{infoIssue.created_at}</Moment>
        </div>
        <div>
          <ReactMarkdown
            includeNodeIndex={true}
            escapeHtml={true}
            source={infoIssue && infoIssue.body}
          />
          <span style={{ fontSize: "12px", fontStyle: "italic" }}>
            Updated <Moment fromNow>{infoIssue.updated_at}</Moment>
          </span>
          <div>{htmlforEmoji}</div>
        </div>
        <div>
          {props.CommentsList &&
            props.CommentsList.map(item => {

              // if (`${emojiComment(item.id)}`) {
                html = emojiComment(item.id)
                
              // }
              return (
                <div className="comment-place">
                  <div
                    className="comment-headers"
                    style={{
                      borderBottom: "1px solid gray",
                      paddingBottom: "10px",
                      paddingTop: "10px"
                    }}
                  >
                    <div>
                      <Image
                        src={item.user.avatar_url}
                        alt={item.user.login}
                        className="avatar"
                      />
                      {"  "}
                      <span className="title-userissue">{item.user.login}</span>
                      <span>
                        {" "}
                        commented <Moment fromNow>{item.created_at}</Moment>
                      </span>
                    </div>
                    <div className="d-flex flex-row">
                      <div className="dropdown mr-1">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenu2"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Reactions
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenu2"
                        >
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png"
                              alt="+1"
                            />{" "}
                            Like
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png"
                              alt="-1"
                            />{" "}
                            Dislike
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f604.png"
                              alt="laugh"
                            />{" "}
                            Laugh
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f615.png"
                              alt="confused"
                            />{" "}
                            Confused
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/2764.png"
                              alt="heart"
                            />{" "}
                            Love
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f389.png"
                              alt="hooray"
                            />{" "}
                            Hooray
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png"
                              alt="rocket"
                            />{" "}
                            Rocket
                          </button>
                          <button className="dropdown-item" type="button">
                            <Image
                              className="icon-reactions"
                              src="https://github.githubassets.com/images/icons/emoji/unicode/1f440.png"
                              alt="eyes"
                            />{" "}
                            Eyes
                          </button>
                        </div>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenu2"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        ></button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenu2"
                        >
                          <button
                            onClick={() => props.editComment(item.id)}
                            className="dropdown-item"
                            type="button"
                          >
                            Edit Comments
                          </button>
                          <button
                            onClick={() => props.deleteComment(item.id)}
                            className="dropdown-item"
                            type="button"
                          >
                            Delete Comments
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ReactMarkdown escapeHtml={true} source={item.body} />
                    <span style={{ fontSize: "12px", fontStyle: "italic" }}>
                      Updated <Moment fromNow>{item.updated_at}</Moment>
                    </span>
                    <span>
                    {console.log(html)}
                    {html}
                    </span>///////////////Not showing
                  </div>
                </div>
              );
            })}
        </div>
        <div>
          <Form
            className="comment-place"
            onSubmit={el => {
              el.preventDefault();
              props.postComment(props.createComment);
            }}
          >
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Leave Comment</Form.Label>
              <Form.Control
                placeholder="Your comment"
                value={props.createComment}
                onChange={el => props.setCreateComment(el.target.value)}
                as="textarea"
                rows="3"
              />
              <div className="d-flex justify-content-end align-self-end">
                <Button
                  className="my-2 btn-secondary"
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form.Group>
          </Form>
        </div>
      </ReactModal>
    );
  }
}
