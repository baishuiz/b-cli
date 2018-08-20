# cpack
---
> cjia pack tool, based on grunt

## Install
```
npm install -g grunt-cli  # if no grunt
npm install -g cpack
```

## Command
---
```
Usage: cpack [Command]

Command:
    default         # standard pack *optional, *default

    debug           # standard pack without uglify

    build           # standard pack then generate a zip file for deploy

    build-debug     # build without uglify

    hybrid          # standard pack then generate hybrid zip file with config.hybrid.json in project

    hybrid-debug    # hybrid without uglify

```

## History
---
### v1.0.34
  * 