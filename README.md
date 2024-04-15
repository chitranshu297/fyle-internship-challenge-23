# Project: GitHub User Search

## Overview

This project is designed to search for GitHub usernames and display user details along with their repositories in a paginated manner.

## How to Run Locally

Follow these steps to run the project on your local machine:

1\. Install dependencies using `npm install -f`.

2\. Run the Angular project using `ng serve`.

3\. After building, navigate to the `/home` page in your browser. Here, you'll find an input box to search for a GitHub username. Enter the username you want to search for and click the search button.

4\. If the username is valid, you will be directed to the user detail page where you can see the list of repositories. The repository list is paginated.

## Running Test Cases

To run the test cases successfully, follow these steps:

1\. Install dependencies using `npm install`.

2\. Run the command `ng test --include src/app/components/repo-list/repo-list.component.spec.ts --code-coverage` in your terminal.

3\. After running the test cases, you can view the line coverage report by navigating to `/coverage/fyle-frontend-challenge/components/repo-list/index.html`.

## Note

Ensure you have Node.js and Angular CLI installed on your machine before running the project and test cases. You can install Node.js from [here](https://nodejs.org/) and Angular CLI using `npm install -g @angular/cli`.

---
