# Welcome to RightJS Core!

RightJS is a fine JavaScript framework full of sweet goodness and serious
kick-assery.

It lives over here <http://rightjs.org>, go check it, you won't regret!

# Build

To build the darn thing you need to hook up the `rightjs-util` submodule first

    git submodule init
    git submodule update

After that you'll need `Ruby` and `Java`. Then just say

    rake build

If you don't have `Java` you can build the script using the Google's API

    rake build REMOTE=true

There are also the following options to switch off some modules like that

    rake build OPTIONS=no-form,no-xhr,no-cookie

The list of options goes like that

  * `no-form` - no advanced forms features
  * `no-events` - no events delegation featuers
  * `no-cookie` - no cookies module
  * `no-xhr` - no ajax support
  * `no-fx` - no visual effects
  * `no-olds` - puts the old browsers support in a separate file
  * `safe` - builds the safe-mode version
  
Enjoy!


# License

The code released under terms of the MIT License

Copyright (C) 2008-2010 Nikolay Nemshilov