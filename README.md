# Welcome to RightJS Core!

RightJS is a fancy JavaScript framework which

* Compact by itself and allows others to write compact code
* Has standard predictable and really comfy API
* Supports multi-paradigm development and extensive OOP abilities
* Modular, with small and fast core
* Works fast and stable


RightJS is a server-side developers oriented framework, it's made to help
us do JavaScript programming in the most natural and effective way.

And yes, we have cookies too.


# Contacts

For further information, please proceed to the official site of the project

<http://rightjs.org>


# Build

For building the scripts we use [FrontCompiler](http://github.com/MadRabbit/frontcompiler)
a Ruby based JavaScript/CSS/HTML compression tool. For that you need to have
Ruby and the 'front-compiler' gem installed.

    gem sources -a http://gemcutter.org
    gem install front-compiler
    
After that just say in the root of the project

    rake build
    
For having two file builds, use the `no-olds` option like that

    rake build OPTIONS=no-olds


The code released under terms of the MIT License
Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St.