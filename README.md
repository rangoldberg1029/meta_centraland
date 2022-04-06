﻿# meta_centraland
Meta_Centraland consists of 200 by 200 plots, visible at a glance. Some of the plots are roads, and two parks are on the order of 10% to 20% of the area. The parks and roads are not for sale regularly and can not be changed. The other plots are NFT- *** Non Fungible Token. Some are offered for sale (characterized by a tag for sale / not for sale) initial in dollars. Initial selling price will range in a random order between $ 15-200. Entering the world is in two main functions:   a. As sellers or real estate buyers. b. As guests interested in playing the game in a certain part.  Technologies: •Client side: - React_Hook, CSS • Server side: Node.js, Express • Database: MongoDB + Moongose

Home screen: Let there be 2 buttons for the user to choose whether to enter the game as a guest or as a seller.
![image](https://user-images.githubusercontent.com/92925015/162024347-61023a06-b559-43ed-a167-83c2a3805cf5.png)

Login && Signup: 
The login screen The user enters a username and password and a login button after clicking on it, a check is made as to whether the user is in the system, if he goes to the game page, otherwise he will receive an appropriate message.
The game registration screen as the user seller enters a username and password and will be saved in the system with an initial $ 1000,
If the username exists in the system, the user will receive an appropriate message (each user has a unique username).
![image](https://user-images.githubusercontent.com/92925015/162024607-65e7612b-b1d6-4897-b052-c8e77803ab22.png)
![image](https://user-images.githubusercontent.com/92925015/162024624-e80fee02-d4f4-4ec9-a0b0-54ba4966ce1d.png)
Main:
The main screen where all parks and roads plots are initialized in this file and all other NFT plots are initialized on the server side by post request and only these plots are stored in the database. In addition, there is the game board with the slides and a bar at the top of the page that shows which user is playing with a clear legend for each type of field and the option to click on exit from the game and return to the home page.
Each square that is of the NFT type after clicking will display the details of the same selected section with additional options.
![image](https://user-images.githubusercontent.com/92925015/162025009-f86ab2ef-f0f2-4055-8460-1ab666c1e52b.png)

Plot:
This screen displays the details of the selected block on the Main page with the option to buy as a plot, play a game (if any) if the owner of the clicked plot is the user currently playing the game an edit button will appear where the user can change the plot price Playing partially or not. If the button to buy a plot is pressed, it will check whether the user has enough money to buy, whether the user already owns the plot and whether the plot for sale in all these cases will display a detailed message to the user if everything is OK.
![image](https://user-images.githubusercontent.com/92925015/162025108-708a8866-7317-44db-ae9a-b72f5741b6a0.png)
![image](https://user-images.githubusercontent.com/92925015/162025121-1cda87c6-040f-4c99-9270-6b465ee81c9d.png)

Edit:
This screen is the user interface where a user as a plot owner will be able to change the status of the plot, its price and whether he wants to share the game on his plot and in addition there is a button to save that after clicking the system changes will be saved.
![image](https://user-images.githubusercontent.com/92925015/162025285-31d84936-6fad-49f2-92cc-404e1bcb2064.png)
![image](https://user-images.githubusercontent.com/92925015/162025304-19df7cdd-262c-45eb-b413-2498cccc1c80.png)

The server and client must be run in two different terminals with the command:
npm i and then npm start


