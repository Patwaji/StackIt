export const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{{SUBJECT}}</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
      background-color: #121212;
      color: #e0e0e0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #1e1e1e;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #333;
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 25px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 30px 40px;
      color: #f5f5f5;
    }
    .content p {
      margin-bottom: 20px;
      font-size: 16px;
    }
    .highlight {
      background-color: #2a2a2a;
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      padding: 10px 20px;
      display: inline-block;
      border-radius: 6px;
      margin: 10px 0;
      letter-spacing: 2px;
      border: 1px dashed #555;
      text-align: center;
    }
    .instructions {
      font-size: 14px;
      color: #bbbbbb;
    }
    .footer {
      background-color: #181818;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      border-top: 1px solid #333333;
    }
    .footer p {
      margin: 5px 0;
    }
    .center-text {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>StackIt</h1>
    </div>
    <div class="content">
      <p>{{GREETING}}</p>
      <p>{{MAIN_MESSAGE}}</p>
      {{#if HIGHLIGHT_CONTENT}}
      <div class="center-text">
        <span class="highlight">{{HIGHLIGHT_CONTENT}}</span>
      </div>
      {{/if}}
      <p class="instructions">{{SECONDARY_MESSAGE}}</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} StackIt. All rights reserved.</p>
      <p>Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;
