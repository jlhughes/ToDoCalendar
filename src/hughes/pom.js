foam.POM({
  name: 'hughes',
  projects: [
    { name: 'account/pom' },
    { name: 'journal/pom' },
    { name: 'ledger/pom' },
  ],
  files: [
    { name: 'Relationships',
      flags: 'js|java' }
  ]
});
