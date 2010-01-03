# Browser

`Browser` is a global object that contains markers allowing you to determine
the current type of browser. There are the following keys available:

Key           | Description                         |
--------------|-------------------------------------|
IE            | Internet Explorer of any version    |
Opera         | Opera browser                       |
WebKit        | WebKit based browser                |
Gecko         | Gecko based browser                 |
MobileSafari  | MobileSafari browser                |
Konqueror     | KDE default browser                 |
OLD           | an internal marker for IE6 and 7    |

Usage is pretty much straight forward

    if (Browser.IE) {
      alert("Welcome to the hell");
    }

Check the [browsers](/browsers) page for more information on supported browsers