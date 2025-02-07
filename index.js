import { execFileSync } from "child_process";
import http from "http";
import {v4 as uuidv4} from "uuid";

const PORT = 3000;
const HOST = "127.0.0.1";

const users = [

  {id:"f5e43e53-d59f-4b0a-9beb-3efe19297e87" , name:"Lejla" , age:20},
  {id:"e1622eed-6cde-489a-88ea-377ec4f6f43f" , name:"Zlatan" , age:27},
  {id:"4b239661-d230-440e-b2f9-b7bb8064c46" , name: "Nedim" , age:16}
]
const sendResponse = (res, statusCode, data) => {
  res.statusCode = statusCode;
  res.end(typeof data === "string" ? data : JSON.stringify(data));
  // upit ? true : false
}

const handleGetRequests = (req, res) => {
  const { url } = req;
  if (url === "/") {
    sendResponse(res, 200, "Healthy")
  }
  //GET / users
  else if (url === "/users") {
    sendResponse(res, 200, users);
    //GET /users/ :id
  } else if (url.includes("/users")){
    const userId = url.split("/").pop();
    const user = users.find((user) => user.id === userId );

    if(user){
      sendResponse(res, 200, user);
    } else {
      sendResponse(res, 404, "User is not found");
    }
    // Nepoznate rute
  } else {
    sendResponse(res, 404, "Route is unknown");
  }
}
const handlePostRequests = (req, res) =>{
    
    let body = "";
    const {url} = req;
    req.on("data" , (chunk) => {
      body += chunk;
    });
    req.on("end" , () => {
      const parsedData = JSON.parse(body);
      if (url === "/users"){
        const user = {
          ...parsedData,
          id: uuidv4()
        };
        users.push(user);
        sendResponse(res, 201, user)
      } else {
        sendResponse(res, 404, "Unknown route");
      }
      const user = {
        ...parsedData,
        id: uuidv4()
      };
      users.push(user);
      sendResponse(res, 201, user);
    });


};
const handlePutRequests = (req, res) => {
let body = "";
const {url} = req;

req.on("data" , (chunk) => {
  body += chunk;
})

req.on ("end" , () => {
  const user = JSON.parse(body);
  const userId = url.split("/").pop();
  console.log(userId);

  const userIndex = users.findIndex((user) => user.id === user.id);

  users[userIndex] = user;
  sendResponse(res, 200, "User updated successfully");
})

};

const handleDeleteRequests = (req, res) => {
   const {url} = req;
   const userId = url.split("/").pop();

   const userIndex = users.findIndex ((user) => user.id === user.id);
   if (users.index !== -1)
   { users.splice(userIndex, 1);
   sendResponse(res, 204, "No content");}
   else {
    sendResponse (res, 404 , "User not found");
   }
} 
const handlePatchRequests = (req, res) => {
 let body = "";
 const { url } = req;
    const userId = url.split('/').pop();

 req.on ("data" , (chunk) => {
  body += chunk;
 });
 req.on ("end" , () => {
  const data = JSON.parse(body);

  const userIndex = users.findIndex((user) => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...data,
  }
    
  sendResponse(res, 200, users[userIndex]);
} else {
  sendResponse(res, 404, "User not found");
}
 });
}
const server = http.createServer((req,res) => {

if (req.method === "GET") {
 handleGetRequests(req, res);
} else if (req.method === "POST") {
  handlePostRequests(req, res);
} else if (req.method === "PUT"){
  handlePutRequests(req, res);
} else if (req.method === "DELETE"){
  handleDeleteRequests(req, res);
} else if (req.method === "PATCH") {
  handlePatchRequests(req, res);
}
});
server.listen(PORT, HOST, () => {

  console.log("Server je pokrenut na portu: ", PORT);
});