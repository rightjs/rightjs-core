# Welcome Home!

RightJS is a fine JavaScript framework that's designed to make you happy.
It lives over here <http://rightjs.org>, go check it, you won't regret!


## How To Build

To build the core on your own, you'll need [NodeJS](http://nodejs.org) and
if you also have [npm](http://npmjs.org) you might want to install the
[nake](https://github.com/MadRabbit/Nake) tools

    npm install nake

After that either run `nake`

    nake build

or, if you don't have [npm](http://npmjs.org), just run the `Nakefile`
directly with [NodeJS](http://nodejs.org)

    node Nakefile build

Try, `-l` or `--list` key to see which other tasks are available


## Options

You can switch off some modules from the core by using the `OPTIONS` key

    nake build OPTIONS=no-olds,no-fx

The list of available options is the following

  * `no-form` - no advanced form features
  * `no-events` - no events delegation features
  * `no-cookie` - no cookies module
  * `no-xhr` - no ajax support
  * `no-fx` - no visual effects module
  * `no-olds` - puts the old browsers support in a separated file


## License

The code released under terms of the MIT License

Copyright (C) 2008-2011 Nikolay Nemshilov