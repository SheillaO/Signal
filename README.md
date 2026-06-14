# Signal 📡
 
**Most teams lose feature requests in Slack threads and email chains.  
Signal is a lightweight public feedback board that captures them in one place;no backend, no framework, no build step.**

---
 
## Why This Exists
 
Tools like Canny, Productboard, and Upvote.so solve this problem well but charge $30–$50 per seat per month. For indie makers, early-stage startups, and small teams, that cost doesn't justify the core need: a place to submit ideas and see what others have asked for.
 
Signal strips the problem down to its minimum viable data contract — a `title` and a `body` — and builds around that.
 
---
## Architecture
 
Signal has no server, no database, and no build pipeline. It is three files and a REST API.
 
```
signal/
├── index.html      # structure and form markup
├── index.css       # layout and component styles
└── index.js        # all state, data fetching, and DOM rendering
```
 
All application state lives in a single array (`postsArray`). The UI is always a pure function of that array — every state change calls `renderPosts()`, which rebuilds the list from scratch. This is a simplified version of the unidirectional data flow pattern that React and Vue formalise: **state changes → render, never DOM → state.**
 
```
User submits form
      ↓
POST request fires
      ↓
API returns new post object
      ↓
postsArray.unshift(post)    ← state update
      ↓
renderPosts()               ← single re-render from source of truth
      ↓
DOM reflects new state
```
 
---
 
## Data Layer
 
Signal communicates with a REST API using the Fetch API and standard HTTP conventions — GET to read, POST to write.
 
**Reading existing requests:**
```js
fetch("https://apis.scrimba.com/jsonplaceholder/posts")
    .then(res => res.json())
    .then(data => {
        postsArray = data.slice(0, 5)
        renderPosts()
    })
```
 
**Writing a new request:**
```js
const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
        "Content-Type": "application/json"
    }
}
 
fetch("https://apis.scrimba.com/jsonplaceholder/posts", options)
    .then(res => res.json())
    .then(post => {
        postsArray.unshift(post)
        renderPosts()
    })
```
 
A few decisions worth noting:
 
**`Content-Type: application/json`** is required — without it, the server treats the request body as a plain string and the JSON deserialisation on the server side fails. This is a common source of silent POST failures.
 
**`JSON.stringify(data)`** serialises the JavaScript object into a JSON string for transport. The API returns a parsed object in the response, which gets pushed directly into state.
 
**`postsArray.unshift(post)`** prepends to the array rather than appending. This is a deliberate UX choice: the submission appears at position 0 so the user sees immediate confirmation that their action succeeded — an optimistic update pattern without the rollback complexity.
 
**`data.slice(0, 5)`** is not arbitrary. Rendering every post in an unbounded list creates DOM bloat and makes the board unscannable. Capping at five keeps the initial render fast and the content density intentional.
 
---
 
## Rendering Strategy
 
The DOM is updated through a single `renderPosts()` function that uses template literals to construct an HTML string and assigns it to `innerHTML`:
 
```js
function renderPosts() {
    let html = ""
    for (let post of postsArray) {
        html += `
            <div class="feedback-card">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            </div>
        `
    }
    document.getElementById("blog-list").innerHTML = html
}
```
 
This approach trades granular DOM diffing for simplicity. For a list of this size, a full re-render on every state change is imperceptibly fast and removes the need to track which nodes need updating — the same tradeoff React's virtual DOM makes, minus the framework overhead.
 
---
 
## Data Contract
 
The dummy data and the live API share the same object shape:
 
```js
{ title: String, body: String }
```
 
This is intentional. When the live API endpoint is swapped in, `renderPosts()` requires zero changes because the data contract is identical. The rendering layer is decoupled from the data source.
 
---
 
## Form Handling
 
```js
form.addEventListener("submit", function(e) {
    e.preventDefault()
    ...
})
```
 
`e.preventDefault()` intercepts the browser's native form submission, which would otherwise trigger a full page reload and a GET request to the current URL with form data serialised as query parameters. Preventing that default gives JavaScript full control over the submission lifecycle.
 
---
 
## Built With
 
- **HTML5** — semantic form elements, explicit `for`/`id` label associations for accessibility
- **CSS3** — fixed positioning for persistent nav, CSS Grid for form layout, `box-sizing: border-box` for predictable spacing
- **Vanilla JavaScript** — Fetch API, Promise chaining, array mutation, template literal rendering
- **Zero dependencies** — no npm, no bundler, no transpilation. Deployable by dragging a folder.
---
 
## Roadmap
 
Each item below is noted with what it would technically require:
 
- [ ] **Upvote counter** — extend the data model with a `votes` integer; use event delegation on `#blog-list` to handle clicks on dynamically rendered buttons without re-binding listeners
- [ ] **Client-side filtering** — filter `postsArray` by a `type` field before passing to `renderPosts()`, keeping the render function unchanged
- [ ] **Persistence via `localStorage`** — serialise `postsArray` to `localStorage` on every state change; deserialise on load before the fetch resolves, so the board populates instantly on return visits
- [ ] **Status tags** — add a `status` field to the data model; map values to CSS classes in the template literal for conditional styling
- [ ] **Authenticated submissions** — replace the open POST endpoint with a backend that validates a session token in the `Authorization` header before writing to a real database
---
 
## Run Locally
 
No install required.
 
```bash
git clone https://github.com/yourusername/signal
cd signal
open index.html
```
 
Deployable to Netlify, GitHub Pages, or any static host by pointing the publish directory at the repo root.
 
---
 
## Deployment Notes
 
Signal is a static site with no build step. Netlify configuration:
 
| Setting | Value |
|---|---|
| Build command | *(leave blank)* |
| Publish directory | *(leave blank or repo root)* |
| Functions directory | *(leave blank)* |
 