import React from "react";
import "./Message.css";

const Message = ({ message, reciepient }) => {
  console.log(message);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const options = {
      year: "numeric",
      month: "long", // Full month name
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    };

    return date.toLocaleDateString(undefined, options);
  };
  const formattedDateTime = formatDateTime(message.createdAt);
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
        <span
          className={
            reciepient === true ? "tooltip-reciepient" : "tooltip-sender"
          }
        >
          {formattedDateTime}
        </span>
      </p>
    </>
  );
};
export default Message;
