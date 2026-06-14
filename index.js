let postsArray = [];
const titleInput = document.getElementById("post-title");
const bodyInput = document.getElementById("post-body");
const form = document.getElementById("new-post");

function renderPosts() {
  let html = "";
  for (let post of postsArray) {
    
    html += `
            <div class="feedback-card">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            </div>
        `;
  }
  document.getElementById("blog-list").innerHTML = html;
}

const dummyData = [
  {
    title: "Slack & Microsoft Teams Integration",
    body: "We run three product squads and check Signal manually every few days. Pushing new submissions and status changes directly into our team channels would make this part of our actual workflow instead of a separate tab we forget to open.",
  },
  {
    title: "Public Roadmap View",
    body: "Customers ask us weekly what's coming next. A read-only public view that surfaces approved requests and their current status would cut our support volume and close the loop with users who actually took the time to submit feedback.",
  },
  {
    title: "Upvoting & Request Merging",
    body: "We're seeing five versions of the same request submitted separately. Letting users upvote existing ideas — and giving admins a way to merge duplicates — would give us a far more accurate picture of what actually has demand.",
  },
  {
    title: "Custom Status Labels per Request",
    body: "Under Review, Planned, In Progress, Shipped. Right now there's no way to close the loop with the person who submitted. Even a simple status tag on each card would make Signal feel like a real feedback system rather than a suggestion box.",
  },
  {
    title: "Weighted Priority Score",
    body: "Raw vote count isn't enough signal. A paying enterprise customer requesting something should carry more weight than an anonymous submission. We need a scoring model that accounts for user tier, recency, and engagement — not just who clicked the most.",
  },
  {
    title: "REST API & Webhook Support",
    body: "We want to pipe every new submission directly into our internal Jira board and trigger a Zapier workflow for our PM team. A REST API or outbound webhook would let Signal fit into our existing stack without any manual steps.",
  },
  {
    title: "Role-Based Access Control",
    body: "Our executive team wants visibility without edit access. Our PMs need to tag and triage. Our customers should only be able to submit and upvote. Right now everyone has the same permissions, which limits how broadly we can roll this out.",
  },
  {
    title: "Weekly Digest Email for Admins",
    body: "A Friday summary showing new requests, vote movement, and anything that crossed a threshold that week would mean the product team stays informed without having to remember to check the board. Right now it's purely reactive.",
  },
  {
    title: "Duplicate Detection Before Submission",
    body: "Show similar existing requests as someone types their title, before they hit submit. This would keep the board clean, consolidate signal on popular ideas, and prevent the same request from appearing six times with different wording.",
  },
  {
    title: "SSO via Google Workspace & Okta",
    body: "Our company authenticates everything through Google Workspace. Asking the team to create separate Signal credentials is the single biggest reason adoption has stalled internally. SSO would remove that friction entirely.",
  },
];

postsArray = dummyData;
renderPosts();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const postTitle = titleInput.value;
  const postBody = bodyInput.value;
  const data = {
    title: postTitle,
    body: postBody,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch("https://apis.scrimba.com/jsonplaceholder/posts", options)
    .then((res) => res.json())
    .then((post) => {
      postsArray.unshift(post);
      renderPosts();
      titleInput.value = "";
      bodyInput.value = "";
    });
});

