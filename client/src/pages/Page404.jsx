import React from "react";

const Page404 = () => {
    return (
        <div className="page-404">
      <h1 className="title">404</h1>
      <h2 className="subtitle">Oops! The page you're looking for can't be found.</h2><a href="/Login">Go To Home</a>
      <p className="description">
        It seems that the page you're trying to access doesn't exist or has been moved.
        Please check the URL or go back to the homepage.
      </p>
      <img src="https://i.pinimg.com/originals/cf/37/f3/cf37f3f0cf9dd8b13443fa86ea136c45.gif" alt="404 page" srcset=""></img>
      
    </div>
      );
};


export default Page404;