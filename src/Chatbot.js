import React from "react";
import "./styles.css"; // Import your CSS styles

class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diff: "None",
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.appendUserMessage = this.appendUserMessage.bind(this);
    this.appendChatbotMessage = this.appendChatbotMessage.bind(this);
  }

  sendMessage() {
    const userInput = document.getElementById("user-input");
    let userMessage = userInput.value.trim();

    if (userMessage === "") {
      return;
    }
    this.appendUserMessage(userMessage);
    let { diff } = this.state;

    if (diff === "Doc") 
    {
      userMessage = userMessage + "/Doctor";
      console.log(userMessage);
      console.log(diff);
      this.setState({ diff: "None" });
    }
    if (diff === "Hos") 
    {
      userMessage = userMessage + "/Hosp";
      console.log(userMessage);
      this.setState({ diff: "None" });
    } 
    if (userMessage.toLowerCase() === "doctor") 
    {
        this.appendChatbotMessage("Kindly Enter State, City, Pincode");
        console.log("This");
        this.setState({ diff: "Doc" });
    } 
    else if (userMessage.toLowerCase() === "hospital") {
        this.appendChatbotMessage("Kindly Enter State, City, Pincode");
        this.setState({ diff: "Hos" });
    } 
    else {
        setTimeout(() => {
          fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: userMessage }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              if (data.hasOwnProperty("Description")) {
                this.appendChatbotMessage(data.Description[0]);
                let x = data.Medications[0].replace(/\[|\]/g, "");
                x = x.replace(/'/g, "");
                this.appendChatbotMessage("Medications: " + x);
                this.appendChatbotMessage(
                  "Specialist: " + data.Specialist_Required[0]
                );
                this.appendChatbotMessage(
                  "Would you like to find specialized doctor or nearest hospital?"
                );
              } else if (data.hasOwnProperty("Recommended_Doctors")) {
                console.log(data.Recommended_Doctors);
                this.appendChatbotMessage(data.Recommended_Doctors[0].doctor);
                this.appendChatbotMessage(data.Recommended_Doctors[0].address);
              } else if (data.hasOwnProperty("Hospital")) {
                this.appendChatbotMessage(
                  "Nearest Hospital with available services: "
                );
                this.appendChatbotMessage(data.Hospital);
                this.appendChatbotMessage(
                  data.City + ", " + data.State + ", " + data.Pincode
                );
              } else if (data.hasOwnProperty("message")) {
                this.appendChatbotMessage(data.message);
              } else {
                this.appendChatbotMessage(data);
              }
            })
            .catch((error) => {
              console.error(
                "There was a problem with the fetch operation:",
                error
              );
            });
        }, 500);
      }
      userInput.value = "";
    }

  appendUserMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const userDiv = document.createElement("div");
    userDiv.className = "message user-message";
    userDiv.appendChild(document.createTextNode(message));
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  appendChatbotMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const chatbotDiv = document.createElement("div");
    chatbotDiv.className = "message chatbot-message";
    chatbotDiv.appendChild(document.createTextNode(message));
    chatBox.appendChild(chatbotDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.sendMessage();
    }
  };

  render() {
    return (
      <div>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h1>Healthcare Service Recommender</h1>
          </div>
          <div className="chat-box" id="chat-box">
            {/* Chat messages will be displayed here */}
          </div>
          <div className="input-container">
            <input
              type="text"
              id="user-input"
              placeholder="Type a message..."
              onKeyPress={this.handleKeyPress}
            />
            <button onClick={this.sendMessage}>Send</button>
          </div>
        </div>

        <div className="temp">
          <div className="bullet-box">
            <ul>
              <li>
                The Knowledge provided in this chatbot may be wrong, its better
                to consult a healthcare professional as well.
              </li>
              <li>
                It provides Medical Diagnosis, medicine recommendation, general
                advice, hospital recommendation and doctor recommendation
              </li>
              <li>
                It is advised not to rely solely on the chatbot and seeks
                immediate medical attention.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Chatbot;
