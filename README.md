React Developer Intern Assignment

This repository contains the implementation of the React Developer Intern assignment.
All tasks are implemented in a single React application, accessible via tab-based navigation.

📦 Tech Stack

React (with Hooks)

Vite (for fast development)

JavaScript (ES6+)

CSS (inline styles for clarity & simplicity)

🖥️ How to Run the Project Locally
Prerequisites

Node.js version: >= 18.x (recommended)

Steps

Clone the repository:

git clone <your-github-repo-url>
cd react-intern-assignment


Install dependencies:

npm install


Start the development server:

npm run dev


Open the URL shown in terminal (usually):

http://localhost:5173

📌 Application Structure

Each task is implemented as a separate tab inside the application:

Task 1: Todo App

Task 2: Form Handling & Password Toggle

Task 3: Progress Bar System

Task 4: Advanced Countdown Timer

Task 5: Live Search with Highlighting

This approach allows reviewers to easily test all tasks in one place.

✅ Task Breakdown & Features
📝 Task 1: Todo App

Core Features

Add tasks using a form

Display task list using component mapping

Delete tasks

Mark tasks as completed

Advanced Features

Data persistence using localStorage

Filter tasks (All / Active / Completed)

Priority selection (Low / Medium / High)

Optional sorting by priority

🧾 Task 2: Form Handling & Password Toggle

Controlled inputs for:

Name

Email

ID

Password

Prevents page reload on submit

Inline validation:

All fields required

Valid email format

Show / Hide password toggle

Displays submitted data below the form

Clears form after successful submission

📊 Task 3: Progress Bar System

Multiple numeric inputs (0–100)

Main progress bar updates dynamically

Sub-bars for each input

Input value clamping:

Less than 0 → set to 0

Greater than 100 → set to 100

Animated progress bar fill

Color rules:

Red: < 40%

Orange: 40–70%

Green: > 70%

⏱️ Task 4: Advanced Countdown Timer

Input for starting time (default: 10 seconds)

Accepts only positive integers

Input disabled while timer is running

Controls:

Start

Pause

Resume

Reset

Button states update dynamically

Displays remaining time with milliseconds

Timer states:

Idle

Running

Paused

Completed

When timer reaches 0:

Stops automatically

Displays “Time’s up!”

Start button hides permanently

Persistent timer state:

Timer resumes correctly after page refresh

🔍 Task 5: Live Search with Highlighting

Search through a predefined list of names

Case-insensitive search

Displays count of matching results

Shows “No matches found” when applicable

Highlights matching text in bold

Supports highlighting multiple occurrences in a name

🧠 Assumptions & Design Decisions

Progress Bar:
The main progress bar represents the average of all input values.

Countdown Timer:
Once the timer completes, the Start button is permanently hidden, as explicitly required.

Styling:
Inline styles were used intentionally for:

Faster readability

Easier review

Clear state-to-UI mapping

Routing:
Tabs were used instead of routing to keep the assignment simple and focused.

⚠️ Limitations / Trade-offs

No external UI libraries were used (to keep logic explicit).

Inline styles may be replaced with CSS Modules or Tailwind in production.

Timer persistence uses localStorage, which is sufficient for this assignment scope.

🧪 Code Quality Notes

Modular and reusable components

Clean state management using React hooks

Meaningful variable and function naming

Defensive coding for edge cases (invalid input, refresh persistence)

📤 Submission

GitHub Repository Link (as requested)

Complete README.md

All tasks implemented within the given timeline

🙌 Thank You

Thank you for reviewing this assignment.
I focused on clarity, correctness, and robustness, ensuring each requirement is met explicitly.
