import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import twitterLogo from "../assets/twitter.webp";

const Home = () => {
  const [input, setInput] = useState("");
  const [img, setImg] = useState("");

  const handleChange = (event) => {
    setInput(event.target.value);
  };
  //generation action
  const generateAction = async () => {
    console.log("Generating ...");
    //adding fetching request
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg"
      },
      body: JSON.stringify({ input })
    });
    const data = await response.json();
    // If model still loading, drop that retry time
    if (response.status === 503) {
      console.log("Model is loading still :(.");
      return;
    }
    // if there is another drop the error
    if (!response.ok) {
      console.log(`Eror: ${data.error}`);
    }
    // Set image data into state property
    setImg(data.image);
  };
  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>My AI Avatar picture generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>description of your generator</h2>
          </div>
          <div className="prompt-container">
            <input
              className="prompt-box"
              value={input}
              placeholder="type here"
              onChange={handleChange}
            />
            <div className="prompt-buttons">
              <a className="generate-button" onClick={generateAction}>
                <div className="generate">
                  <p>Generate</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://github.com/ronkips/ai-avatar-starter.git"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={twitterLogo} alt="twitter logo" />
            <p>my github repository</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
