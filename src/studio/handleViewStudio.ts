
export const handleViewStudio = () => {
    return (
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>rg-studio</title>
            <style>
              * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
              }
              .container {
                display: grid;
                justify-content: center;
                margin: 0 auto;
                padding: 15px 10px 0 10px;
              }
              h1 {
                text-align: center;
              }
              .card {
                border-radius: 3px;
                box-shadow: 2px 3px 4px papayawhip;
                display: inline-block;
                padding: 5px;
                margin: 10px 5px;
              }
              .get {
                color: green;
                text-transform: uppercase;
                text-overflow: clip;
                background-color: rgba(111, 240, 145, 0.434);
                padding: 5px;
              }
              .apis-link {
                text-align: center;
                width: 100%;
                font-size: medium;
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bold;
                text-decoration: none;
                color: rgba(0, 0, 255, 0.858);
                padding: 5px;
                &:hover {
                  text-decoration: underline;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>RG-express(studio)</h1>
              <div class="card">
                <ul>
                  <li>
                    <span class="get">get:</span>
                    <a class="apis-link" href="/_rg/studio/apis">get all apis</a>
                  </li>
                  <li>...</li>
                </ul>
              </div>
              <div class="card">
                <h3>comming sone...</h3>
              </div>
            </div>
          </body>
        </html>       

`
    )
}
