# MaSo - Matematická Soutěž

[![Build Status](https://travis-ci.org/snEk42/MaSo.svg?branch=master)](https://travis-ci.org/snEk42/MaSo)

Web application automating processes around MaSo (math competition) preparation and organization.
Competition description available at <http://maso.mff.cuni.cz> (czech only).

![homepage image](header.png)

## Development setup

If you are new to Node.js development here is [detailed setup](./docs/linux-setup.md).

### Prerequisites

- install Node.js current release (<https://nodejs.org/en/>)
- install Docker (<https://docs.docker.com/engine/installation/mac/>)

### Setup

Clone Maso repository

```bash
git clone https://github.com/Matematicka-Soutez/Web.git
```

Install packages

```bash
npm install
```

Run automatically reloaded development server (Services like postgres, redis, ...
are run in a docker container automatically, but you might run into port collision problems.)

```bash
npm run dev
```

## Testing

We put emphasis on testing our code, though we're not able to follow through every time.
You should add at least API tests when contributing and fix the ones you break by your change.

You can run both API and fronted tests by

```bash
npm run tests
```

## Contributing

We're preparing this project to be contributor friendly. Unfortunately it's not the case yet,
but if you're interested already, please ping us at maso-soutez@googlegroups.com. You don't
even have to be a developer, we seek all people interested in math and additional ways of
educating children.