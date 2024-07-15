# reply-pal

Route to video-call:

26-12-2023:

http://localhost/video-call


26-12-2023: Issue fixed
I had a problem with session storage, the cookie was not deleting on the browser size,
I had to add this function:

const Logout = async (req, res) => {
  req.session.user = null

  req.session.destroy();
  // Remmoves the cookie on the brower side
  res.clearCookie('connect.sid', { path: '/' });
  
  // Send a success response
  res.status(200).json({
    success: true,
    message: 'Logged out'
  });
};