# ExtraMovie

## Description

ExtraMovie is an Angular-based web application designed to provide a modular and scalable structure for building modern web applications. It leverages Angular CLI for development, scaffolding, and building, ensuring a streamlined development process.

## Table of Contents

- [ExtraMovie](#extramovie)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Contributing](#contributing)
  - [Acknowledgements](#acknowledgements)
  - [File Structure](#file-structure)

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd extra-movie
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:4200/`.

## Usage

To use the project:

- Run the development server as described in the [Installation](#installation) section.
- Modify the source files in the `src/` directory to customize the application.
- Use Angular CLI commands to generate new components, services, or modules:
  ```bash
  ng generate component component-name
  ```

## Features

- Modular and scalable architecture.
- Predefined layouts and reusable components.
- Routing with lazy loading support.
- Tailwind CSS integration for styling.
- DaisyUI for pre-designed UI components.
- Error handling with dedicated error pages.

## Technologies Used

- **Languages**: TypeScript, HTML, CSS
- **Framework**: Angular
- **Styling**: Tailwind CSS, DaisyUI
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## Contributing

We welcome contributions to improve ExtraMovie. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push your changes to your fork:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request with a detailed description of your changes.

## Acknowledgements

- [Angular CLI](https://github.com/angular/angular-cli) for providing a robust development environment.
- [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/) for styling and UI components.
- The open-source community for their invaluable tools and resources.

## File Structure

The project is organized as follows:

```
angular.json
package.json
README.md
tsconfig.app.json
tsconfig.json
public/
    favicon.ico
src/
    index.html
    main.ts
    styles.css
    app/
        app.component.css
        app.component.html
        app.component.ts
        app.config.ts
        app.routes.ts
        components/
        directives/
        layouts/
            nav-layout/
                nav-layout.component.html
                nav-layout.component.ts
        pages/
            error/
                error.component.html
                error.component.ts
            home/
                home.component.html
                home.component.ts
            not-found/
                not-found.component.html
                not-found.component.ts
        services/
```

This structure ensures modularity and scalability, making it easier to maintain and extend the application.
