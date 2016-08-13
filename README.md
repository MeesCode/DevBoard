<h1>DevBoard</h1>
<h3>Lightweight imageboard software</h3>

An ongoing development imageboard inspired by the populair website 4chan.
This is not intended as a direct competitor to other imageboard softwares,
as a lot of moderation features have yet to be implemented. This project
does however tries to incorporate as much features as possible that affect
the end user directly. Which is something most other projects have, in my eyes,
failed to achieve.

<h4>features:</h4>
- jpeg, bmp, png, webp, svg, gif, mp4, ogg and WebM (w/ sound) support
- catalog
- homepage
- rotating banner
- greentexting
- post linking
- inline image expansion
- post counter

<h4>planned features:</h4>
- board linking
- code tags
- spoiler tags
- spoiler images
- moderator interface
- user post deletion

<h4>installation:</h4>
- make sure you have MySQL and node.js installed
- make a folder called "uploads" in the public directory
- make a folder called "tmp" in the root directory
- change the database login credentials in the server.js file
- make sure the right port is used, also in the server.js file
 ```
# npm install
# npm start
```

<h4>known bugs:</h4>
greentexting and post linking work, but not as smooth as i'd like them to.
