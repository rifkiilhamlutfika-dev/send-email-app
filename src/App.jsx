import { useState } from "react";

export default function App() {
  const [disabled, setDisabled] = useState(false);

  async function handleSubmit(e) {
    setDisabled(true);
    e.preventDefault();
    const data = {
      name: e.target[0]?.value,
      email: e.target[1]?.value,
      message: e.target[2]?.value,
    };

    const url = "http://localhost:8000/send-message";
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => {
        alert("Your message has been sent!");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setDisabled(false);
      });
  }

  return (
    <>
      <div className="content">
        <h1>Send Massage To Email</h1>
        <p>Implementation RabbitMQ</p>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" placeholder="Your Name..." required />
          <label>Email</label>
          <input type="email" placeholder="Your Email.." required />
          <label>Message</label>
          <input type="text" placeholder="Your Message" required />
          <span>Email sender : rifkiilhamlutfika.dev@gmail.com</span>
          <button type="submit" disabled={disabled ? true : false}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
