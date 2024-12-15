# Journal 
FOAM Demonstration/Teaching application. 
A collection of *Event*s

## Events
* Date, time event - a calendar event. appointment, todo
* An Invoice, or debit, credit - a financial ledger entry
* Password change, with notification for next change
* Attachments
* Parent/Child relationship - furnace purchase can have maintenance events

## Installing

1. `git clone git@github.com:jlhughes/Journal.git`

1. `cd Journal`

1. `npm install`

1. `git clone git@github.com:kgrgreer/foam3.git`

1. `cd foam3`

1. `npm install`

## Building and Running locally
### Build and deploy from live model files

From the root of the `Journal` repository:

`./deployment/demo/run.sh -c`

The website will be available at 

`http://localhost:8100`

With this deployment style you can edit models (mostly) and then hard refresh the site to see the changes.

### Build and deploy from a jar file

From the root of the `Journal` repository:

`./deployment/demo/run-u.sh -c`

The website will be available at 

`https://localhost:8100`

With this deployment style and model changes require re-deployment.

**NOTE: this deployment uses a self-sign certificate which your browser will warn you about**

## Log In

Log in with one of three tests accounts

username: `bob` ( or bill or betty)

password: `demopassword`

## Use
- Events - track ToDos, appointments, ... 
- Assets - track physical items, can be associated with Events
- Passwword - manage passwords
- Accounts - manage Cash or Credit Accounts and see balance modified by Ledger entries on Events.

## Other 
Ledger entries on Events create double entry accounting Transactions which modify the balance of the two accounts involved. 
