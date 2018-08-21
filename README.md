# B-CLI
---




## Installing the CLI
```
npm install -g grunt-cli  # if no grunt
npm install -g @baishuiz/b-cli
```
This will put the <code>b</code> command in your system path, allowing it to be run from directory.

## Create Project
```
b init my-project-name
```
It will create a directory called `my-project-name` inside the current folder.  
Inside that directory, it will generate the initial project structure.

## Build App
### build webapp
```
b build webapp [--debug]
```

### build IOS
```
b build IOS
```

### build Android
```
b build Android
```

<!-- 
## Command List
---
```
Usage: b [Command]

Command:
    default         # standard pack *optional, *default

    debug           # standard pack without uglify

    build           # standard pack then generate a zip file for deploy

    build-debug     # build without uglify

    hybrid          # standard pack then generate hybrid zip file with config.hybrid.json in project

    hybrid-debug    # hybrid without uglify

```

## History
--- -->
