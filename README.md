# Heartware

## Overview
Heartware is a modular, glassmorphic, patient-centered care platform built on the Sofie-Systems UI/UX foundation. It features:
- Extension-based architecture for holistic wellness, health metrics, mindfulness, nutrition, movement, medication, care team, self-care, biofeedback, records, and emergency.
- Modern glassmorphism UI with full accessibility and responsive design.
- User profile/settings for personalization and extension management.

## Getting Started
1. `npm install`
2. `npm start`
3. Visit `http://localhost:3000` and log in or explore as a guest.

## Main Features
- **Home:** Card-based dashboard for all extensions.
- **Profile:** Manage user info, theme, and enabled extensions.
- **Extensions:** Each health/wellness area is a modular dashboard (see `/src/extensions`).
- **Accessibility:** WCAG-compliant, keyboard navigation, dark mode, reduced motion support.

## Folder Structure
- `src/pages/` — Main routes (Home, Profile, each extension dashboard)
- `src/extensions/` — Modular extension logic and UI
- `src/theme/` — Glassmorphism theme components
- `src/components/` — Shared UI components

## Security & Privacy
- User data is local by default. Integrate with secure APIs for production.
- Authentication/authorization can be added via OAuth, JWT, or your preferred method.

## Customization
- Add/disable extensions in Profile.
- Theming via Tailwind and `GlassmorphismTheme.js`.

## Contributing
Pull requests and feedback are welcome!

## License
MIT
# sofie-systems

Sofie Systems UI — the user interface layer of the S.O.F.I.E. Protocol.

This project is part of a modular ecosystem for **Harmonic Habitats**, focused on emotional intelligence and decentralized infrastructure for energy, food, water, shelter, and governance.

## 🧠 Project Overview

The S.O.F.I.E. system leverages a living systems architecture to create adaptive, emotionally aware, and sustainable solutions. This UI provides the frontend interface for interacting with:

- Emotional AI modules
- Environmental data streams
- Mesh governance tools
- Sustainable resource dashboards

## 🛠️ Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/DudeAdrian/sofie-systems.git
cd sofie-systems-ui
npm install
npm start
