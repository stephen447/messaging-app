import React from "react";
import "./Message.css";

const Message = ({ message, reciepient }) => {
  return (
    <>
      <p
        className={
          reciepient === true
            ? "reciepient message-bubble right"
            : "sender message-bubble left"
        }
      >
        {message.message}
      </p>
    </>
  );
};
export default Message;
