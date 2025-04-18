# Digital Time Capsule

The **Digital Time Capsule** is a web application that allows users to create, manage, and interact with virtual time capsules. Users can add memories, set future open dates, and upload files to their capsules. The project is built using modern web technologies and follows a modular architecture for scalability and maintainability.

## Features

- **Create Time Capsules**: Users can create time capsules with a title, description, and a future open date.
- **Upload Memories**: Files can be uploaded and associated with specific capsules.
- **View Capsules**: Users can view capsule details, including uploaded files and metadata.
- **Delete Capsules**: Capsules can be deleted when no longer needed.
- **Download Memories**: Users can download all files associated with a capsule as a ZIP archive.
- **Search and Filter**: Capsules can be searched and filtered by title, status, or other criteria.
- **Offline Support**: Changes made while offline are queued and synced when the user reconnects.
- **Real-Time Updates**: Capsule statistics are updated in real-time using WebSockets.

## Technologies Used

### Frontend
- **React**: For building the user interface.
- **Next.js**: For server-side rendering and routing.
- **Tailwind CSS**: For styling and responsive design.
- **Chart.js**: For visualizing capsule statistics.

### Backend
- **Node.js**: For the server-side runtime.
- **Express.js**: For building the REST API.
- **PostgreSQL**: For managing the database.
- **Multer**: For handling file uploads.
- **Archiver**: For creating ZIP archives of capsule memories.

### Other Tools
- **Socket.IO**: For real-time communication.
- **Winston**: For logging server activity.
- **Jest**: For unit testing both frontend and backend components.
- **Supertest**: For testing API endpoints.

## Project Structure

### Frontend
- **Components**: Reusable UI components like `CapsuleCard`, `CreateCapsuleModal`, and `ViewCapsuleModal`.
- **Pages**: Next.js pages, including the main `Home` page.
- **Styles**: Global styles managed with Tailwind CSS.

### Backend
- **Controllers**: Business logic for handling requests (e.g., `fileController.js`).
- **Routes**: API endpoints for capsules and file operations.
- **Services**: Database interaction and utility functions (e.g., `capsuleService.js`, `fileService.js`).
- **Middlewares**: Custom middleware for logging and request handling.

### Database
- **PostgreSQL**: Used to store capsule metadata and file information.

## Key Functionalities

### Capsule Management
- Capsules are created with a title, description, and open date.
- Capsules can be filtered by status (`Locked` or `Unlocked`) and searched by title.

### File Upload and Download
- Users can upload multiple files to a capsule.
- Files are stored on the server and can be downloaded as a ZIP archive.

### Real-Time Updates
- Capsule statistics (e.g., number of locked/unlocked capsules) are updated in real-time using WebSockets.

### Offline Support
- Actions performed while offline are queued and synced when the user reconnects.

## Testing

- **Frontend Tests**: Written using Jest and React Testing Library. Tests cover components like `ViewCapsuleModal` and `CreateCapsuleModal`.
- **Backend Tests**: API endpoints are tested using Jest and Supertest.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL