# Strategic Management Dashboard

This is a React-based single-page application for a Strategic Management Dashboard. It allows users to navigate through Strategic Themes, Objectives, Key Results, and Goals.

## Project Structure

- `src/app`: Contains the main page component
- `src/components`: Contains reusable components (StrategicThemes, Objectives, KeyResults, Goals, Layout)
- `src/pages`: Contains page components for routing

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

To create a production build and export static files:

```
npm run build
```

This will create a static export in the `out` directory, which can be easily deployed to any static hosting service.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS

## API Integration

The application is set up to fetch data from an API. Replace the placeholder API calls in the components with actual API endpoints when integrating with a backend.

## Deployment

The static files generated in the `out` directory can be deployed to any static file hosting service. Make sure to configure your hosting service to serve the `index.html` file for all routes to support client-side routing.

## Further Improvements

- Implement error boundaries for better error handling
- Add unit tests for components and pages
- Implement server-side rendering for improved SEO, if required
- Add authentication and authorization for protected routes

For more information on Next.js, check out the [Next.js Documentation](https://nextjs.org/docs).
