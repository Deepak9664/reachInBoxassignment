// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const keys = require("./keys");
// const User = require("../models/userModel");
// const { google } = require("googleapis");
// const OpenAI = require("openai");
// const openai = new OpenAI({
//   apiKey: keys.google.AIsecretKey,
// });

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then((user) => {
//     done(null, user);
//   });
// });
// async function getMessages(auth) {
//   console.log("function getUnrepliesMessages got hitted  ");
//   const gmail = google.gmail({ version: "v1", auth })
//   const response = await gmail.users.messages.list({
//     userId: "me",
//     labelIds: ["INBOX"],
//     q: "from:singhdepak30@gmail.com is:unread",
//     maxResults: 2,
//   });
//   console.log("oooooooooooooooooooo", response.data.messages);
//   return response.data.messages || [];
// }

// async function addLabel(auth, message, labelId) {
//   const gmail = google.gmail({ version: "v1", auth });
//   await gmail.users.messages.modify({
//     userId: "me",
//     id: message.id,
//     requestBody: {
//       addLabelIds: [labelId],
//       removeLabelIds: ["INBOX"],
//     },
//   });
// }

// async function createLabel(auth,labelName) {
//   console.log("function createlabel got hitted ");

//   const gmail = google.gmail({ version: "v1", auth });
//   try {
//     const response = await gmail.users.labels.create({
//       userId: "me",
//       requestBody: {
//         name: labelName,
//         labelListVisibility: "labelShow",
//         messageListVisibility: "show",
//       },
//     });
//     console.log("listLbaelresponse", response.data);
//     return response.data.id;
//   } catch (error) {
//     if (error.code === 409) {
//       const response = await gmail.users.labels.list({
//         userId: "me",
//       });
//       const label = response.data.labels.find(
//         (label) => label.name === labelName
//       );
//       return label.id;
//     } else {
//       throw error;
//     }
//   }
// }

// async function sendReply(auth, message, response) {
//   console.log("function sendReply got hitted  ",response);

//   const gmail = google.gmail({ version: "v1", auth });
//   const res = await gmail.users.messages.get({
//     userId: "me",
//     id: message.id,
//     format: "metadata",
//     metadataHeaders: ["Subject", "From"],
//   });
//   const subject = res.data.payload.headers.find(
//     (header) => header.name === "Subject"
//   ).value;
//   const from = res.data.payload.headers.find(
//     (header) => header.name === "From"
//   ).value;
//   const replyTo = from.match(/<(.*)>/)[1];
//   console.log("replytooooooooooooo", replyTo);
//   const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
//   const replyBody = response.content;
//   const rawMessage = [
//     `From: me`,
//     `To: ${replyTo}`,
//     `Subject: ${replySubject}`,
//     `In-Reply-To: ${message.id}`,
//     `References: ${message.id}`,
//     "",
//     replyBody,
//   ].join("\n");
//   const encodedMessage = Buffer.from(rawMessage)
//     .toString("base64")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
//   await gmail.users.messages.send({
//     userId: "me",
//     requestBody: {
//       raw: encodedMessage,
//     },
//   });
// }

// async function generateResponse(emailContent) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: `Act as ReachinBox organistion and give a proper rply to this email ${emailContent}` }],
//     });
//     console.log(response.choices[0].message);
//     return response.choices[0].message;
//   } catch (error) {
//     console.error("Error generating response from OpenAI:", error.message);
//     return "Error generating response";
//   }
// }


// async function getEmailContent(auth, message) {
//   try {
//     const mail = google.gmail({ version: "v1", auth });
//     const email = await mail.users.messages.get({
//       userId: "me",
//       id: message.id,
//     });

//     const payload = email.data.payload;
//     console.log("payload", payload.parts);

//     if (payload.parts) {
//       const part = payload.parts.find((part) => part.mimeType === "text/plain");

//       if (part.body.data) {
//         // Decode the base64 encoded data to retrieve the email content
//         const emailContent = Buffer.from(part.body.data, "base64").toString();
//         return emailContent;
//       }
//     } else if (payload.body && payload.body.data) {
//       const emailContent = Buffer.from(payload.body.data, "base64").toString();
//       console.log("emailcontentttttt", emailContent);
//       return emailContent;
//     }
//     console.error("Unable to retrieve email content");
//     return "";
//   } catch (error) {
//     console.error("Error retrieving email content:", error);
//     throw error;
//   }
// }

// passport.use(
//   new GoogleStrategy(
//     {
//       // options for google strategy
//       clientID: keys.google.clientID,
//       clientSecret: keys.google.clientSecret,
//       callbackURL: "/auth/google/redirect",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Create OAuth2 client
//         const oAuth2Client = new google.auth.OAuth2(
//           keys.google.clientID,
//           keys.google.clientSecret,
//           "/auth/google/redirect"
//         );

//         // Set credentials
//         oAuth2Client.setCredentials({
//           refresh_token: refreshToken,
//           access_token: accessToken,
//         });
//         async function generaterply() {
//           setInterval(async () => {
//             const messages = await getMessages(oAuth2Client);
//             console.log(`found ${messages.length} unreplied messages`);
//             for (const message of messages) {
//               const emailContent = await getEmailContent(oAuth2Client, message);
//              let labelId 
//           console.log(`Label has been created  ${labelId}`);
//               if (emailContent.toLowerCase().includes("interested")) {
//                 labelId = await createLabel(oAuth2Client, "Interested");
//               } else if (
//                 emailContent.toLowerCase().includes("not interested")
//               ) {
//                 labelId = await createLabel(oAuth2Client, "Not Interested");
//               } else if (
//                 emailContent.toLowerCase().includes("more information")
//               ) {
//                 labelId = await createLabel(oAuth2Client, "More Information");
//               } else {
//                 console.log("Email does not match any category. Keeping it in the inbox.");
//                 const inboxLabel = await createLabel(auth, "INBOX");
//                 // Set the label ID to INBOX
//                 labelId = inboxLabel;
//               }

//               const autoResponse = await generateResponse(emailContent);
//               console.log("autoResponse", autoResponse);
//               await sendReply(oAuth2Client, message,autoResponse);
//               console.log( `sent reply to message with id ${message.id}`,emailContent);
//                    await addLabel(oAuth2Client, message, labelId);
//                   console.log(`Added label to message with id ${message.id},${labelId}`);
//             }
//           }, Math.floor(Math.random() * (20 - 10 + 1) + 10) * 1000); // Random interval between 45 and 120 seconds
//         }
//         generaterply();

//         // Check if user already exists in our db
//         let currentUser = await User.findOne({ googleId: profile.id });
//         if (currentUser) {
//           // User already exists
//           console.log("User is: ", currentUser);
//           done(null, currentUser);
//         } else {
//           // Create new user in our db
//           let newUser = await new User({
//             googleId: profile.id,
//             username: profile.displayName,
//           }).save();
//           console.log("Created new user: ", newUser);
//           done(null, newUser);
//         }
//       } catch (error) {
//         console.error("Error in Google authentication:", error);
//         done(error, null);
//       }
//     }
//   )
// );



const { Queue, Worker } = require("bullmq");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/userModel");
const { google } = require("googleapis");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: keys.google.AIsecretKey,
});

// Initialize BullMQ queue for processing emails
const emailQueue = new Queue("email-processing", {
  connection: {
    host: `127.0.0.1`,
    port: 6379, // 
  },
});

// Define a BullMQ worker to process email jobs
const worker = new Worker("email-processing", async (job) => {
  console.log("bullllmqqqqq",job.data.oAuth2Client)
  const { oAuth2Client } = job.data;
  console.log("workerrrrrrrrrrrrrrrrrrrr",oAuth2Client)
  try {
    const messages = await getMessages(oAuth2Client);
    console.log(`Found ${messages.length} unread messages`);
    for (const message of messages) {
      const emailContent = await getEmailContent(auth, message);
      // let labelId;
      // if (emailContent.toLowerCase().includes("interested")) {
      //   labelId = await createLabel(auth, "Interested");
      // } else if (emailContent.toLowerCase().includes("not interested")) {
      //   labelId = await createLabel(auth, "Not Interested");
      // } else if (emailContent.toLowerCase().includes("more information")) {
      //   labelId = await createLabel(auth, "More Information");
      // } else {
      //   console.log("Email does not match any category. Keeping it in the inbox.");
      //   const inboxLabel = await createLabel(auth, "INBOX");
      //   labelId = inboxLabel;
      // }
      // const autoResponse = await generateResponse(emailContent);
      // await sendReply(auth, message, autoResponse);
      // await addLabel(auth, message, labelId);
    }
  } catch (error) {
    console.error("Error processing emails:", error.message);
  }
}, {
  connection: {
    host: `127.0.0.1`, // Redis server host
    port: 6379, // Redis server port
  },
});

// Function to retrieve unread messages from Gmail
async function getMessages(auth) {
  console.log("function getUnrepliesMessages got hitted  ");
  const gmail = google.gmail({ version: "v1", auth: auth })
  console.log("gmaiiiiiiiiiiiiiii",gmail.users.messages.list)
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: "from:singhdepak30@gmail.com is:unread",
    maxResults: 2,
  });
  console.log("responseeeeeeeeeeeeeeeeeeeee")
  return response.data.messages || [];
}

// Function to create a label in Gmail
async function createLabel(auth, labelName) {
  const gmail = google.gmail({ version: "v1", auth });
  try {
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });
      const label = response.data.labels.find(
        (label) => label.name === labelName
      );
      return label.id;
    } else {
      throw error;
    }
  }
}

// Function to send a reply to an email
async function sendReply(auth, message, response) {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.get({
    userId: "me",
    id: message.id,
    format: "metadata",
    metadataHeaders: ["Subject", "From"],
  });
  const subject = res.data.payload.headers.find(
    (header) => header.name === "Subject"
  ).value;
  const from = res.data.payload.headers.find(
    (header) => header.name === "From"
  ).value;
  const replyTo = from.match(/<(.*)>/)[1];
  const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
  const replyBody = response.content;
  const rawMessage = [
    `From: me`,
    `To: ${replyTo}`,
    `Subject: ${replySubject}`,
    `In-Reply-To: ${message.id}`,
    `References: ${message.id}`,
    "",
    replyBody,
  ].join("\n");
  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

// Function to generate a response using OpenAI
async function generateResponse(emailContent) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Act as ReachinBox organization and give a proper reply to this email: ${emailContent}` }],
    });
    return response.choices[0].message;
  } catch (error) {
    console.error("Error generating response from OpenAI:", error.message);
    return "Error generating response";
  }
}

// Function to retrieve email content
async function getEmailContent(auth, message) {
  try {
    const mail = google.gmail({ version: "v1", auth });
    const email = await mail.users.messages.get({
      userId: "me",
      id: message.id,
    });
    const payload = email.data.payload;
    if (payload.parts) {
      const part = payload.parts.find((part) => part.mimeType === "text/plain");
      if (part.body.data) {
        const emailContent = Buffer.from(part.body.data, "base64").toString();
        return emailContent;
      }
    } else if (payload.body && payload.body.data) {
      const emailContent = Buffer.from(payload.body.data, "base64").toString();
      return emailContent;
    }
    console.error("Unable to retrieve email content");
    return "";
  } catch (error) {
    console.error("Error retrieving email content:", error);
    throw error;
  }
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

// Configure Google OAuth2 passport strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const oAuth2Client = new google.auth.OAuth2(
          keys.google.clientID,
          keys.google.clientSecret,
          "/auth/google/redirect"
        );
        oAuth2Client.setCredentials({
          refresh_token: refreshToken,
          access_token: accessToken,
        });
        console.log("ooooooauthhhhhhhCLIENTT",oAuth2Client)
       await emailQueue.add("process-email", { oAuth2Client });
        let currentUser = await User.findOne({ googleId: profile.id });
        if (currentUser) {
          console.log("User is: ", currentUser);
          done(null, currentUser);
        } else {
          let newUser = await new User({
            googleId: profile.id,
            username: profile.displayName,
          }).save();
          console.log("Created new user: ", newUser);
          done(null, newUser);
        }
      } catch (error) {
        console.error("Error in Google authentication:", error);
        done(error, null);
      }
    }
  )
);

