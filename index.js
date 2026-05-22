import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// In-memory storage
let posts = [];
let currentId = 1;


// ================= ROUTES ================= //

// 🏠 Home Page
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});


// ➕ Show Create Form
// 🍳 Recipes Page
app.get("/recipes", (req, res) => {
  const search =
    req.query.search?.toLowerCase() || "";
  const filter =
    req.query.filter || "all";
  let filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(search);
    const matchesFilter =
      filter === "all" ||
      post.mealType === filter;
    return matchesSearch && matchesFilter;
  });
  res.render("recipes.ejs", {
    posts: filteredPosts,
    search,
    filter
  });

});

// ➕ Handle Create
app.post("/submit", (req, res) => {
  const {
    title,
    ingredients,
    steps,
    mealType,
    course,
    imageUrl
  } = req.body;

  const newPost = {
    id: currentId++,
    title,
    ingredients,
    steps,
    mealType,
    course,
    imageUrl
  };

  posts.push(newPost);

  res.redirect("/recipes");
});

// 📖 View Single Post
app.get("/post/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);

  if (!post) {
    return res.send("Post not found");
  }

  res.render("post.ejs", { post });
});


// ✏️ Show Edit Page
app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);

  if (!post) {
    return res.send("Post not found");
  }

  res.render("edit.ejs", { post });
});

// ✏️ Handle Edit
app.post("/edit/:id", (req, res) => {
  const post =
    posts.find(p => p.id == req.params.id);

  if (!post) {
    return res.send("Post not found");
  }
  // UPDATE ALL FIELDS
  post.title = req.body.title;
  post.ingredients = req.body.ingredients;
  post.steps = req.body.steps;
  post.mealType = req.body.mealType;
  post.course = req.body.course;
  post.imageUrl = req.body.imageUrl;

  res.redirect("/post/" + post.id);

});
// 🗑 Delete Post
app.post("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== id);

  res.redirect("/recipes");
});

// ℹ️ About Page
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// 🚀 Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});