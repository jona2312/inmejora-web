# Documentation: New Portfolio Sections

This document details the implementation and customization of the **Proyectos Destacados** and **Transformaciones Reales** sections.

## 1. Component Structure

### ProyectosDestacados.jsx
*   **Purpose:** Displays a curated grid of finished projects.
*   **Features:**
    *   Responsive Grid (1col mobile, 2col tablet, 3col desktop).
    *   Hover effects (Image zoom, overlay text).
    *   Click-to-open **ProjectModal**.
*   **Data Source:** `src/data/projectsData.js` -> `featuredProjects` array.

### TransformacionesReales.jsx
*   **Purpose:** Showcases Before/After transformations.
*   **Features:**
    *   Interactive slider (Draggable mouse/touch).
    *   Responsive Grid.
    *   "Ver Más Portfolios" button linking to Instagram.
*   **Data Source:** `src/data/projectsData.js` -> `transformationsData` array.
*   **Sub-component:** `BeforeAfterSlider.jsx` handles the sliding logic and rendering.

### ProjectModal.jsx
*   **Purpose:** Displays detailed view of a project when a card in `ProyectosDestacados` is clicked.
*   **Features:**
    *   Large image view.
    *   Project stats (Size, Duration, Style).
    *   Description text.
    *   Backdrop blur and animation.

## 2. Updating Data

All project data is centralized in `src/data/projectsData.js`.

### To Add a Featured Project:
1.  Open `src/data/projectsData.js`.
2.  Add a new object to the `featuredProjects` array: