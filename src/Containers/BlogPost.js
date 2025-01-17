import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOMServer from 'react-dom/server'
import moment from "moment";
import Markdown, { compiler } from "markdown-to-jsx";
import readingTime from "reading-time";
import { GithubSelector, GithubCounter } from "react-reactions";
import { userClient } from '../Utils/apollo'
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { config } from "../config";
import { getEmojiByName, getNameByEmoji } from '../Utils/emoji';
import { getAuthenticatedUser } from '../Utils/auth'
import { Loader } from "../Components/Common";
import { PostContainer, PostTitle, PostDate, PostDateLink, PostReaction, BackButton } from "../Components/Post";
import { AuthorDetails, AuthorAvatar, AuthorName } from "../Components/Post/Author";
import { GithubLogin } from '../Components/Header'
import { HyperLink, CodeBlock } from '../Components/Markdown/Overrides';
import CommentsSection from "./CommentsSection";

export default function BlogHome() {
  const issueNumber = parseInt(window.location.href.split("/").pop());
  const GET_POSTS = gql`{
    repository(owner: "${config.githubUserName}", name: "${config.githubRepo}") {
      issue(number: ${issueNumber}) {
        title
        body
        bodyHTML
        url
        bodyText
        number
        bodyHTML
        author {
          url
          avatarUrl
          login
        }
        reactions(first:100){
          nodes{
            content
            user{
              id
              login
            }
          }
        }
        updatedAt
        id
        comments(first:100, orderBy: {direction: DESC, field: UPDATED_AT }) {
          nodes {
            author {
              ... on User {
                avatarUrl
                name
                login
              }
            }
            body
            bodyHTML
            bodyText
            publishedAt
            updatedAt
          }
        }
      }
    }
  }
  `;
  const GET_RECENT_COMMENT = gql`query {
    repository(owner: "${config.githubUserName}", name: "${config.githubRepo}") {
      issue(number: ${issueNumber}) {
        comments(last:1) {
          nodes {
            author {
              ... on User {
                avatarUrl
                name
                login
              }
            }
            body
            bodyHTML
            bodyText
            publishedAt
            updatedAt
          }
        }
      }
    }
  }
  `;
  
  const [post, setPost] = useState([]);
  const [postNodeId, setPostNodeId] = useState('');
  const [reactionPopup, setReactionPopup] = useState(false);
  const [postReactions, setPostReactions] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const { loading, error, data } = useQuery(GET_POSTS);
  const reactionsContainer = useRef(null);
  const userToken = localStorage.getItem('githubToken');

  const setReactionFun = useCallback((reactions) => {
    // {
    //   emoji: "👍", // String emoji reaction
    //   by: "case" // String of persons name
    // }

    let reactions_array = [];
    reactions.forEach(element => {
      let obj = {
        by: element.user.login,
        emoji: getEmojiByName(element.content)
      };
      reactions_array.push(obj);
    });

    setPostReactions(reactions_array);
  }, []);
  const toggleReaction = async (emoji) => {
    let reactions = postReactions;
    const user = await getAuthenticatedUser();
    const existingReaction = reactions.filter(r => (r.emoji === emoji && r.by === user.login))

    if (existingReaction.length === 0) {
      const reactionToAdd = {
        by: user.login,
        emoji: emoji,
      }

      // Add the reaction
      await userClient(userToken).mutate({
        mutation: gql`
          mutation AddReaction {
            addReaction(input:{subjectId:"${postNodeId}",content:${getNameByEmoji(emoji)}, clientMutationId:"${user.node_id}"}) {
              reaction {
                id
              }
            }
          }
        `
      });
      reactions.push(reactionToAdd);

    } else {
      // Remove the reaction
      await userClient(userToken).mutate({
        mutation: gql`
          mutation RemoveReaction {
            removeReaction(input:{subjectId:"${postNodeId}",content:${getNameByEmoji(emoji)},clientMutationId:"${user.node_id}"}) {
              reaction {
                id
              }
            }
          }
        `
      });
      // Remove the reaction from the state
      reactions = reactions.filter(r => !(r.by === user.login && r.emoji === emoji))
    }

    setPostReactions(reactions);
    reactionsContainer.current.forceUpdate(); // refresh the counter
    setReactionPopup(false); // hiding the reactions choice
  }
  
  // Adds a new comment 
  const handleSubmitComment = async (e, value, stateUpdateFunc) => {
    e.preventDefault();
    const user = await getAuthenticatedUser();  
    await userClient(userToken).mutate({
      mutation: gql`
          mutation AddComment {
            addComment (input:{body:"${ReactDOMServer.renderToString(compiler(value, {wrapper: null})).replaceAll('"', "'")}", subjectId: "${postNodeId}" ,clientMutationId:"${user.node_id}"}) {
              subject { 
                id 
              }
            }
          }
        `
      }
    )
    // retrieve the last comment
    let d = await userClient(userToken).query({
      query: GET_RECENT_COMMENT
      }
    )
    let comment = d.data.repository.issue.comments.nodes[0];
    
    // update on the front-end
    setPostComments([comment, ...postComments,]);
    
    // updates the state of the editory after 0.5 seconds
    stateUpdateFunc("");

  }

  
  useEffect(() => {
    if (!loading) {
      if (data) {
        const issues = data.repository.issue;
        setPostNodeId(issues.id);
        setPost(issues);
        setReactionFun(issues.reactions.nodes);
        setPostComments(issues.comments.nodes);
      }
    }
  }, [loading, error, data, setReactionFun]);

  if (loading) {
    return <Loader />;
  }

  const onBackClick = () => {
    window.history.back();
  };


  return (
    <>
      {post.title && (
        <PostContainer>
          <BackButton onClick={() => onBackClick()}>Back</BackButton>

          <PostTitle>{post.title}</PostTitle>
          <div>
            <AuthorDetails>
              <AuthorAvatar src={post.author.avatarUrl} alt={post.author.login} />
              <div>
                <AuthorName>{post.author.login}</AuthorName>
                <PostDate>
                  {moment(post.updatedAt).format("DD MMM YYYY")} .{readingTime(post.body).minutes} Min Read .
                  <PostDateLink href={post.url} target="_black">
                    View On Github
                  </PostDateLink>
                </PostDate>
              </div>
            </AuthorDetails>
          </div>
          <Markdown
            options={{
              overrides: {
                a: {
                  component: HyperLink
                },
                pre: {
                  component: CodeBlock
                }
              }
            }}
          >
            {post.body}
          </Markdown>
          {reactionPopup && (
            <PostReaction>
              {userToken
                ? <GithubSelector onSelect={emoji => toggleReaction(emoji)} />
                : <GithubLogin isAbsolute={false} />
              }
            </PostReaction>
          )}
          <GithubCounter
            ref={reactionsContainer}
            counters={postReactions}
            onSelect={emoji => toggleReaction(emoji)}
            onAdd={() => setReactionPopup(!reactionPopup)}
          />
          <CommentsSection postUrl={post.url} comments={postComments} updateComments={handleSubmitComment} />
        </PostContainer>
      )}
    </>
  );
}
