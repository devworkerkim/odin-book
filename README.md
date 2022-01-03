# Odin-Book | The Odin Project

This is the repo for the Odin-Book project in the NodeJS course of The Odin Project.  The objective of the project is to recreate the Facebook website.  The website needs to have the basic functionality of Facebook such as user accounts, posting, and friending users.  A basic news feed needs to be included as well as options to comment and like posts.

## What I Learned

For all the criticism that it gets, Facebook sure gets a bad wrap for the things that it does.  But the basis of their app was challenging enough to replicate that I can give some respect to Facebook for how it works.  I wasn't too concerned about the functionallity of each piece but rather how each of the pieces of functionality were woven together to create the overall experience.

I'm not sure how Facebook implements their friend requests, but I felt like I did a satisfactory job with it.  Because I was trying to connect two users together to create a connection, I kept on trying to figure out how to get the two users to work together through the process.  And not only that, I had to consider how I was to handle if other users started to pop up.  I created two arrays to manage the states of the user connections before users became friends.  This was my way of separating invites that were sent and received by different users, and I had to check that the other user was experiencing the correct part of the process.

I made a separate post collection in the database to separate the user collection.  I feel this provides better access to the posts that work in tandem with the user collection.  While it would make sense to nest the posts within the author of the user, it wouldn't facilitate being able to see friends' posts very well since the query for those posts would have to did a bit deeper.

I used the same approach with the friend requests as I did for the likes and comments.  Again, this involved making sure that whichever user was logged in and seeing the post was seeing the correct information.  After a while, the system starts to work itself into place and the paradigm is a lot easier to program.

We sure take Facebook's functionality for granted given where it sits in today's society.  This was a capstone project for the NodeJS course of The Odin project, and it didn't disappoint.  The requirements on the back end took a bit to put together as functionality began to build up, but I'm ready to show this one off once the front-end gets a little paint job.