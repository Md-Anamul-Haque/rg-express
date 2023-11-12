import ejs from 'ejs';
export const handleStudio_ApiList = async ({ apiUrls }: { apiUrls: string[] }) => {
    const ejsdata = `
    
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rg apis</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .container {
            display: grid;
            justify-content: center;
            margin: 0 auto;
            padding: 15px 10px 0 10px;
        }

        ul {
            min-width: 320px;
            min-height: 100vh;
        }

        ul li {
            padding-top: 5px;
            border-radius: 5px;
            margin: 2px;
            display: flex;
            width: 100%;
        }

        ul li:has(>a) {
            background-color: #52dc2c21;
            border-radius: 5px;
            text-decoration: none;
            width: 100%;
        }

        ul li span {
            display: inline;
            border-radius: 5px;
        }

        span.GET,
        span.POST,
        span.PUT,
        span.PATCH,
        span.DELETE,
        span.HEAD {
            text-transform: uppercase;
            text-overflow: clip;
        }

        span.GET {
            background-color: rgba(111, 240, 145, 0.434);
            color: green;
        }

        ul li a {
            text-decoration: none;
            width: 100%;

            &:hover {
                text-decoration: underline;
            }
        }

        p {
            display: inline-block;
        }
    </style>
</head>

<body>
    <div class="container">
        <ul>
            <% apiUrls?.forEach(function(item) { %>
                <% if (/^get:/i.test(item)) { %>
                    <li>
                        <span class="<%= item.split(':')?.[0]?.toUpperCase() %>">
                            <%= item.split(':')?.[0] %>:
                        </span>
                        <a class="<%= item.split(':')?.[0]?.toUpperCase() %>"
                            href="<%= item.split(':').slice(1).join('/').replace('//','/') %>">
                            <%= item.replace(/^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD|CONNECT|TRACE|COPY|LOCK|MOVE|UNLOCK|PROPFIND|PROPPATCH|MKCOL|CHECKOUT|SEARCH):/i,'') %>
                        </a>
                    </li>
                    <% } else { %>
                        <li>
                            <span class="<%= item.split(':')?.[0]?.toUpperCase() %>">
                                <%= item.split(':')?.[0] %>:
                            </span>
                            <p class="<%= item.split(':')?.[0]?.toUpperCase() %>">
                                <%= item.replace(/^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD|CONNECT|TRACE|COPY|LOCK|MOVE|UNLOCK|PROPFIND|PROPPATCH|MKCOL|CHECKOUT|SEARCH):/i,'') %>
                            </p>
                        </li>
                        <% } %>
                            <% }); %>
        </ul>
    </div>
</body>

</html>

    `
    // Render the EJS template with data
    const renderedHtml = ejs.render(ejsdata, { apiUrls });
    // return the rendered HTML
    return (renderedHtml);
}

