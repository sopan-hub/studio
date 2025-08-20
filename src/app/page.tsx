
"use client";

import Script from 'next/script';
import Head from 'next/head';

export default function VismePage() {
  return (
    <>
      <Head>
        <title>Animated Login Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f0f0f0;
            overflow: hidden; /* Prevent scrollbars from layout shift */
          }
          /* The visme embed will create its own full-page container */
        `}</style>
      </Head>
      <main>
        {/* Note :- if the code is not run just open index.html into your broswer 
            and scroll on white screen using mouse and wait for 3 seconds.  you can 
            give the specific size to div for solve this problem or correct if on visme.co*/}

        {/* This form was created using Visme.co. You can design more forms 
            like this for free and embed them directly into your website! */}

        {/* Just goto visme.co 
            do signup
            click on from/serveys 
            then choose template 
            then customize it like character movement  and all
            then click on publish you will get a embadding code which you can used
            for embadding the login form into your website for free */}
        
        <div 
          className="visme_d" 
          data-title="Webinar Registration Form" 
          data-url="g7ddqxx0-untitled-project?fullPage=true" 
          data-domain="forms" 
          data-full-page="true" 
          data-min-height="100vh" 
          data-form-id="133190">
        </div>
        
        <Script src="https://static-bundles.visme.co/forms/vismeforms-embed.js" strategy="afterInteractive" />
      </main>
    </>
  );
}
