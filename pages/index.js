import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { resolve } from "styled-jsx/css";
import twitterLogo from "../assets/twitter.webp";
const Home = () => {
  //setting max retries
  const maxRetries = 20;
  //numbers of retries
  const [retry, setRetry] = useState(0);
  //Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [input, setInput] = useState("");
  const [img, setImg] = useState("");
  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  //generation action
  const generateAction = async () => {
    console.log("Generating ...");
    // Add this to make sure there is no double click
    if (isGenerating && retry === 0) {
      //set loading has started
      setIsGenerating(true);
    }
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });
      setRetry(0);
    }
    //adding fetching request
    const response = await fetch("./api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg"
      },
      body: JSON.stringify({ input })
    });
    const data = await response.json();
    // If model still loading, drop that retry time
    if (response.status === 503) {
      // Set the estimated_time property in state
      setRetry(data.estimated_time);
      // console.log("Model is loading still :(.");
      return;
    }
    // if there is another drop the error
    if (!response.ok) {
      console.log(`Eror: ${data.error}`);
      // Stop loading
      setIsGenerating(false);
      return;
    }
    // Set image data into state property
    setImg(data.image);
    // everything is all done , stop loading
    setIsGenerating(false);
  };
  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };
  //add useEffect
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        return;
      }
      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);
      await generateAction();
    };
    if (retry === 0) {
      return;
    }
    runRetry();
  }, [retry]);
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
              <a
                className={
                  isGenerating ? "generate-button loading" : "generate-button"
                }
                onClick={generateAction}
              >
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
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
