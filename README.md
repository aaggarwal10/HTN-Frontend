# HTN-Frontend

## Part 1 - Build Setup and Run Project

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
For the working front-end app, visit [app.anishaggarwal.ca](https://app.anishaggarwal.ca).
For the log in, the valid username and password for hacker is:

```bash 
    username: "hacker@hglobalinc"
    password: "1234abcd"
```


## Part 2 - Writeup
1. Walk us through your development as you worked on this project. 
   1. How did you plan out the structure and design of it?

        I started by looking at the 4 functionalities desired by the project. I noticed that compared to the first three conditions, the last conditon of providing a link to a specific event and each related even was the most specific. I decided to start structuring the UI to incorporate this idea. Thinking of having users directed to related events depending on an event of their interest, I decided to have a pop up dialog box for each event to avoid clutter of information on the page. Also, I wanted to use a calendar/timeline object when I think of a hackathon schedule I think of calendar with events filled in. This led me to making a simplistic design of a calendar that has the functionaliy of a pop up dialog box for each event on the schedule that is clicked. The Login authorization can simply redirect to a different login page to maintain the simplistic look of the schedule. This was how I planned the structure and design of my project.


    2. How did you decide on the tools you have used?

        Here are a the tools that I have used in the project:
        
        ```bash
        "axios": "^0.21.1",
        "nuxt": "^2.14.12",
        "@nuxtjs/pwa": "^3.3.5",
        "eslint": "^7.18.0",
        ```
        1. Axios:
            
            I used Axios & CORS for fetching the data from the HTN API. It was very simple to use and lightweigh which is why I used it in this project.

        2. nuxtjs:
            
            I used nuxtjs as it is a Frontend Platform that I used before to develop a calendar for my Teleclinic App. It had a component that I knew how to use and base the project around. Hence, using nuxtjs would make the process of developing the app simpler and faster which made it a great choice.

        3. @nuxtjs/pwa:

            A module of nuxtjs that makes it very easy to develop a Progressive Web App. Simply any SSR Web App you create can be compiled to a PWA through this function. As creating a PWA is a requirement, using this module would easily allow me to develop the PWA.
        
        4. eslint:

            A module that helps keep clean code which is useful for readability so that others can easily read and understand the code written.

    3. Did you encounter any problems? And if so, how did you solve them?

        I had a problem with id. I realized during my project that I required a three way linkage between an eventID, the index of eventID in the query array,
        and the name of the array. Otherwise I would be looping every time a single change was made to the calendar. In order to solve this problem at the very start, I created two arrays that would create two maps from eventID -> Index, and from Index -> Name. With This I would be able to get all the information I need very quickly without any extra latency.


        I also had a problem with sending data between the Login page and the main page. At first, my password would always be compromised, and Google Chrome would pop up with a notification. I believe this was due to me simply passing in the password as a parameter in components. However, I realized that this is very bad for security reasons. Usually, I would have authentication only occuring in one file and passing flags around. Also, I would usually use a module for authentication like Auth0 to gurantee security. However, as authentication was not a requirement, I started trying out how to pass variables around differently. This lead me to learning more about Vuex and the store. The store stores flags and variables on the server side, not on the client so there were no security issues left with compromising the errors. Through documentation and testing new strategies, I was able to learn a lot more about security.


    4. Are there any areas of your code that you're particularly proud of or want to point out?

        I am particularly proud of learning and properly using localization of information through the store. Furthermore, I am proud of being able to format my code in a way that makes it scalable down to many different device. Overall, although these were parts of the code that I was proud of, I mainly feel that I am proud of the way the whole application came out aesthetically. The simplistic design of the table and dialog boxes along with the login menu looks complete. The User-UI interactions are also very smooth. Overall the choice of using a calendar component from Vuetify in Nuxtjs allowed the app to come together really well.

2. Given additional time, how would you extend your application to become a fully functional product that thousands of hackers and the general public would use at Hackathon Global Inc.&#8482;'s next event?
    
    I would extend the application by adding the filtering mechanic that was suggested in potential additions. Additionally, I found that if I were to extend this application to become a fully functional product, I would have to sit down and understand how to properly design the rest of the components such as Sponsors, FAQ, etc. without destroying the simplistic design I created. A large part of Front-End Development is envisioning how you want the site to look. With additional time, I would explore different UI options rather than nuxtjs as I feel that althout nuxtjs is great for simple and fast websites, it has a standard look when components are used. I believe making my own components for the calendar could help brand the site better and make the whole website fit together.