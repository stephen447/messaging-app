import React from "react";
import "./Message.css";

const Message = ({ message, reciepient }) => {
  //console.log(reciepient);
  return (
    <>
      <p className={reciepient === true ? "reciepient" : "sender"}>
        {message.message}
      </p>
    </>
  );
};
export default Message;
