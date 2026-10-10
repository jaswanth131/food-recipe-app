
const defaultRecipes = [
    {
        id: 1,
        name: "Veg Biryani",
        cuisine: "Indian",
        diet: "Vegetarian",
        ingredients: ["Rice", "Vegetables", "Spices"],
        instructions: "1. Cook rice.\n2. Saute vegetables with spices.\n3. Layer rice and vegetables.\n4. Cook on low flame for 15 minutes.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
        rating: 4.5
    },
    {
        id: 2,
        name: "Margherita Pizza",
        cuisine: "Italian",
        diet: "Vegetarian",
        ingredients: ["Pizza dough", "Tomato sauce", "Cheese"],
        instructions: "1. Prepare the pizza base.\n2. Spread tomato sauce.\n3. Add cheese.\n4. Bake until golden.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80",
        rating: 4.2
    },
    {
        id: 3,
        name: "Chicken Fried Rice",
        cuisine: "Chinese",
        diet: "Non-Vegetarian",
        ingredients: ["Rice", "Chicken", "Egg", "Soy sauce"],
        instructions: "1. Cook rice and chicken.\n2. Scramble the egg.\n3. Add rice and chicken.\n4. Mix with soy sauce.",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
        rating: 4.7
    },
    {
        id: 4,
        name: "Masala Dosa",
        cuisine: "Indian",
        diet: "Vegetarian",
        ingredients: ["Dosa batter", "Potatoes", "Onions", "Spices"],
        instructions: "1. Prepare potato masala.\n2. Spread dosa batter on a hot pan.\n3. Add masala.\n4. Fold and serve.",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
        rating: 4.8
    },
    {
        id: 5,
        name: "Chicken Tacos",
        cuisine: "Mexican",
        diet: "Non-Vegetarian",
        ingredients: ["Chicken", "Tortillas", "Tomatoes", "Lettuce"],
        instructions: "1. Cook chicken with spices.\n2. Warm tortillas.\n3. Add chicken and vegetables.\n4. Serve with sauce.",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
        rating: 4.3
    },
    {
        id: 6,
        name: "Paneer Butter Masala",
        cuisine: "Indian",
        diet: "Vegetarian",
        ingredients: ["Paneer", "Tomatoes", "Butter", "Cream"],
        instructions: "1. Prepare tomato gravy.\n2. Add butter and spices.\n3. Add paneer cubes.\n4. Mix in cream and cook.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        rating: 4.9
    }
];

// Get data from Local Storage
let recipes = JSON.parse(localStorage.getItem("recipes")) || defaultRecipes;
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Save recipes to Local Storage
function saveRecipes() {
    localStorage.setItem("recipes", JSON.stringify(recipes));
}

// Save users to Local Storage
function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

// Hide all main sections
function hideAll() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("homeSection").classList.add("hidden");
    document.getElementById("savedSection").classList.add("hidden");
    document.getElementById("addSection").classList.add("hidden");
}

// Show login
function showLogin() {
    hideAll();
    document.getElementById("loginSection").classList.remove("hidden");
}

// Show signup
function showSignup() {
    hideAll();
    document.getElementById("signupSection").classList.remove("hidden");
}

// Show home
function showHome() {
    hideAll();
    document.getElementById("homeSection").classList.remove("hidden");
    displayRecipes();
}

// Signup functionality
function signup(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;

    if (users.some(user => user.email === email)) {
        alert("Email already registered. Please login.");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        savedRecipes: [],
        ratings: {}
    };

    users.push(newUser);
    saveUsers();

    alert("Signup successful! Please login.");
    event.target.reset();
    showLogin();
}

// Login functionality
function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (user) {
        currentUser = {
            email: user.email,
            name: user.name
        };

        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Login successful!");
        document.getElementById("welcome").textContent =
            "Welcome, " + user.name + "!";

        event.target.reset();
        showHome();
    } else {
        alert("Invalid email or password!");
    }
}

// Logout functionality
function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");

    document.getElementById("welcome").textContent = "";
    alert("Logged out successfully!");
    showLogin();
}

// Get the logged-in user
function getLoggedInUser() {
    if (!currentUser) {
        alert("Please login first!");
        showLogin();
        return null;
    }

    return users.find(user => user.email === currentUser.email);
}

// Display recipe cards
function displayRecipes() {
    const container = document.getElementById("recipeContainer");

    if (!container) return;

    container.innerHTML = "";

    const search = document.getElementById("searchInput").value.toLowerCase();
    const cuisine = document.getElementById("cuisineFilter").value;
    const diet = document.getElementById("dietFilter").value;

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch =
            recipe.name.toLowerCase().includes(search) ||
            recipe.ingredients.join(" ").toLowerCase().includes(search);

        const matchesCuisine = !cuisine || recipe.cuisine === cuisine;
        const matchesDiet = !diet || recipe.diet === diet;

        return matchesSearch && matchesCuisine && matchesDiet;
    });

    if (filteredRecipes.length === 0) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    filteredRecipes.forEach(recipe => {
        container.appendChild(createRecipeCard(recipe));
    });
}

// Create a recipe card
function createRecipeCard(recipe) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const img = document.createElement("img");
    img.src = recipe.image || "https://placehold.co/600x400?text=Recipe";
    img.alt = recipe.name;

    img.onerror = function() {
        this.src = "https://placehold.co/600x400?text=Recipe";
    };

    const content = document.createElement("div");
    content.className = "recipe-content";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const cuisine = document.createElement("p");
    cuisine.textContent = "Cuisine: " + recipe.cuisine;

    const diet = document.createElement("p");
    diet.textContent = "Diet: " + recipe.diet;

    const ingredients = document.createElement("p");
    ingredients.textContent =
        "Ingredients: " + recipe.ingredients.join(", ");

    const instructions = document.createElement("p");
    instructions.textContent =
        "Instructions: " + recipe.instructions;

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.textContent = "⭐ Rating: " + getAverageRating(recipe);

    const saveButton = document.createElement("button");
    saveButton.textContent = "❤️ Save";
    saveButton.onclick = () => saveRecipe(recipe.id);

    const rateButton = document.createElement("button");
    rateButton.textContent = "⭐ Rate";
    rateButton.onclick = () => rateRecipe(recipe.id);

    content.append(
        title, cuisine, diet, ingredients,
        instructions, rating, saveButton, rateButton
    );

    card.append(img, content);
    return card;
}

// Save recipe to user's collection
function saveRecipe(recipeId) {
    const user = getLoggedInUser();
    if (!user) return;

    if (!user.savedRecipes) {
        user.savedRecipes = [];
    }

    if (user.savedRecipes.includes(recipeId)) {
        alert("Recipe already saved!");
        return;
    }

    user.savedRecipes.push(recipeId);
    saveUsers();

    alert("Recipe saved successfully!");
}

// Show saved recipes
function showSaved() {
    const user = getLoggedInUser();
    if (!user) return;

    hideAll();
    document.getElementById("savedSection").classList.remove("hidden");

    const container = document.getElementById("savedContainer");
    container.innerHTML = "";

    const savedRecipes = recipes.filter(recipe =>
        (user.savedRecipes || []).includes(recipe.id)
    );

    if (savedRecipes.length === 0) {
        container.innerHTML = "<p>No saved recipes yet.</p>";
        return;
    }

    savedRecipes.forEach(recipe => {
        container.appendChild(createRecipeCard(recipe));
    });
}

// Add a new recipe
function showAddForm() {
    const user = getLoggedInUser();
    if (!user) return;

    hideAll();
    document.getElementById("addSection").classList.remove("hidden");
}

function addRecipe(event) {
    event.preventDefault();

    const user = getLoggedInUser();
    if (!user) return;

    const name = document.getElementById("recipeName").value.trim();
    const cuisine = document.getElementById("recipeCuisine").value.trim();
    const diet = document.getElementById("recipeDiet").value;

    const ingredients = document.getElementById("recipeIngredients")
        .value.split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

    const instructions = document.getElementById("recipeInstructions").value.trim();
    const image = document.getElementById("recipeImage").value.trim();

    const newRecipe = {
        id: Date.now(),
        name: name,
        cuisine: cuisine,
        diet: diet,
        ingredients: ingredients,
        instructions: instructions,
        image: image || "https://placehold.co/600x400?text=Recipe",
        rating: 0,
        ratings: {},
        submittedBy: user.email
    };

    recipes.push(newRecipe);
    saveRecipes();

    alert("Recipe added successfully!");
    event.target.reset();
    showHome();
}

// Rating functionality
function getAverageRating(recipe) {
    const ratings = Object.values(recipe.ratings || {});

    if (ratings.length === 0) {
        return recipe.rating || "Not rated";
    }

    const total = ratings.reduce((sum, value) => sum + value, 0);
    return (total / ratings.length).toFixed(1);
}

function rateRecipe(recipeId) {
    const user = getLoggedInUser();
    if (!user) return;

    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    if (!recipe.ratings) {
        recipe.ratings = {};
    }

    const rating = Number(prompt("Enter your rating from 1 to 5:"));

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        alert("Please enter a number between 1 and 5.");
        return;
    }

    recipe.ratings[user.email] = rating;

    saveRecipes();

    alert("Thank you for rating this recipe!");
    displayRecipes();
}

// Initialize app
function initializeApp() {
    if (!localStorage.getItem("recipes")) {
        saveRecipes();
    }

    if (currentUser) {
        const user = users.find(u => u.email === currentUser.email);

        if (user) {
            document.getElementById("welcome").textContent =
                "Welcome, " + user.name + "!";
            showHome();
        } else {
            currentUser = null;
            localStorage.removeItem("currentUser");
            showLogin();
        }
    } else {
        showHome();
    }
}

initializeApp();