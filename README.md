# depth-perception
Remake of my old web page that allows users to submit multiple images to a canvas that simulates a 3D effect.

## About
This is an old project of mine that I did back when I didn't know much about web programming. I winged it.
I like this project so I decided to remake it.

## What was terrible about the original website?
 - Users had to send an email to submit images
 - Images had to be added by me, manually
 - Data was saved in a text file
 - Almost no backend logic to speak of
 - PHP mixed in with HTML (oh boy)

 ## TO-DO
 - make a user submission interface
 - allow image aligning (at submission). User can select a layer and drag an image around. Offset is saved to DB. When the Adjust button is toggled, the input fields turn into toggle buttons names 'Layer #'. Cursor over canvas shows that the image is draggable.
 - consider a smart footer that sticks to the bottom. maybe make the navigation buttons smaller and add a hr line
 - add 'more info' button to submission page that reveals a div with some info in it.
 - remember previous users - not showing them the 'your mouse goes here' instruction