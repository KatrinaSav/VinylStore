# Vinyl Store

This is an implementation of a Vinyl store, developed as the final project for the LeverX course.

## Stack

- [x] Node.js 20+
- [x] Nest.js
- [x] TypeScript
- [x] Database (NoSQL / SQL): PostrgeSQL
- [x] ORM: TypeORM
- [ ] Unit and Integration Testing: NestJs: Testing + Jest
- [x] Deployment:
- [x] Swagger Documentation
- [x] Single Sign-On (SSO) with Google
- [x] Code Formatting and Quality Assurance (Prettier + ESLint + Git Hooks)
- [x] Payment Integration with Stripe
- [x] Email Sending (Using Nodemailer)
- [x] Configuration Service (Instead of dotenv package)
- [x] Initial Data Migration

## Installation

To run the project locally, you need to have [node.js 20 +](https://nodejs.org/en/download) installed and [PostrgeSQL](https://www.postgresql.org/download/) .

1.  Clone the project repository and navigate to the project's root folder:

```bash
$ git clone https://github.com/KatrinaSav/VinylStore.git

$ cd VinylStore
```

2.  Install all dependencies:

```bash
$ npm i
```

3.  Create and configure a .env file. You can use the provided [](.env.example) as a template.

### Running the app:

```bash
# development

$  npm  run  start

# watch mode

$  npm  run  start:dev

# production mode

$  npm  run  start:prod
```

### Test

```bash
# unit tests

$  npm  run  test
```

## Documentation

The API documentation is provided using Swagger. Once the application is running, access Swagger UI via `http://your_domain/api` in your browser.

### Deployment

API for vinyl record store is availiable on Heroku: `https://vinyl-store-01-d649f2e8fe3b.herokuapp.com/vinyl-records`.

## Acceptance Criteria

- [x] **User Authentication:**
  - Users should be able to log in to the system using Google or other SSO providers.
  - Admins should also have the capability to log in using SSO.
- [x] **Logout Functionality:**
  - Both Admins and Users should be able to log out from the system.
- [x] **Accessing Vinyl List:**
  - Users should have access to the vinyl list without requiring authorization.
  - The vinyl list should display details such as price, name, author name, description, the first review from another user, and the average score based on reviews.
  - Records should be paginated for better navigation.
- [x] **User Profile Management:**
  - Authenticated users should be able to view their profiles, including details such as first name, last name, birthdate, avatar, their reviews, and purchased vinyl records.
  - Users should have the ability to edit their profiles, including updating first name, last name, birthdate, and avatar.
  - Authenticated users should also have the option to delete their profiles.
- [x] **Purchase Process:**
  - Authenticated users should be able to purchase vinyl using Stripe.
  - Users should receive email notifications about their payments.
- [x] **Admin Functionality:**
  - Admins should be able to add new vinyl records to the store, including details like author name, name, description, image, and price.
  - Admins should have the capability to edit and delete records in the store.
- [x] **Search and Sorting:**
  - Authenticated users should be able to search for vinyl records by name and author name.
  - Users should have the option to sort vinyl records by price, name, and author name.
- [x] **Review System:**
  - Authenticated users should be able to add reviews (including comments and vinyl scores) to vinyl records.
  - Admins should be able to delete reviews.
  - Users should be able to view all reviews of a vinyl record, with pagination for better navigation.
- [x] **System Logs:**
  - Admins should have access to view logs of the system, including all create, update, and delete actions for all entities.

### Optional Tasks:

- [x] **Integration with Discogs (https://www.discogs.com/developers) for:**
  - Initial migration of vinyl records.
  - Adding vinyl records from Discogs to the system (restricted to Admins).
- [x] **Integration with Telegram:**
  - Integration with Telegram for posting vinyl records to channels, including details like name, link to the store, and price.
