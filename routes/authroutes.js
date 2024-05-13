const router = require('express').Router();
const passport = require('passport');
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const path = require("path");


// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile' , 'email', 'https://mail.google.com/',"https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels"]
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //  res.send(req.user);
     res.redirect('/profile');
});

// router.get('/gmail', passport.authenticate('google'),async (req, res) => {
//     console.log("xxxxxxxxxxxxxxxxxx",path.join(__dirname, "credential.json"))
//     if (!req.user) {
//         console.log("resqqqqqqqquserrrrrrrrr",req.user)
//         // User not authenticated, redirect to login
//         return res.redirect('/auth/login');
//     }

//     try {
        

//         // Initialize Gmail API
//          const gmail = google.gmail({ version: "v1", auth });
//          console.log("gmailllllllllllllllll",gmail)

//          async function getUnrepliesMessages(auth) {
//             console.log('function getUnrepliesMessages got hitted  ');
//             const gmail = google.gmail({ version: "v1", auth });
//             const response = await gmail.users.messages.list({
//               userId: "me",
//               labelIds: ["INBOX"],
//               q: '-in:chats -from:me -has:userlabels',
//             });
//             console.log("oooooooooooooooooooo",response)
//             return response.data.messages || [];
//           }

//         // // Function to create label or get existing label ID
//         // async function createLabel(auth) {
//         //     // Implementation...
//         // }

//         // // Function to get unreplied messages
//         // async function getUnrepliedMessages(auth) {
//         //     // Implementation...
//         // }

//         // // Function to send reply and add label
//         // async function sendReplyAndAddLabel(auth, message, labelId) {
//         //     // Implementation...
//         // }

//         // // Main function to run automation
//         // async function main() {
//         //     // Create or get existing label ID
//         //     const labelId = await createLabel(auth);

//         //     // Run automation at regular intervals
//         //     setInterval(async () => {
//         //         // Get unreplied messages
//         //         const messages = await getUnrepliedMessages(auth);
//         //         console.log(`Found ${messages.length} unreplied messages`);

//         //         // Send reply and add label to each message
//         //         for (const message of messages) {
//         //             await sendReplyAndAddLabel(auth, message, labelId);
//         //             console.log(`Sent reply and added label to message with ID ${message.id}`);
//         //         }
//         //     }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000); // Random interval between 45 and 120 seconds
//         // }

//         // // Execute main function
//         getUnrepliesMessages(auth).catch(error => {
//             console.error('Error in Gmail automation:', error);
//             // Handle error...
//         });

//         // res.status(200).send('Gmail automation started successfully.');
//     } catch (error) {
//         console.error('Error authenticating with Gmail API:', error);
//         // Handle authentication error...
//         res.status(500).send('Error authenticating with Gmail API.');
//     }
// });



module.exports = router;