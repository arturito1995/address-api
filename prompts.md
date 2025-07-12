#### Inital Prompt For Overview

- typescript express {{ PASTED provided task: Your task is to design and implement a backend API...}}

#### Prompts based on ChatGPT suggested services: GoogleMaps and SmartyStreet

- what if i input address like "Mtn View, CA Amphitheatre Pkwy 1600 "
- what if CA Amphitheatre Pkwy Mtn View, 1600
- how can i get gmaps key
- what if i wanted to use smartystreets
- tradeoffs between smarty streets and gmaps

#### Prompt to help initiate app scaffolding

- give me step by step to init the ts express api
- what about unit testing
- jest ts-jest @types/jest supertest @types/supertest: do i need all of these? why?
- {{ PASTED APP INIT FILE index.ts}} apply cors

#### Snapshot Bash Script

- ubuntu command line to get content of all files of a directory (except package-lock.json), paste them into a txt file together with they paths. Example:
  FILE_PATH: './path/to/my/file'
  CONTENT '{file content goes here}'
- can i save this in a snapshot.sh fle
- improve this to also ignore node_modules, add functionality
  to receive file extensions as optional arguments, if file
  extension is provided, then, only files with that file
  extension should be snapshoted, else all extensions
- Exclude node_modules, .git, and package-lock.json
- how to ignore test files
- how to extend this to optionally snapshot only a provided directory in the following way .snapshot.sh -d src/address -d src/types -e .ts

#### Architecture and Structuring Prompts

- put the below project in the traditional layered architecture:
  controller and service. also create an abstract class that will serve to communicate with
  the external geo service api. this class should be implemented for
  both google and the other option you mentioned
  {{ PASTED SNAPSHOT }}
- do i need the AddressService layer or is it better to pass in
  an Instance of GeoService?
- what about folder structuring? where to put the abstract class and its implementations?
- {{ PASTED AddressModule file }} where should i grab the env variables with api keys? on module or geoservice level?
- {{ PASTED SNAPSHOT }} // No prompt here, just to check AI's evaluation. Did this several times throughout development

#### Routing Prompts based on last mentioned prompt

- isnt it better to have an address router class?
- where should this router be given a validate-address route? index, address module or inside itself?
- address router will be exposed from addressmodule instead of address controller
- what if i define the router inside the controller as public readonly router: Router;
- so what is a better naming for public readonly router: Router; inside of AddressRouter
- how do you see router.router?
- {{ Pasted a version of AddressModule with public readonly router: Router inside of it for a small code completion }}

#### Evaluation Prompts

- {{ PASTED SNAPSHOT }} evaluate under SOLID principles and architecture, system design considerations
- next steps and points for improvement

#### Error Handling Prompts

- what is the best way to handle errors in a proper way together with status codes and send it in a well defined structure to the client?
- what is the best naming for a map between error keys and status codes
- what status codes should be given for these error keys {{ Listed Error Keys }}
- {{ PASTED SNAPSHOT }}
- {{ A few iterations of pasting a SNAPSHOT with updated error handling based on answer of last prompt }}
- if i am communicating with external services on the geoservice layer, shall i throw errors from there? shall they be catched on both service and controller layers?

#### EnvManager Class Prompts

- is it overkill to have a dedicated class to handle grabbing env variables?
- {{ PASTED .env FILE }} for evaluation
- implement it in a class (at the end I chose not to go further with this)

#### Data Validation Prompts

- what is the best layer to handle data validation from requests?
- what about a schema validator class using joi
- {{ PASTED SNAPSHOT with SchemaValidator class implementation but got suggestion to user middleware instead }}
- this.router.post("/validate", validateSchema(addressPayloadSchema), controller.validateAddress.bind(controller)); in this case, what will happen if middleware throws error
- {{ PASTED SNAPSHOT }}
- After iterating over last suggestions from last answer: {{ PASTED SNAPSHOT }} make a general evaluation

#### Logging Prompts

- how to implement propper logging: what to log and what not to log?
- how would i have centralized error loging on my error handler function? how to provide it to my error handler middleware from index.ts?
- what about two logger middlwares one for incoming requests other for errors
- what is the best approach to apply logging to my app {{ PASTED SNAPSHOT }}
- what do you think of
  - setup with logger class
  - req log middleware factory that takes class as argument and used as middleware
  - turn error handler middleware into factory injecting logger
- {{ PASTED SNAPSHOT }} - 2x
- isnt my loggin overkill? {{ PASTED SNAPSHOT }}
- {{ PASTED SNAPSHOT with leaner logging }}
- {{ PASTED AddressService file }} is it pertinent to log something here?

#### Documentation Prompts

- how can i implement documentation
- {{ Pasted an example from chatgpt itself with very long tsdoc annotations on one of my files}} is there a better option than this from a clean code perspective?
- step by step on how to implement documentation via yaml
- is it better to have this setupSwagger function or a SwaggerManager class
- {{ PASTED SNAPSHOT }}
- should docs folder be a child or a sibiling of src?

#### Rate Limiting Prompts

- how can i implement rate limiting
- what if i want to use rate limiting on app level? (gpt had suggested to apply on route level only)
- what is http code for RateLimitExceeded error key

#### Evaluation Prompts

- evaluate my app {{ PASTED SNAPSHOT }}

#### Testing Prompts

- what is pertinent to test
- {{ Pasted single file }} unit test this // I did this 8x for every tested file in the repo
- {{ PASTED SNAPSHOT }}
- {{ PASTED SNAPSHOT }} how can we implement integration tests
- Pasted a few iterations of failing tests
- how to silence console

#### Evaluation Prompts

- {{ PASTED SNAPSHOT }} make a detailed evaluation of this app from an architecture and system design perspective
- now detail this app as for someone who will take a look at it for the first time
  - highlight all important features and choices made
  - explain what is the purpose of each file
- now write a README explaining the general thought process throughout all this conversation
- 2x: now bring (all/the relevant) prompts i entered here // Not good, for memory limit reasons it got only the last 10 prompts, i had to revisit the whole conversation and grab the relevant prompts one by one
- {{ PASTED THIS PROMPTS FILE TILL LINE ABOVE THIS}} evaluation of these prompts

#### Prompts for implementing GoogleGeoServices and SmartyGeoServices

- {{ Pasted Empty GeoServices }} implement these
- {{ PASTED SNAPSHOT }} evaluate these implementations of geo services
- how to get google maps api keys
- now, how to get smarty streets credentials
- update swagger schema with error responses
- bring interfaces for both google and smarty api responses
- unit test this {{ Pasted GoogleGeoServices implementation }}
- unit test this {{ Pasted SmartyGeoServices implementation }}
