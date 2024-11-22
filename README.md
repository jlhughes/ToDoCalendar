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
Checkout this repository

`git clone git@github.com:jlhughes/Journal.git`

`cd Journal`

`npm install`

`git clone git@github.com:kgrgreer/foam3.git`

`cd foam3`

`npm install`

Presently `Journal` depends on a particular FOAM branch

`git fetch origin SignInSignUp`

`git checkout SignInSignUp`

## Building and Running locally

From the root of the `Journal` repository:

`./deployment/demo/run.sh -c`

The website will be available at 

`https://localhost:8100`

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
