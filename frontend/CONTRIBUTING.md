# Contributing to TechCare Rwanda Frontend

Welcome! We appreciate your interest in contributing to the TechCare Rwanda frontend. By following these guidelines, you help us maintain a consistent and high-quality codebase.

## 1. Local Development Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Tech-Care-Rwanda/tech-care.git;
    cd frontend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 2. Git Workflow

We use a branch-based development model with specific naming conventions.

* **Main Branches**:
    * `dev`: Default development branch. All new work merges here first.
    * `staging`: For pre-production testing.
    * `main`: Production-ready code.

* **Branch Naming Conventions**:
    * `feature/<descriptive-name>`: For new features (e.g., `feature/user-onboarding`)
    * `chore/<descriptive-name>`: For maintenance or build tasks (e.g., `chore/update-dependencies`)
    * `bugfix/<descriptive-name>`: For bug fixes (e.g., `bugfix/login-issue`)
    * `hotfix/<descriptive-name>`: For urgent production fixes (merge directly to `main` and then to `dev`)

* **Commit Messages**:
    * Start with the branch type (e.g., `feat:`, `chore:`, `fix:`, `hotfix:`).
    * Keep the first line concise (50-72 characters).
    * Use imperative mood (e.g., "Add feature" not "Added feature").
    * (Optional) Add a blank line followed by a more detailed explanation.

* **Pull Requests (PRs)**:
    * Open PRs from your feature/bugfix branches to `dev`.
    * Provide a clear description of changes.
    * Ensure all automated checks pass before requesting review.
    * At least one approval is required before merging.

## 3. Coding Standards

* **Language**: TypeScript 
* **Styling**: Tailwind CSS 
* **Formatting**: Use Prettier (`npm run format`) before committing. Pre-commit hooks will help enforce this.
* **Linting**: Ensure `npm run lint` passes without errors or warnings. Pre-commit hooks will also run this.
* **Component Structure**: Components should be reusable and adhere to Next.js App Router conventions. 
* **Type Safety**: Prioritize strong typing using TypeScript. 
* **Comments**: Add clear comments for complex logic or non-obvious code sections.

## 4. Testing

* All new features require manual testing to ensure functionality across different devices and scenarios.
* Refer to the main project documentation for detailed testing procedures and performance metrics.

## 5. Documentation

* Update relevant documentation (e.g., README, API docs) for any new features or significant changes.
* Provide user guides for new functionalities.
