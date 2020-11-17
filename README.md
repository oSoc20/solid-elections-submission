This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**Team name :** Solid Elections<br/>
**Declaration team members :** [Damien Brebion (Dev)](https://www.linkedin.com/in/damien-brebion/), [Bram Kreulen (Dev)](https://www.linkedin.com/in/bram-kreulen-3ba60a1b3/), [Akvilė Kovalčikaitė (Communication)](https://www.linkedin.com/in/kovalcikaite)<br/>
**Project :** Solid Elections (Declaration part)<br/>
**Project's description :** Digitize expense form declaration.<br/>

## Starting
### How to start
First, make the command :
```
npm install
npm start
```

Runs the app in the development mode.<br/>
Open http://localhost:3000 to view it in the browser.<br/>

The page will reload if you make edits.<br/>
You will also see any lint errors in the console.

### How to build
`npm run build`

### How to deploy
**We use github to deploy.**<br/>
First, you have to check in package.json if the homepage is the link to https://user.github.io/repo-name<br/>
Then, you can use the command :
`npm run deploy`

## Technologies
### Solid
Solid is used to allow the user to control their data. Users can authorize for the data to be publicly viewed on the website, and withdraw said authorization.<br/>
You can heberg your own solid server and let the user use it to create their account. People can also create their own servers.
Solid uses WebID to identify the user with Linked Data.

### WebID
It is a unique link to your profile, which represents your ID online for your solid pod (eg: https://_username_.solid.community/card#me)

### Linked Data
Linked data offers the ability to to publish data in an accessible and reusable format that allows people to link and combine data from different sources.

Useful link : https://lod-cloud.net/clouds/lod-cloud.svg 


### Frameworks
We decided to use **ReactJS**. This was the first time our team members had to use a front-end framework. Initially, we tried to work with EmberJS, but it was too difficult to learn a new framework in such a short amount of time.

## The project
### How it works
When you arrive at the website for the first time, you have to create an account on your solid server (solid.community or inrupt by default)<br/>
Then, you have to login and authorize the app to access to read, write, and append you solid pod.<br/>
After this step, you have to complete your profile in order to to create a new declaration.<br/>
Complete your profile with LBLOD ID and address. (This LBLOD ID can be replaced by e-ID later), if LBLOD ID is valid first name and last name will be fetch from the database.<br/>
If your profile is completed and saved, you will now have access to a new form declaration. <br/>
For this project we created the form G103. You have to follow these steps and complete the fields, and when it's done, you have to sign and send it.<br/>
If there is no error, you will be redirected to a page "/formSent" with a success message.

### More details
When you save your profile, it will fetch your database to check if your LBLOD ID is defined. If it is not, the user will get an alert. If it is defined, then we fetch the database again to store our WebID and LBLOD ID. If it's a success, we can check with _updated_ if the LBLOD ID has been added or not (already there). If success is true, we can save the data to the solid pod at public/solidelections/me.ttl#me<br/>
For the form, we ask to fetch the name of the list and tracking number with the LBLOD ID. An error message will come up in case there is a problem with the request.<br/>
Then the user can fill in the fields and "sign and send". This step will check all data (empty, not a number, ...) and if everything is working, the file will be created in the solid pod at public/solidelections/g103.ttl with differents subjects for each data.

### Storage
Each file is stored at : solid pod/public/solidelections/_file_.ttl<br/>
Where _file_ is me.ttl and g103.ttl for now. <br/>
We recommend to make a folder declarations/_year_/_file_.ttl<br/>
Where _year_ is the year and _file_ is the declaration, so you can fetch old files and edit in case there is a mistake made.

### Storage structure
#### me.ttl
1. subject : #me
    - [streetAddress](https://schema.org/streetAddress) : street, number (street and number are different field but we put these together
    - [postalCode](https://schema.org/postalCode) : postal code
    - [addressLocality](https://schema.org/addressLocality) : locality
    - [sameAs](https://schema.org/sameAs) : LBLOD ID

#### g103.ttl
1. subject : #authorizedPerson
    - [director](https://schema.org/director): yes or no (if he is a mandate person)

1. subject : _generated id_ (expenses)
    * BuyActionData:
        - type : [https://schema.org/BuyAction](https://schema.org/BuyAction)
        - [agent](http://schema.org/agent) : me.ttl (https://_<user>_.solid.community/public/solidelections/me.ttl#me)
        - [identifier](https://schema.org/identifier) : Expense ID
        - [description](http://schema.org/description) : Expense Description
        - [price](http://schema.org/price) : Expense amount
        - [currency](http://schema.org/priceCurrency) : Expense currency (€)

1. subject : _generated id_ (funds)
    * DonateActionData:
        - type : [http://schema.org/DonateAction](http://schema.org/DonateAction) 
        - [recipient](https://schema.org/recipient) : me.ttl (https://_<user>_.solid.community/public/solidelections/me.ttl#me)
        - [identifier](https://schema.org/identifier) : Fund ID
        - [description](http://schema.org/description) : Fund Description
        - [price](http://schema.org/price) : Fund amount
        - [currency](http://schema.org/priceCurrency) : Fund currency (€)

### Working with database
Our database provides some endpoint, but to let them know who we are, you have to send your WebID and LBLOD ID (or e-ID) and say :
I'm _WebID_ and my data is store at _LBLOD ID_, this ID allows you to know which person has this solid pod.<br/>

### States
Working on : https://osoc20.github.io/solid-elections-submission/<br/>
We have some remarks below

### Problem encountered, but solved
1. _App_ don't have access to your solid pod : Because popup must be on the same server as the APP
1. Infinite loading : We have to set the state loading: true if the user's profile does not exist
1. Favicon doesn't appear on build : Because it was too big. For that we use a website to generate : https://realfavicongenerator.net/
1. Github page is blank: Because package.json/homepage isn't correct

### Bugs (Design)
1. If we login, logout and login with **another account** you have to completelly refresh the page, because profile data is not updated
--> Idea : Store state to know if person is logged out or not, and when the state becomes true, we refresh the container
1. Refresh page on github create a 404 error because of Routing
--> Idea : /
1. Can't use popup.html in local href on React build, we have to use the absoluthe link (https://site.domain/popup.html) **Must be on the same server as the App**

### Bugs (Technical)
1. Webcomponent v3's icon is not working

### Improvements (Design)
1. Change component inputAmount.jsx "€" to webcomponent icon

### Improvements (Technical)
1. Use e-ID instead of LBLOD ID
1. We use schema.org but it could be nice to use your own vocabulary
1. Change component inputAmount.jsx "€" to webcomponent icon
1. Create others forms

## Website Text Adjustment
This section discusses the different steps that have to be followed in order to change the text of the website. The different steps explain how to use git and github to make these changes.

### Create github account and install Github Desktop
This step discusses how to set up a github account and download github desktop.

1. Create an account on [github](https://github.com/).
1. Download [Github Desktop](https://desktop.github.com/).
1. Sign in with your github account on Github Desktop.

[![GithubDesktop](https://cdn.loom.com/sessions/thumbnails/42ea585dddea4469bff5a650dc8eabb2-1605271898440-with-play.gif)](https://www.loom.com/share/42ea585dddea4469bff5a650dc8eabb2)

### Clone the Repository
This step discusses how to clone a remote repository onto your local machine. In this step you will copy the code of the remote repository and download it on your local machine.

[![CloneRepository](https://cdn.loom.com/sessions/thumbnails/6a2e84b8f0cd4b2e905d792b45c9790e-with-play.gif)](https://www.loom.com/share/6a2e84b8f0cd4b2e905d792b45c9790e)

### Create a Separate Branch
This step discusses how to create a separate branch to do your work on. Creating a branch will ensure that the work you do does not intervene with the work of other people.

Please create your own branch from the current branch ```multilingual-implementation```.

[![CreateSeparateBranch](https://cdn.loom.com/sessions/thumbnails/4e15cfac48a649f9bb2f5331486086b8-with-play.gif)](https://www.loom.com/share/4e15cfac48a649f9bb2f5331486086b8)

### Make Changes to the Website
This step will go over how to make changes related to the text on the website. The files can be edited with any text editer on your local machine. As explained in the video, please keep the following rules in mind:

1. Start a translation with a capital letter only if and only if the capital letter is also present in the english text.
1. At the end of sentences, do not add punctuation marks.

[![MakeChanges](https://cdn.loom.com/sessions/thumbnails/c9d68a90d7154dbbb900bd3af6490319-with-play.gif)](https://www.loom.com/share/c9d68a90d7154dbbb900bd3af6490319)

### Commit Changes and Push Changes to the Remote Repository
This step will help you to commit your local changes on your local machine and afterwards push those changes to the remote repository on github. Committing changes means that you are sure that those changes are good and you want to persist them. Pushing changes means that you notify the remote repository on github of the changes that you made on your local machine.

1. Commit changes
1. Push changes

[![CommitPushChanges](https://cdn.loom.com/sessions/thumbnails/45dd8c6396244f7c84fd2f955433dbd5-with-play.gif)](https://www.loom.com/share/45dd8c6396244f7c84fd2f955433dbd5)

### Create a Pull Request
The last step consist of creating a pull request. This pull request will notify the creators of this repository of the changes that you made on your branch. They will check the changes and if they are correct, your branch will be merged with the original branch.

[![CreatePullRequest](https://cdn.loom.com/sessions/thumbnails/7bfccf0d6cfe4b10b681e0942d2fdd59-with-play.gif)](https://www.loom.com/share/7bfccf0d6cfe4b10b681e0942d2fdd59)