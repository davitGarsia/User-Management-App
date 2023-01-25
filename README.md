# UserManagementApp

The application helps manage users' personal data. The data is fetched and displayed in the form of table as soon as the application
is loaded.
User can filter users instantly with 'Search Users' form at the top.
Clicking on first name, last name, email and status headers filters data and arranges it respectively.
Clicking on each user's email field opens the edet field with the respective user's data in the form.
Deleting functionality comprises of dialogue-based assurance that the user is trully willing to delete certain user from the database.

The add button opens the field enabling the user to input and store data. Every field in the form is compulsory except id. User can only 
have one status but multiple roles. Roles to choose from are fetched from server and rendered after clickiing/typing in the field.
If all the fields are valid, 'save' button saves the user and the sidenav is hidden.
'Cancel' and X button in the sidenav form hide and reset the form.







This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
