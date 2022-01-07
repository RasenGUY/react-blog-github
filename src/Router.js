import React from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route 
} from "react-router-dom";

import Blog from "./Containers/Blog"
import BlogPost from "./Containers/BlogPost";


const Router = ({children}) => {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/blog/:title/:issueNumber" element={<BlogPost />}/>
        <Route path="/*" element={<h1>Page does not Exists</h1>}/>
      </Routes>
      {children}
    </BrowserRouter>
  );
};

export default Router;
