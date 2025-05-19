This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# UML Diagrams for Caly Calendar App

This folder contains UML diagrams for the Caly Calendar application architecture. The diagrams are created using DrawIO and show the different layers of the application.

## Diagrams Included

### 1. Model Layer (model-layer.drawio)

This diagram shows the core data models and their relationships in the application:

- User
- Calendar
- Event
- ColorCode
- GoogleCalendarIntegration
- Subscription

### 2. ViewModel Layer (viewmodel-layer.drawio)

This diagram illustrates the classes that handle data manipulation and business logic:

- CalendarViewModel
- CalendarUtilsViewModel
- AuthViewModel
- UserViewModel
- GoogleCalendarViewModel
- ColorCodeViewModel
- SubscriptionViewModel

### 3. Extensions (extensions.drawio)

This diagram covers important application extensions:

- Asynchronous Process Flow
- XML File Storage
- SQL Injection Protection

## Key Model Classes

### User

The User class represents a user in the system:

```javascript
// User model
{
  id: string,
  email: string,
  createdAt: DateTime,
  customerId: string,
  variantId: string,
  hasAccess: boolean,
  role: string // "client" or "admin"
}
```

### Event

The Event class represents a calendar event:

```javascript
// Event model
{
  id: string,
  title: string,
  description: string,
  startDate: DateTime,
  endDate: DateTime,
  startTime: string,
  endTime: string,
  calendarId: string,
  color: string
}
```

## Key ViewModel Processes

### Asynchronous Data Fetching

The application uses async/await for asynchronous operations:

```javascript
async function fetchCalendarAndEvents() {
  if (!user) return;

  setIsLoading(true);
  try {
    // Fetch calendar and user data in parallel
    const [calendarData, hasGoogleCalendarAccess] = await Promise.all([
      fetchCalendar(),
      checkGoogleCalendarAccess(),
    ]);

    // If we have both, fetch events in parallel
    if (calendarData && hasGoogleCalendarAccess) {
      fetchEventsInParallel(calendarData.id, forceGoogleRefresh);
    } else if (calendarData) {
      // Just fetch local events
      await fetchEvents(calendarData.id);
      setIsLoading(false);
    }
  } catch (error) {
    console.error("Error in fetchCalendarAndEvents:", error);
    setIsLoading(false);
  }
}
```

## Opening the Diagrams

To open and edit these diagrams:

1. Use [draw.io](https://app.diagrams.net/)
2. Open each .drawio file from this folder
3. Modify as needed and save

You can also use the desktop version of DrawIO for offline editing.
