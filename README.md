![Ironhack Logo](https://i.imgur.com/1QgrNNw.png)

# DE | Express Linkedin Clone

<img src="https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_b5ba91b16c4029dd5efa047e1a1246eb.png" width="400px">

## Requirements

- [Fork this repo](https://guides.github.com/activities/forking/)
- Clone this repo into your `~/code/labs`

## Submission

Upon completion, run the following commands
```
$ git add .
$ git commit -m "done"
$ git push origin master
```
Navigate to your repo and create a Pull Request -from your master branch to the original repository master branch.

In the Pull request name, add your name and last names separated by a dash "-"

## Deliverables

Push your entire Express app to the GitHub.

## Instructions

### Introduction

[LinkedIn](https://www.linkedin.com/) is the ubiquitous career-based social networking platform, that many of you should have an account on. **Cough Cough**.

In this lab, we will be creating a basic version of LinkedIn's authentication features. If you'd like to continue with this example in the future, apply styles, and add extra features, feel free! **BUT** the goal of this exercise is to work with authentication, and authorization.

As starter code, we have created a project with `express-generator`, so you will start the project from scratch!

<!-- :::warning -->
:exclamation: **Finish all of the iterations before adding any styles or bonus features.**
<!-- ::: -->

### Iteration 1 | Authentication & User Accounts

Before we do anything, we need to implement basic authentication, and User accounts. Start with a very basic home page, and the authentication features of signing up, logging in, and logging out.

<!-- :::info -->
:bulb: **USBAT** stands for **U**ser **S**hould **B**e **A**ble **T**o
<!-- ::: -->

#### Features

- **USBAT** => View the home page.
- **USBAT** => Register in the application.
- **USBAT** => Login
- **USBAT** => Logout

#### Routes

- `GET` `/`. Create a very basic home page with a message saying "Welcome < User Name >" once the user is logged in. If the user hasn't started a session, he should be redirected to `/login` page.
- `GET` `/signup`. The signup page has to show a form with the fields `username`, `password`, `name`, and `email`.
- `POST` `/signup`. We save the user information in the database.
- `GET` `/login`. If the user is already logged in, it should redirect him to the home page.
- `POST` `/login`. We start user's session.
- `GET` `/logout`. We end the user's session.

#### Pages

- `home.ejs`
- `authentication/signup.ejs`
- `authentication/login.ejs`

#### Models

- `User`
  - `name` - User's name
  - `email` - User's email
  - `password` - Encrypted password with BCrypt
  - `summary` - User's summary: where he has worked, how many years...
  - `imageUrl` - Upload your user profile picture to [imgur](http://imgur.com/) and use the public link to show the image in our LinkedIn
  - `company` - User's current company
  - `jobTitle` - User's current Job Title

<!-- :::warning -->
:exclamation: Make sure the user cannot revisit the login or register pages if they're logged in.
<!-- ::: -->

### Iteration 2 | User Profiles & Authorization

In this iteration, we will build out the User's public and private profiles. In the private page, the user will be able to change his information, while in the public page, everyone will be able to see our profile so we can get a cool job.

#### Features

- **USBAT** => Edit **their own** profile. The user should *not* be able to edit another user's profile.
- **USBAT** => View someone else's public profile **without being logged in**. The public profile should only show the user's `name`, `jobTitle`, `image`, and `company`.
- **USBAT** => View someone else's private profile **only when logged in**. This should display *all* of the user's information, **excluding their password**.

#### Routes

- `GET` `/profile/:userId/edit` - This will allow the user to edit their own profile. The user should be redirected to the homepage if they're trying to edit a profile that isn't theirs.
- `POST` `/profile/:userId`
- `GET` `/profile/:userId`
  -  This will display a user's profile, based on the `userId`. If the user is logged in, and viewing their own profile, the page will display a "Edit Your Profile" button.
  -  If the user is logged in, they will be displayed the **public profile** with limited information. If they are not they will be displayed the **private profile** with all of the information.

#### Pages

- `profiles/edit.ejs` - Edit user information (private profile page)
- `profiles/show.ejs` - User profile page (public profile page)

### Iteration 3 | News Feed

Implement a news feed that shows posts from all of the people on LinkedIn. Yes, typically you'd only be browsing posts from people that you are connected with, but that's for another iteration later.

#### Features

- **USBAT** => Create a new post **if they are logged in**.
- **USBAT** => Edit a post **they has created**.
- **USBAT** => View a list of all of the user created posts on the home page.

#### Routes

- `GET` `/users/:userId/posts/new` - Create a new post
- `POST` `/users/:userId/posts` - Save the post information in the database

#### Pages

- `posts/new.ejs`

#### Models

- `Post`
  - `content` - Information that the user wants to share
  - `_creator` - Owner of the post

### BONUS | Styles

Let's do our LinkedIn fancy! Add some styles to your application so our employers can see our profile and our styling skills. Once you are done with this exercise, you will have your own CV, created by yourself 😎

### EXTRA BONUS | Connections

We need to create connections between users. Modeling friendships / connections using mongodb is generally not ideal, and can be a bit tricky.

Check out [this stackoverflow answer](http://stackoverflow.com/a/30705076/4624718) about modelling friendships.

Once you implement connections, make it so the home page only displays posts from a user's connections.

Since this is bonus, we'll leave the implementation details up to you. :wink:
