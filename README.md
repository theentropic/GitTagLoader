# Git tag loader

A build task that will load the first specified tag from the list of tags on the current branch, and store the annotation and label in variables for use in other tasks.

### Arguments
##### Filter
The filter for the tag to be found.  If `latest` is specified (case does not matter), it will grab the most recent tag created.

##### Lines
The number of lines to grab from an annotated tag, default value of `100`.

##### Variables Prefix
The value entered here will be prefixed to each variable name generated.  This can be useful when using this task multiple times during a build and getting multiple tags with different filters.

Example: 
```
$([YourPrefix]Tag.Label)
```

### Generated Variables
For the specified tag found, build variables will be created in the format of:

Example: 
```
$(Tag.Label)
``` 

| Variable | Description |
|----------|-------------|
| Tag.Label | The name of the tag. |
| Tag.Annotation | The annotation of the tag, if one exists |
| Tag.Annotation.Html | The annotation of the tag, with linebreaks replaced with `<br>` tags |