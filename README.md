<h1>DevBoard</h1>
<h3>Lightweight imageboard software</h3>

An ongoing development imageboard inspired by the popular website 4chan.
This is not intended as a direct competitor to other imageboard solutions,
as a lot of moderation features have yet to be implemented. This project
does however try to incorporate as much features as possible that affect
the end user directly. Which is something most other projects have, in my eyes,
failed to achieve.

[Working demo](http://mees.space)

<h4>features:</h4>
- jpeg, bmp, png, webp, svg, gif, mp4, ogg and WebM (w/ sound) support
- catalog
- homepage
- rotating banner
- greentexting
- post linking
- inline image expansion
- post counter
- quick reply
- spoiler images

<h4>planned features:</h4>
- board linking
- code tags
- spoiler tags
- moderator interface
- user post deletion

<h4>installation:</h4>
- make sure you have MySQL and node.js installed
- make a folder called "uploads" in the public directory
- change the database login credentials in the settings.js file
- make sure the right port is used, also in the settings.js file

 ```
# npm install
# npm start
```
