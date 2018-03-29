# Stoplight Resolver

The Stoplight resolver recursively resolves JSON pointers and remote authorities.

It turns something like this:

```json
{
  "user": {
    "address": {
      "$ref": "#/address"
    }
  },
  "address": {
    "number": "123",
    "street": "Kirby Lane"
  }
}
```

Into this:

```json
{
  "user": {
    "address": {
      "address": {
        "number": "123",
        "street": "Kirby Lane"
      }
    }
  },
  "address": {
    "number": "123",
    "street": "Kirby Lane"
  }
}
```

You can find examples of expected input and output for a variety of use cases in the `__tests__/fixtures/schemas` folder. Only fixtures with `input` and `expected` properties in the root JSON are relevant for testing.

Find tests in the **tests** folder. They range from testing simple cases to very complicated cases. Recommend to obviously start with the simple ones :). Remove the `.skip` from tests to run them.

### Features

These are copied from our actual readme, to give you an idea of what our production grade resolver does.

* Performant. Hot paths are memoized, only one crawl is needed, and remote authorities are resolved concurrently.
* Caching. Results from remote authorities are cached.
* Immutable. The original object is not changed, and structural sharing is used to only change relevant bits.
* Reference equality. Pointers to the same location will resolve to the same object in memory.
* Flexible. Bring your own readers for http://, file://, mongo://, custom://... etc.
* Reliable. Well tested to handle all sorts of circular reference scenarios.
