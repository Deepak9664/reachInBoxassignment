ReachInBox Assignment
Overview
This project implements an email automation system using Node.js and integrates with Gmail's API to process incoming emails, classify them based on their content, and send automated replies using OpenAI.

Dependencies
@google-cloud/local-auth: Used for local authentication with Google services.
bullmq: Library for creating background job processing queues.
cookie-session: Middleware for Express.js to handle session management.
ejs: Templating engine for rendering HTML templates.
express: Web framework for Node.js used for routing and handling HTTP requests.
googleapis: Official Node.js client library for Google APIs, used for accessing Gmail API.
mongoose: ODM library for MongoDB, used for database operations.
nodemon: Utility for automatically restarting the Node.js application during development.
openai: Client library for accessing OpenAI's GPT models for natural language processing.
passport: Authentication middleware for Node.js.
passport-google-oauth20: Passport strategy for authenticating with Google using OAuth 2.0.
Functionality
Creating Labels: When an email is received, the system checks its content. If the email contains certain keywords like "Interested," it creates a label named "Interested" in the user's Gmail account and assigns it to the email.

Replying to Emails: The system uses OpenAI's GPT model to generate automated replies based on the content of the incoming email. It then sends a reply to the sender with the generated response.

OAuth Authentication with Passport
The project uses OAuth 2.0 for authentication with Google. Passport.js is employed as the authentication middleware. Users are redirected to Google's OAuth consent screen to grant permission for the application to access their Gmail account.

Setup
Clone the repository:

bash
Copy code
git clone https://github.com/Deepak9664/reachInBoxassignment.git
Install dependencies:

bash
Copy code
cd reachInBoxassignment
npm install
Create a .env file in the root directory and add the following environment variables:

plaintext
Copy code
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=/auth/google/redirect
SESSION_SECRET=YOUR_SESSION_SECRET
Start the development server:

bash
Copy code
npm start
Access the application in your browser at http://localhost:3000.
Screenshots
OAuth Consent Screen
![consent Screen](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/73364aea-1e4b-4af8-a325-5622a3026061)
![giving acces to screen](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/d715555f-b684-445a-8259-b0bd54edb80c)
Adding Labels as per the email content  

![label](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/c8243504-519d-498e-a242-557065729d20)

Reply Screenshot by open ai response as per the email content 

![Screenshot (95)](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/b107be9b-ffc4-40d6-857a-eb2289b21fad)


Routes and ejs template summary screen shot 
http://localhost:3000/
![Screenshot (99)](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/d1854d12-53ee-41cb-89a8-b4f011f70ab8)
http://localhost:3000/auth/login

![Screenshot (100)](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/8b6c7325-039f-4804-be90-242e44bf076b)

http://localhost:3000/profile
![Screenshot (100)](https://github.com/Deepak9664/reachInBoxassignment/assets/110588982/f690483f-96b8-4d4f-8a04-67a3f693c81e)
