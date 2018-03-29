Spent first 30 minutes reading through code, finding and reading https://tools.ietf.org/html/rfc6901 on JSON pointers.

Brainstormed in the shower for 15 minutes.

Things to avoid:
- recursion (dangerous and hard to debug)
- loss of information (makes error messages harder and debugging)
- unboundedness (always nice to have a progress bar/metric)

Stated strategy:
- JSON.parse(input)
- walk through object and find all $refs
- resolve all refs (or given subset) iteratively
- collect unresolvable or invalid refs into error messages
- build output object

Let's see how close we stick to that plan...

Got these steps done before bed:
- walk through object and find all $refs
- resolve all refs (or given subset) iteratively
- collect invalid refs into error messages

Got these steps done at coffee shop this morning:
- JSON.parse(input)
- build output object
- collect unresolvable into error messages
