import React, { useState, useEffect } from "react";
import readingTime from "reading-time";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CardContainer,
  CardHeader,
  CardCategory,
  CardReadingTime,
  CardTitle,
  CardDescription,
} from './'

export const Card = ({ blog }) => {
  const [labels, setLabels] = useState([]);
  const location = useLocation();
  let navigate = useNavigate(); 

  console.log(location);
  const openBlog = (title, number) => {
    navigate(`blog/${title}/${number}`);
  }

  useEffect(() => {
    const labels = blog.labels.nodes.filter((value) => {
      return value.name !== "blog";
    });

    setLabels(labels);
  }, [blog.labels.nodes]);

  return (
    <CardContainer>
      <CardHeader>
        <>
        {labels.map((value, i) => {
          return (
            <CardCategory value={value} key={i} />
          );
        })}
        </>
        <CardReadingTime time={readingTime(blog.body).minutes} />
      </CardHeader>
      <div onClick={() => openBlog(blog.title, blog.number)}>
        <CardTitle>{blog.title}</CardTitle>
        <CardDescription>
          {blog.bodyText}
        </CardDescription>
      </div>
    </CardContainer>
  );
}
