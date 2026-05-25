
## Link your package locally for testing:

###  Test Locally 
`npm link`

`npm unlink -g`

`npm link pomanalyzer`

## Now you can run the script globally using:

```pomanalyzer <filePath>```


## Publish the Package
### Login to npm (if you haven't already):
`npm login`

### Publish the package:
`npm publish`


###  Install the Package Globally
Once published, you (or anyone) can install the package globally using:
`npm install -g pomanalyzer`

### Check [Documentation](DOCUMENTATION.md) for more details

```bash
npm view pomanalyzer versions --json && npm dist-tag ls pomanalyzer || true


# show available published versions
npm view pomanalyzer versions --json

# show which version is tagged as "latest"
npm dist-tag ls pomanalyzer

# show the single latest version
npm view pomanalyzer version

# fetch raw registry JSON (inspect dist-tags)
curl -s https://registry.npmjs.org/pomanalyzer | jq '.\"dist-tags\"'

npm login
npm publish

npm dist-tag add pomanalyzer@1.0.2 latest
```