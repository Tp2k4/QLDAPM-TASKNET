# TaskNet Frontend Refactor

## Overview
TaskNet is a task management application built with React and TypeScript. This project allows users to create, edit, delete, and manage tasks efficiently. The application features a clean and user-friendly interface, leveraging Tailwind CSS for styling.

## Features
- **Task Management**: Add, edit, and delete tasks with ease.
- **Filtering**: View tasks based on their status (completed, pending, in-progress).
- **Pagination**: Navigate through tasks with pagination controls.
- **Statistics Panel**: View statistics for completed and pending tasks.
- **Responsive Design**: The application is designed to be responsive and user-friendly on various devices.

## Project Structure
```
task-net-frontend-refactor
├── src
│   ├── index.tsx          # Entry point of the application
│   ├── App.tsx            # Main application component
│   ├── main.css           # Main CSS styles
│   ├── components          # Reusable components
│   │   ├── Header.tsx     # Header component
│   │   ├── TaskForm.tsx   # Form for adding new tasks
│   │   ├── TaskList.tsx    # Component to display list of tasks
│   │   ├── TaskItem.tsx   # Component for individual task item
│   │   ├── StatsPanel.tsx  # Component for displaying task statistics
│   │   ├── Pagination.tsx  # Component for pagination controls
│   │   └── Modal.tsx      # Component for modal dialogs
│   ├── hooks               # Custom hooks
│   │   └── useTasks.ts    # Hook for task management logic
│   ├── types               # TypeScript types
│   │   └── index.ts       # Type definitions
│   ├── utils               # Utility functions
│   │   └── date.ts        # Date manipulation functions
│   └── styles              # Stylesheets
│       └── tailwind.css    # Tailwind CSS styles
├── package.json            # NPM dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Getting Started
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd task-net-frontend-refactor
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.